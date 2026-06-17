export type TipoRizo = "2A" | "2B" | "2C" | "3A" | "3B" | "3C" | "4A" | "4B" | "4C";
export type Porosidad = "baja" | "media" | "alta" | "no sé";
export type EstadoCabello = "seco" | "dañado" | "mixto" | "saludable";
export type Objetivo = "hidratación" | "definición" | "crecimiento" | "brillo" | "anti-frizz";

export interface PerfilCapilar {
  nombre: string;
  tipoRizo: TipoRizo;
  porosidad: Porosidad;
  estado: EstadoCabello;
  objetivos: Objetivo[];
  creadoEn: string;
}

export type ClasificacionIngrediente = "verde" | "amarillo" | "rojo";
export type FuncionIngrediente =
  | "Hidratante"
  | "Sellante"
  | "Proteína"
  | "Surfactante"
  | "Conservante"
  | "Emoliente"
  | "Acondicionador"
  | "Humectante"
  | "Otro";

export type CategoriaIngrediente =
  | "silicona_soluble"
  | "silicona_no_soluble"
  | "sulfato_fuerte"
  | "sulfato_suave"
  | "alcohol_bueno"
  | "alcohol_malo"
  | "proteina"
  | "humectante"
  | "acondicionador"
  | "conservante"
  | "fragancia"
  | "aceite"
  | "otro";

export type CategoriaProducto =
  | "champú"
  | "acondicionador"
  | "leave-in"
  | "gel"
  | "mascarilla"
  | "aceite"
  | "crema"
  | "otro";

export interface ResultadoIngrediente {
  nombre: string;
  nombreComun?: string;
  clasificacion: ClasificacionIngrediente;
  // Texto libre: la base de datos unificada tiene funciones descriptivas
  // (ej. "Sellador / Brillo") que no encajan en la unión FuncionIngrediente
  funcion: string;
  explicacion: string;
  notaRiesgo?: string;
  categoria?: CategoriaIngrediente;
  razonClasificacion?: string;
  // Porosidad para la que está recomendado: "todas", "alta", "media", "baja", "alta,media", "media,baja"
  porosidadRecomendada?: string;
  // Advertencia personalizada si no encaja con la porosidad del usuario
  advertenciaPorosidad?: string;
}

export interface ResultadoAnalisis {
  nombreProducto: string;
  categoriaProducto?: CategoriaProducto;
  puntuacion?: number;
  veredicto: "recomendado" | "con-precaución" | "evitar";
  resumen: string;
  ingredientes: ResultadoIngrediente[];
  clasificacionFuncional: string;
  cgFriendly: boolean;
  ingredientesDestacados?: {
    problematicos: string[];
    beneficiosos: string[];
  };
}
