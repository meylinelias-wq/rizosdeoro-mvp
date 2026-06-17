-- =====================================================
-- RIZOS DE ORO — Tabla de ingredientes
-- Pegar esto en: Supabase → SQL Editor → New query
-- Luego pulsar RUN
-- =====================================================

create table if not exists ingredientes (
  id            bigint generated always as identity primary key,
  nombre_inci   text not null unique,
  nombre_comun  text,
  clasificacion text not null check (clasificacion in ('verde','amarillo','rojo')),
  funcion       text not null,
  explicacion   text not null,
  nota_riesgo   text,
  cg_friendly   boolean not null default true
);

-- Lectura pública (la app lee con la clave anon)
alter table ingredientes enable row level security;

create policy "Lectura pública" on ingredientes
  for select using (true);

-- ── INSERTAR LOS 75 INGREDIENTES ─────────────────────

insert into ingredientes (nombre_inci, nombre_comun, clasificacion, funcion, explicacion, nota_riesgo, cg_friendly)
values

-- AGUA
('Water', 'Agua', 'verde', 'Hidratante', 'La base de casi todos los productos. Proporciona hidratación directa al cabello.', null, true),
('Aqua', 'Agua', 'verde', 'Hidratante', 'La base de casi todos los productos. Proporciona hidratación directa al cabello.', null, true),

-- HUMECTANTES
('Glycerin', 'Glicerina', 'verde', 'Humectante', 'Atrae la humedad del ambiente hacia el cabello. Uno de los mejores humectantes para rizos.', null, true),
('Glycerol', 'Glicerina', 'verde', 'Humectante', 'Atrae la humedad del ambiente hacia el cabello. Uno de los mejores humectantes para rizos.', null, true),
('Aloe Barbadensis Leaf Juice', 'Aloe Vera', 'verde', 'Humectante', 'El aloe vera hidrata, calma el cuero cabelludo y ayuda a definir los rizos de forma natural.', null, true),
('Aloe Vera', 'Aloe Vera', 'verde', 'Humectante', 'Hidrata, calma el cuero cabelludo y ayuda a definir los rizos de forma natural.', null, true),
('Panthenol', 'Pantenol / Pro-Vitamina B5', 'verde', 'Humectante', 'Penetra el cabello, lo hidrata desde adentro y añade suavidad y elasticidad. Excelente para rizos.', null, true),
('Propylene Glycol', 'Propilenglicol', 'amarillo', 'Humectante', 'Humectante efectivo pero puede causar irritación en cuero cabelludo sensible con uso frecuente.', 'Puede irritar en concentraciones altas o cuero cabelludo sensible.', true),
('Butylene Glycol', 'Butilenglicol', 'verde', 'Humectante', 'Humectante suave que ayuda a retener la hidratación sin pesar el cabello.', null, true),
('Sorbitol', 'Sorbitol', 'verde', 'Humectante', 'Azúcar natural que atrae la humedad. Suave y bien tolerado.', null, true),
('Honey', 'Miel', 'verde', 'Humectante', 'La miel es un humectante natural que también añade brillo y suavidad al cabello.', null, true),
('Mel', 'Miel', 'verde', 'Humectante', 'La miel es un humectante natural que también añade brillo y suavidad al cabello.', null, true),

-- ALCOHOLES GRASOS (buenos — no confundir con alcoholes desnaturalizados)
('Cetearyl Alcohol', 'Alcohol Cetearílico', 'verde', 'Emoliente', 'Aunque tiene "alcohol" en el nombre, es un alcohol graso que suaviza, hidrata y da cremosidad. No reseca el cabello.', null, true),
('Cetyl Alcohol', 'Alcohol Cetílico', 'verde', 'Emoliente', 'Alcohol graso emoliente que suaviza el cabello y facilita el peinado. No reseca.', null, true),
('Stearyl Alcohol', 'Alcohol Estearílico', 'verde', 'Emoliente', 'Alcohol graso que suaviza y acondiciona el cabello. Muy usado en mascarillas y acondicionadores.', null, true),
('Behenyl Alcohol', 'Alcohol Behénico', 'verde', 'Emoliente', 'Alcohol graso muy suave, ideal para cabello rizado. Ayuda a controlar el frizz.', null, true),

-- ALCOHOLES DESNATURALIZADOS (malos)
('Alcohol Denat', 'Alcohol Desnaturalizado', 'rojo', 'Otro', 'Reseca el cabello, elimina la humedad natural y puede dañar la cutícula con el tiempo.', 'Evitar en cabello rizado y poroso. Solo aceptable en cantidades mínimas al final de la lista.', false),
('SD Alcohol', 'Alcohol SD', 'rojo', 'Otro', 'Alcohol volátil que reseca el cabello y puede provocar frizz.', 'Evitar en cabello rizado. Similar al alcohol desnaturalizado.', false),
('Isopropyl Alcohol', 'Alcohol Isopropílico', 'rojo', 'Otro', 'Reseca intensamente el cabello y el cuero cabelludo.', 'Evitar. Muy agresivo para el cabello rizado.', false),

