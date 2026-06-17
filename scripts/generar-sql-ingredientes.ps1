# =====================================================
# RIZOS DE ORO - Generador de SQL para Supabase
# Lee la Tabla Maestra (.xlsx) y genera el SQL de importación
# con codificación UTF-8 correcta (sin caracteres rotos).
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File scripts\generar-sql-ingredientes.ps1
#
# Por defecto busca el Excel en la carpeta padre del proyecto.
# Se puede pasar otra ruta:  -Xlsx "C:\ruta\al\archivo.xlsx"
# =====================================================
param(
  [string]$Xlsx = (Join-Path (Split-Path $PSScriptRoot -Parent) "..\Tabla_Maestra_Ingredientes_UNIFICADA_Rizos_de_Oro.xlsx"),
  [string]$Salida = (Join-Path (Split-Path $PSScriptRoot -Parent) "supabase\setup_ingredientes_unificado.sql")
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$Xlsx = [System.IO.Path]::GetFullPath($Xlsx)
$Salida = [System.IO.Path]::GetFullPath($Salida)
if (-not (Test-Path $Xlsx)) { throw "No se encuentra el Excel: $Xlsx" }

# ── Lectura del .xlsx (es un ZIP con XML dentro) ─────────────────────────────
# Apertura en modo compartido: funciona aunque el Excel esté abierto en otro programa
$stream = [System.IO.File]::Open($Xlsx, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$zip = New-Object System.IO.Compression.ZipArchive($stream, [System.IO.Compression.ZipArchiveMode]::Read)

function Read-Entry($zip, $name) {
  $e = $zip.GetEntry($name)
  if (-not $e) { throw "No existe la entrada $name en el xlsx" }
  $r = New-Object System.IO.StreamReader($e.Open(), [System.Text.Encoding]::UTF8)
  $t = $r.ReadToEnd(); $r.Close(); return $t
}

[xml]$rels = Read-Entry $zip "xl/_rels/workbook.xml.rels"
$relMap = @{}
foreach ($r in $rels.Relationships.Relationship) { $relMap[$r.Id] = $r.Target -replace '^/?xl/', '' }
[xml]$wb = Read-Entry $zip "xl/workbook.xml"
$sheetMap = @{}
foreach ($s in $wb.workbook.sheets.sheet) { $sheetMap[$s.name] = "xl/" + $relMap[$s.GetAttribute("r:id")] }

[xml]$ssXml = Read-Entry $zip "xl/sharedStrings.xml"
$shared = New-Object System.Collections.Generic.List[string]
foreach ($si in $ssXml.sst.si) {
  if ($si.t -ne $null -and $si.t -isnot [System.Xml.XmlElement]) { $shared.Add([string]$si.t) }
  elseif ($si.t -is [System.Xml.XmlElement]) { $shared.Add($si.t.InnerText) }
  else {
    $txt = ""
    foreach ($run in $si.r) { $txt += $run.t.InnerText }
    if ($txt -eq "") { $txt = $si.InnerText }
    $shared.Add($txt)
  }
}

function ColIndex($cellRef) {
  $letters = ($cellRef -replace '\d', '')
  $idx = 0
  foreach ($ch in $letters.ToCharArray()) { $idx = $idx * 26 + ([int]$ch - 64) }
  return $idx - 1
}

function Get-SheetRows($zip, $sheetPath) {
  [xml]$sx = Read-Entry $zip $sheetPath
  $filas = New-Object System.Collections.Generic.List[object]
  $headers = $null
  foreach ($row in $sx.worksheet.sheetData.row) {
    $cells = @{}
    foreach ($c in $row.c) {
      $ci = ColIndex $c.r
      $v = ""
      if ($c.t -eq "s") { if ($c.v -ne $null) { $v = $shared[[int]$c.v] } }
      elseif ($c.t -eq "inlineStr") { $v = $c.is.InnerText }
      else { if ($c.v -ne $null) { $v = [string]$c.v } }
      $cells[$ci] = ($v -replace "`r?`n", " ").Trim()
    }
    if ($null -eq $headers) {
      $headers = $cells
      continue
    }
    $obj = @{}
    foreach ($k in $headers.Keys) { $obj[$headers[$k]] = if ($cells.ContainsKey($k)) { $cells[$k] } else { "" } }
    $filas.Add($obj)
  }
  return $filas
}

Write-Host "Leyendo $Xlsx ..."
$ingredientes = Get-SheetRows $zip $sheetMap["INGREDIENTES"]
$sinonimos = Get-SheetRows $zip $sheetMap["SINONIMOS"]
$zip.Dispose()
Write-Host "Ingredientes: $($ingredientes.Count) | Sinonimos: $($sinonimos.Count)"

# ── Sinónimos por ingrediente (hoja SINONIMOS + columna sinonimos) ──────────
$aliasPorId = @{}
foreach ($s in $sinonimos) {
  $id = $s["id_ingrediente"]
  if (-not $id) { continue }
  if (-not $aliasPorId.ContainsKey($id)) { $aliasPorId[$id] = New-Object System.Collections.Generic.List[string] }
  if ($s["alias"]) { $aliasPorId[$id].Add($s["alias"]) }
}

function Esc($s) {
  if ($null -eq $s -or $s -eq "") { return "null" }
  return "'" + ($s -replace "'", "''") + "'"
}

# ── Construcción de filas SQL ────────────────────────────────────────────────
$values = New-Object System.Collections.Generic.List[string]
$clasifInvalidas = 0
foreach ($r in $ingredientes) {
  $inci = $r["nombre_inci"]
  if (-not $inci) { continue }

  $clasif = $r["clasificacion"].ToLower().Trim()
  if ($clasif -notin @("verde", "amarillo", "rojo")) { $clasifInvalidas++; continue }

  # cg_friendly: "Sí" y "Con precaución" cuentan como compatibles con el método curly;
  # solo "No" (sulfatos fuertes, siliconas no solubles, ceras...) lo descarta.
  $cg = if ($r["apto_metodo_curly"] -eq "No") { "false" } else { "true" }

  # nota_riesgo derivada de las columnas de la tabla maestra
  $notas = @()
  if ($r["se_acumula"] -match '^(S|Puede)') { $notas += "Puede acumularse en el cabello con el uso frecuente." }
  if ($r["requiere_clarificar"] -match '^(S|Ocasional|Recomendable)') { $notas += "Conviene usar un champú clarificante de vez en cuando." }
  $notaRiesgo = $notas -join " "

  # porosidad_recomendada: porosidades donde el ingrediente es apto sin reservas
  # (la celda empieza por "Sí"). "Con precaución/moderación" NO cuenta como apta.
  # Si es apto en las 3 (o en ninguna: los rojos, que ya avisan por sí solos) → "todas"
  $porosAptas = @()
  if ($r["apto_porosidad_baja"] -match '^S') { $porosAptas += "baja" }
  if ($r["apto_porosidad_media"] -match '^S') { $porosAptas += "media" }
  if ($r["apto_porosidad_alta"] -match '^S') { $porosAptas += "alta" }
  $porosidad = if ($porosAptas.Count -eq 3 -or $porosAptas.Count -eq 0) { "todas" } else { $porosAptas -join "," }

  # Sinónimos: columna propia + hoja SINONIMOS, sin duplicados ni el propio INCI
  $todos = New-Object System.Collections.Generic.List[string]
  if ($r["sinonimos"]) { foreach ($p in ($r["sinonimos"] -split '\|')) { $todos.Add($p.Trim()) } }
  if ($aliasPorId.ContainsKey($r["id"])) { foreach ($a in $aliasPorId[$r["id"]]) { $todos.Add($a.Trim()) } }
  $vistos = @{}
  $unicos = foreach ($t in $todos) {
    if (-not $t) { continue }
    $k = $t.ToLower()
    if ($k -eq $inci.ToLower()) { continue }
    if ($vistos.ContainsKey($k)) { continue }
    $vistos[$k] = $true
    $t
  }
  $sin = ($unicos -join " | ")

  $values.Add("  (" + (@(
    Esc $inci
    Esc $r["nombre_comun"]
    Esc $clasif
    Esc $r["funcion"]
    Esc $r["explicacion_usuaria"]
    Esc $r["categoria"]
    Esc $r["aporte_cronograma"]
    Esc $r["tipo_cabello"]
    Esc $sin
    Esc $notaRiesgo
    Esc $porosidad
    $cg
  ) -join ", ") + ")")
}

if ($clasifInvalidas -gt 0) { Write-Warning "$clasifInvalidas filas con clasificación no válida fueron omitidas" }

# ── Armar SQL final ──────────────────────────────────────────────────────────
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine(@"
-- =====================================================
-- RIZOS DE ORO - TABLA MAESTRA UNIFICADA ($($values.Count) ingredientes)
-- Generado desde: $(Split-Path $Xlsx -Leaf)
-- Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm')
-- Pegar en: Supabase -> SQL Editor -> New Query -> RUN
-- (Reemplaza TODO el contenido anterior de la tabla)
-- =====================================================

-- 1. Crear tabla si no existe
create table if not exists ingredientes (
  id                bigint generated always as identity primary key,
  nombre_inci       text not null unique,
  nombre_comun      text,
  clasificacion     text not null check (clasificacion in ('verde','amarillo','rojo')),
  funcion           text not null,
  explicacion       text not null,
  categoria         text,
  aporte_cronograma text,
  tipo_cabello      text,
  sinonimos         text,
  nota_riesgo       text,
  porosidad_recomendada text,
  cg_friendly       boolean not null default true
);

-- 1b. Columnas nuevas por si la tabla ya existía
alter table ingredientes add column if not exists categoria         text;
alter table ingredientes add column if not exists aporte_cronograma text;
alter table ingredientes add column if not exists tipo_cabello      text;
alter table ingredientes add column if not exists sinonimos         text;
alter table ingredientes add column if not exists nota_riesgo       text;
alter table ingredientes add column if not exists porosidad_recomendada text;

-- 2. Seguridad: lectura pública (la app solo lee)
alter table ingredientes enable row level security;

do `$`$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'ingredientes' and policyname = 'Lectura publica'
  ) then
    execute 'create policy "Lectura publica" on ingredientes for select using (true)';
  end if;
end `$`$;

-- 3. Vaciar la tabla y cargar los datos limpios
truncate table ingredientes restart identity;

insert into ingredientes (nombre_inci, nombre_comun, clasificacion, funcion, explicacion, categoria, aporte_cronograma, tipo_cabello, sinonimos, nota_riesgo, porosidad_recomendada, cg_friendly)
values
"@)
[void]$sb.AppendLine(($values -join ",`n") + ";")
[void]$sb.AppendLine()
[void]$sb.AppendLine("-- Verificación rápida")
[void]$sb.AppendLine("select clasificacion, count(*) from ingredientes group by clasificacion order by clasificacion;")

$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($Salida, $sb.ToString(), $utf8)
Write-Host "SQL generado: $Salida ($($values.Count) ingredientes)"