-- SULFATOS (malos)
('Sodium Lauryl Sulfate', 'SLS / Sulfato de Sodio Laurilo', 'rojo', 'Surfactante', 'Limpia muy agresivamente, elimina el sebo natural del cuero cabelludo y reseca el cabello rizado.', 'El sulfato más agresivo. Evitar en cabello rizado, especialmente poroso o dañado.', false),
('Sodium Laureth Sulfate', 'SLES / Sulfato de Sodio Laureth', 'rojo', 'Surfactante', 'Sulfato más suave que el SLS pero igualmente desecante para el cabello rizado.', 'Evitar en cabello rizado. Puede usarse ocasionalmente para limpiezas profundas si no hay opción.', false),
('Ammonium Lauryl Sulfate', 'Sulfato de Amonio Laurilo', 'rojo', 'Surfactante', 'Sulfato agresivo que reseca y daña la cutícula del cabello rizado.', 'Evitar. Tan agresivo como el SLS.', false),
('Ammonium Laureth Sulfate', 'Sulfato de Amonio Laureth', 'rojo', 'Surfactante', 'Sulfato con similar acción al SLES. Reseca el cabello rizado.', null, false),
('Sodium Lauryl Sulfoacetate', 'SLSA', 'amarillo', 'Surfactante', 'Sulfoacetato derivado del coco. Más suave que los sulfatos tradicionales, genera espuma sin ser tan agresivo.', 'No es CG-friendly estricto, pero mucho más suave que SLS/SLES.', false),

-- SURFACTANTES SUAVES (buenos)
('Cocamidopropyl Betaine', 'Betaína de Coco', 'verde', 'Surfactante', 'Surfactante suave derivado del aceite de coco. Limpia sin agredir y es CG-friendly.', null, true),
('Sodium Cocoyl Isethionate', 'SCI / Isethionato de Cocoilo', 'verde', 'Surfactante', 'Surfactante muy suave derivado del coco. Limpia sin resecar y deja el cabello suave.', null, true),
('Disodium Lauryl Sulfosuccinate', 'Sulfosuccinato Suave', 'verde', 'Surfactante', 'Surfactante suave y CG-friendly. Limpia sin eliminar la humedad del cabello.', null, true),
('Sodium Lauroyl Methyl Isethionate', 'Surfactante Suave de Coco', 'verde', 'Surfactante', 'Limpiador suave que no agrede el cabello rizado ni el cuero cabelludo.', null, true),

-- ACONDICIONADORES CATIÓNICOS
('Behentrimonium Chloride', 'Cloruro de Beheniltrimonium', 'verde', 'Acondicionador', 'Acondicionador muy suave que reduce el frizz y facilita el desenredado. Muy bien tolerado.', null, true),
('Behentrimonium Methosulfate', 'BTMS', 'verde', 'Acondicionador', 'Acondicionador catiónico que suaviza el cabello rizado y reduce el frizz sin pesar.', null, true),
('Cetrimonium Chloride', 'Cloruro de Cetrimonio', 'amarillo', 'Acondicionador', 'Acondicionador catiónico. Efectivo pero en concentraciones altas puede acumularse.', 'OK en concentraciones bajas (generalmente al final de la lista de ingredientes).', true),
('Guar Hydroxypropyltrimonium Chloride', 'Guar catiónica', 'verde', 'Acondicionador', 'Derivado natural de la guar bean. Suaviza, facilita el desenredado y define rizos.', null, true),

-- PROTEÍNAS (precaución por overload)
('Hydrolyzed Keratin', 'Queratina Hidrolizada', 'amarillo', 'Proteína', 'Repara temporalmente el cabello dañado y sella la cutícula. Puede causar sobrecarga de proteína.', 'Úsalo con moderación. Si tu cabello está duro, crunchy o sin elasticidad, puede ser overload de proteína.', true),
('Hydrolyzed Wheat Protein', 'Proteína de Trigo Hidrolizada', 'amarillo', 'Proteína', 'Proteína de tamaño medio que penetra y fortalece el cabello. Riesgo de overload si se usa en exceso.', 'Monitorea cómo responde tu cabello. Si se vuelve rígido, reduce la frecuencia.', true),
('Hydrolyzed Collagen', 'Colágeno Hidrolizado', 'amarillo', 'Proteína', 'Proteína de colágeno que añade fuerza y elasticidad. Riesgo de overload con uso frecuente.', 'Equilibrar siempre con hidratación profunda.', true),
('Hydrolyzed Silk', 'Seda Hidrolizada', 'amarillo', 'Proteína', 'Proteína de seda muy fina que añade brillo y suavidad. Menos riesgo de overload que otras proteínas.', null, true),
('Hydrolyzed Soy Protein', 'Proteína de Soja Hidrolizada', 'amarillo', 'Proteína', 'Proteína vegetal que fortalece el cabello. Puede causar overload en cabello sensible a proteínas.', null, true),

-- SILICONAS NO SOLUBLES (malas)
('Dimethicone', 'Dimeticona / Silicona', 'rojo', 'Sellante', 'Silicona que crea una capa impermeable en el cabello. Bloquea la hidratación y se acumula.', 'Solo se elimina con sulfatos. Evitar si sigues el método Curly Girl.', false),
('Cyclomethicone', 'Ciclometicona / Silicona volátil', 'rojo', 'Sellante', 'Silicona volátil que puede acumularse y bloquear la hidratación del cabello rizado.', null, false),
('Cyclopentasiloxane', 'D5 / Silicona Volátil', 'rojo', 'Sellante', 'Silicona no soluble en agua que puede acumularse en el cabello rizado.', null, false),
('Amodimethicone', 'Amodimeticona', 'amarillo', 'Sellante', 'Silicona amino-funcional que se adhiere al cabello dañado. Más fácil de eliminar que Dimethicone.', 'Puede acumularse con uso frecuente. Revisar si está combinado con surfactantes solubles.', false),
('Phenyl Trimethicone', 'Feniltrimeticona', 'rojo', 'Sellante', 'Silicona que añade brillo pero se acumula y bloquea la hidratación.', null, false),

-- SILICONAS SOLUBLES EN AGUA (precaución)
('PEG-Dimethicone', 'Silicona Soluble en Agua (PEG)', 'amarillo', 'Sellante', 'Silicona soluble en agua. Se puede eliminar sin sulfatos, pero puede acumularse con el tiempo.', 'No es ideal para el método CG estricto, pero es menos problemática que las siliconas no solubles.', false),

-- ACEITES Y MANTECAS
('Argania Spinosa Kernel Oil', 'Aceite de Argán', 'verde', 'Sellante', 'Aceite ligero que sella la hidratación, añade brillo y reduce el frizz sin pesar el cabello.', null, true),
('Cocos Nucifera Oil', 'Aceite de Coco', 'amarillo', 'Sellante', 'Sella la cutícula y penetra el cabello. Puede ser demasiado pesado para porosidad alta o cabello fino.', 'Usar con moderación. Puede causar acumulación. Evitar en raíces.', true),
('Butyrospermum Parkii Butter', 'Manteca de Karité / Shea', 'verde', 'Sellante', 'Manteca nutritiva que sella la hidratación y suaviza el cabello muy rizado o afro.', null, true),
('Ricinus Communis Seed Oil', 'Aceite de Ricino / Castor Oil', 'amarillo', 'Sellante', 'Muy nutritivo y ayuda al crecimiento, pero puede ser muy pesado para algunos tipos de rizo.', 'Usar en pequeñas cantidades o mezclar con aceites más ligeros.', true),
('Helianthus Annuus Seed Oil', 'Aceite de Girasol', 'verde', 'Sellante', 'Aceite ligero rico en vitamina E. Sella la hidratación sin pesar el cabello.', null, true),
('Persea Gratissima Oil', 'Aceite de Aguacate', 'verde', 'Sellante', 'Aceite rico en grasas saludables que nutre y penetra el cabello dañado o seco.', null, true),
('Mangifera Indica Seed Butter', 'Manteca de Mango', 'verde', 'Sellante', 'Manteca suave que hidrata y define rizos sin dejar residuo pesado.', null, true),
('Prunus Amygdalus Dulcis Oil', 'Aceite de Almendras Dulces', 'verde', 'Sellante', 'Aceite suave y emoliente que facilita el desenredado y añade suavidad.', null, true),
('Jojoba Wax', 'Cera de Jojoba', 'verde', 'Sellante', 'Técnicamente una cera (no aceite) similar al sebo natural. Equilibra el cuero cabelludo y sella rizos.', null, true),
('Simmondsia Chinensis Seed Oil', 'Aceite de Jojoba', 'verde', 'Sellante', 'Técnicamente una cera líquida similar al sebo natural. Equilibra y sella la hidratación.', null, true),

-- CONSERVANTES
('Phenoxyethanol', 'Fenoxietanol', 'amarillo', 'Conservante', 'Conservante muy común y generalmente seguro en concentraciones normales (<1%).', null, true),
('Sodium Benzoate', 'Benzoato de Sodio', 'amarillo', 'Conservante', 'Conservante natural suave. Bien tolerado por la mayoría.', null, true),
('Potassium Sorbate', 'Sorbato de Potasio', 'verde', 'Conservante', 'Conservante natural derivado del ácido sórbico. Suave y bien tolerado.', null, true),
('Methylparaben', 'Metilparabeno', 'amarillo', 'Conservante', 'Parabeno. Controversia sobre seguridad aunque la evidencia actual no es concluyente.', 'Muchas personas con sensibilidades prefieren evitar los parabenos por precaución.', true),
('Propylparaben', 'Propilparabeno', 'amarillo', 'Conservante', 'Parabeno. Similar al metilparabeno. Sujeto a debate científico.', 'Muchas personas con sensibilidades prefieren evitar los parabenos por precaución.', true),

-- FRAGANCIAS
('Fragrance', 'Fragancia / Perfume', 'rojo', 'Otro', 'Término paraguas que puede esconder cientos de químicos. Frecuentemente alergénico e irritante.', 'Evitar en niñas y cuero cabelludo sensible. Puede causar dermatitis de contacto.', false),
('Parfum', 'Perfume / Fragancia', 'rojo', 'Otro', 'Término europeo para fragancia. Puede contener alérgenos no declarados.', 'Evitar en niñas y cuero cabelludo sensible.', false),

-- FIJADORES Y TEXTURIZANTES
('Carbomer', 'Carbopol / Carbómero', 'verde', 'Otro', 'Gelificante que da textura a geles y cremas. No afecta al cabello en sí mismo.', null, true),
('Hydroxyethylcellulose', 'Celulosa Vegetal', 'verde', 'Otro', 'Espesante derivado de la celulosa vegetal. CG-friendly y sin efectos negativos.', null, true),
('Polyquaternium-11', 'Polyquaternium-11', 'amarillo', 'Acondicionador', 'Fijador catiónico que define rizos. Puede acumularse con el tiempo.', 'Usar con moderación. Hacer limpiezas ocasionales si se acumula.', true),
('Polyquaternium-4', 'Polyquaternium-4', 'amarillo', 'Acondicionador', 'Fijador suave de origen vegetal. Compatible con el método CG.', null, true),
('Polyquaternium-37', 'Polyquaternium-37', 'verde', 'Acondicionador', 'Acondicionador catiónico suave que añade brillo y reduce el frizz.', null, true),

-- INGREDIENTES ESPECIALES
('Niacinamide', 'Niacinamida / Vitamina B3', 'verde', 'Hidratante', 'Vitamina que fortalece la barrera capilar y mejora la salud del cuero cabelludo.', null, true),
('Biotin', 'Biotina / Vitamina B7', 'verde', 'Otro', 'Vitamina asociada a la salud y crecimiento del cabello. Bien tolerada en productos tópicos.', null, true),
('Caffeine', 'Cafeína', 'verde', 'Otro', 'Estimula la circulación en el cuero cabelludo y puede ayudar al crecimiento capilar.', null, true),
('Rosmarinus Officinalis Leaf Oil', 'Aceite Esencial de Romero', 'amarillo', 'Otro', 'Aceite esencial con propiedades estimulantes del cuero cabelludo. Estudios prometedores para crecimiento.', 'Usar con moderación. No aplicar puro. Puede irritar en personas sensibles.', true),
('Menthol', 'Mentol', 'amarillo', 'Otro', 'Da sensación de frescor. Puede irritar el cuero cabelludo sensible o en niñas.', 'Evitar en niñas pequeñas y cuero cabelludo con eccema.', true),
('Citric Acid', 'Ácido Cítrico', 'verde', 'Otro', 'Regula el pH del producto. Ayuda a cerrar la cutícula y mejorar el brillo.', null, true),
('Sodium Hydroxide', 'Hidróxido de Sodio / Sosa', 'amarillo', 'Otro', 'Ajustador de pH. En concentraciones bajas es inofensivo. Forma parte de muchos productos.', null, true),
('Tocopherol', 'Vitamina E', 'verde', 'Emoliente', 'Antioxidante que protege el cabello del daño ambiental y añade suavidad.', null, true),
('Tocopheryl Acetate', 'Acetato de Vitamina E', 'verde', 'Emoliente', 'Forma estable de la vitamina E. Protege y suaviza el cabello.', null, true)

on conflict (nombre_inci) do nothing;

-- ✅ Listo. Ve a Table Editor → ingredientes para ver y editar los datos.
