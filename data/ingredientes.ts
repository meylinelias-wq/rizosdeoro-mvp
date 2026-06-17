import { ClasificacionIngrediente, FuncionIngrediente } from "@/types/perfil";

export interface IngredienteDB {
  nombreINCI: string;
  nombreComun?: string;
  clasificacion: ClasificacionIngrediente;
  funcion: FuncionIngrediente;
  explicacion: string;
  notaRiesgo?: string;
  cgFriendly: boolean;
}

// Base de datos de ingredientes capilares — clasificados para cabello rizado
// Fuente: método Curly Girl, ciencia capilar, nomenclatura INCI
export const BASE_INGREDIENTES: IngredienteDB[] = [
  // ─── AGUA ───
  {
    nombreINCI: "Water",
    nombreComun: "Agua",
    clasificacion: "verde",
    funcion: "Hidratante",
    explicacion: "La base de casi todos los productos. Proporciona hidratación directa al cabello.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Aqua",
    nombreComun: "Agua",
    clasificacion: "verde",
    funcion: "Hidratante",
    explicacion: "La base de casi todos los productos. Proporciona hidratación directa al cabello.",
    cgFriendly: true,
  },

  // ─── HUMECTANTES (verde) ───
  {
    nombreINCI: "Glycerin",
    nombreComun: "Glicerina",
    clasificacion: "verde",
    funcion: "Humectante",
    explicacion: "Atrae la humedad del ambiente hacia el cabello. Uno de los mejores humectantes para rizos.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Glycerol",
    nombreComun: "Glicerina",
    clasificacion: "verde",
    funcion: "Humectante",
    explicacion: "Atrae la humedad del ambiente hacia el cabello. Uno de los mejores humectantes para rizos.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Aloe Barbadensis Leaf Juice",
    nombreComun: "Aloe Vera",
    clasificacion: "verde",
    funcion: "Humectante",
    explicacion: "El aloe vera hidrata, calma el cuero cabelludo y ayuda a definir los rizos de forma natural.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Aloe Vera",
    nombreComun: "Aloe Vera",
    clasificacion: "verde",
    funcion: "Humectante",
    explicacion: "Hidrata, calma el cuero cabelludo y ayuda a definir los rizos de forma natural.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Panthenol",
    nombreComun: "Pantenol / Pro-Vitamina B5",
    clasificacion: "verde",
    funcion: "Humectante",
    explicacion: "Penetra el cabello, lo hidrata desde adentro y añade suavidad y elasticidad. Excelente para rizos.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Propylene Glycol",
    nombreComun: "Propilenglicol",
    clasificacion: "amarillo",
    funcion: "Humectante",
    explicacion: "Humectante efectivo pero puede causar irritación en cuero cabelludo sensible con uso frecuente.",
    notaRiesgo: "Puede irritar en concentraciones altas o cuero cabelludo sensible.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Butylene Glycol",
    nombreComun: "Butilenglicol",
    clasificacion: "verde",
    funcion: "Humectante",
    explicacion: "Humectante suave que ayuda a retener la hidratación sin pesar el cabello.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Sorbitol",
    nombreComun: "Sorbitol",
    clasificacion: "verde",
    funcion: "Humectante",
    explicacion: "Azúcar natural que atrae la humedad. Suave y bien tolerado.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Honey",
    nombreComun: "Miel",
    clasificacion: "verde",
    funcion: "Humectante",
    explicacion: "La miel es un humectante natural que también añade brillo y suavidad al cabello.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Mel",
    nombreComun: "Miel",
    clasificacion: "verde",
    funcion: "Humectante",
    explicacion: "La miel es un humectante natural que también añade brillo y suavidad al cabello.",
    cgFriendly: true,
  },

  // ─── ALCOHOLES GRASOS (verde — no confundir con alcoholes desnaturalizados) ───
  {
    nombreINCI: "Cetearyl Alcohol",
    nombreComun: "Alcohol Cetearílico",
    clasificacion: "verde",
    funcion: "Emoliente",
    explicacion: "Aunque tiene 'alcohol' en el nombre, es un alcohol graso que suaviza, hidrata y da cremosidad. No reseca el cabello.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Cetyl Alcohol",
    nombreComun: "Alcohol Cetílico",
    clasificacion: "verde",
    funcion: "Emoliente",
    explicacion: "Alcohol graso emoliente que suaviza el cabello y facilita el peinado. No reseca.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Stearyl Alcohol",
    nombreComun: "Alcohol Estearílico",
    clasificacion: "verde",
    funcion: "Emoliente",
    explicacion: "Alcohol graso que suaviza y acondiciona el cabello. Muy usado en mascarillas y acondicionadores.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Behenyl Alcohol",
    nombreComun: "Alcohol Behénico",
    clasificacion: "verde",
    funcion: "Emoliente",
    explicacion: "Alcohol graso muy suave, ideal para cabello rizado. Ayuda a controlar el frizz.",
    cgFriendly: true,
  },

  // ─── ALCOHOLES DESNATURALIZADOS (rojo) ───
  {
    nombreINCI: "Alcohol Denat",
    nombreComun: "Alcohol Desnaturalizado",
    clasificacion: "rojo",
    funcion: "Otro",
    explicacion: "Reseca el cabello, elimina la humedad natural y puede dañar la cutícula con el tiempo.",
    notaRiesgo: "Evitar en cabello rizado y poroso. Solo aceptable en cantidades mínimas al final de la lista.",
    cgFriendly: false,
  },
  {
    nombreINCI: "SD Alcohol",
    nombreComun: "Alcohol SD",
    clasificacion: "rojo",
    funcion: "Otro",
    explicacion: "Alcohol volátil que reseca el cabello y puede provocar frizz.",
    notaRiesgo: "Evitar en cabello rizado. Similar al alcohol desnaturalizado.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Isopropyl Alcohol",
    nombreComun: "Alcohol Isopropílico",
    clasificacion: "rojo",
    funcion: "Otro",
    explicacion: "Reseca intensamente el cabello y el cuero cabelludo.",
    notaRiesgo: "Evitar. Muy agresivo para el cabello rizado.",
    cgFriendly: false,
  },

  // ─── SULFATOS (rojo) ───
  {
    nombreINCI: "Sodium Lauryl Sulfate",
    nombreComun: "SLS / Sulfato de Sodio Laurilo",
    clasificacion: "rojo",
    funcion: "Surfactante",
    explicacion: "Limpia muy agresivamente, elimina el sebo natural del cuero cabelludo y reseca el cabello rizado.",
    notaRiesgo: "El sulfato más agresivo. Evitar en cabello rizado, especialmente poroso o dañado.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Sodium Laureth Sulfate",
    nombreComun: "SLES / Sulfato de Sodio Laureth",
    clasificacion: "rojo",
    funcion: "Surfactante",
    explicacion: "Sulfato más suave que el SLS pero igualmente desecante para el cabello rizado.",
    notaRiesgo: "Evitar en cabello rizado. Puede usarse ocasionalmente para limpiezas profundas si no hay opción.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Ammonium Lauryl Sulfate",
    nombreComun: "Sulfato de Amonio Laurilo",
    clasificacion: "rojo",
    funcion: "Surfactante",
    explicacion: "Sulfato agresivo que reseca y daña la cutícula del cabello rizado.",
    notaRiesgo: "Evitar. Tan agresivo como el SLS.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Ammonium Laureth Sulfate",
    nombreComun: "Sulfato de Amonio Laureth",
    clasificacion: "rojo",
    funcion: "Surfactante",
    explicacion: "Sulfato con similar acción al SLES. Reseca el cabello rizado.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Sodium Lauryl Sulfoacetate",
    nombreComun: "SLSA",
    clasificacion: "amarillo",
    funcion: "Surfactante",
    explicacion: "Sulfoacetato derivado del coco. Más suave que los sulfatos tradicionales, genera espuma sin ser tan agresivo.",
    notaRiesgo: "No es CG-friendly estricto, pero mucho más suave que SLS/SLES.",
    cgFriendly: false,
  },

  // ─── SULFATOS SUAVES / SURFACTANTES OK (verde/amarillo) ───
  {
    nombreINCI: "Cocamidopropyl Betaine",
    nombreComun: "Betaína de Coco",
    clasificacion: "verde",
    funcion: "Surfactante",
    explicacion: "Surfactante suave derivado del aceite de coco. Limpia sin agredir y es CG-friendly.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Sodium Cocoyl Isethionate",
    nombreComun: "SCI / Isethionato de Cocoilo",
    clasificacion: "verde",
    funcion: "Surfactante",
    explicacion: "Surfactante muy suave derivado del coco. Limpia sin resecar y deja el cabello suave.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Disodium Lauryl Sulfosuccinate",
    nombreComun: "Sulfosuccinato Suave",
    clasificacion: "verde",
    funcion: "Surfactante",
    explicacion: "Surfactante suave y CG-friendly. Limpia sin eliminar la humedad del cabello.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Sodium Lauroyl Methyl Isethionate",
    nombreComun: "Surfactante Suave de Coco",
    clasificacion: "verde",
    funcion: "Surfactante",
    explicacion: "Limpiador suave que no agrede el cabello rizado ni el cuero cabelludo.",
    cgFriendly: true,
  },

  // ─── ACONDICIONADORES CATIÓNICOS (verde) ───
  {
    nombreINCI: "Behentrimonium Chloride",
    nombreComun: "Cloruro de Beheniltrimonium",
    clasificacion: "verde",
    funcion: "Acondicionador",
    explicacion: "Acondicionador muy suave que reduce el frizz y facilita el desenredado. Muy bien tolerado.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Behentrimonium Methosulfate",
    nombreComun: "BTMS",
    clasificacion: "verde",
    funcion: "Acondicionador",
    explicacion: "Acondicionador catiónico que suaviza el cabello rizado y reduce el frizz sin pesar.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Cetrimonium Chloride",
    nombreComun: "Cloruro de Cetrimonio",
    clasificacion: "amarillo",
    funcion: "Acondicionador",
    explicacion: "Acondicionador catiónico. Efectivo pero en concentraciones altas puede acumularse.",
    notaRiesgo: "OK en concentraciones bajas (generalmente al final de la lista de ingredientes).",
    cgFriendly: true,
  },
  {
    nombreINCI: "Guar Hydroxypropyltrimonium Chloride",
    nombreComun: "Guar catiónica",
    clasificacion: "verde",
    funcion: "Acondicionador",
    explicacion: "Derivado natural de la guar bean. Suaviza, facilita el desenredado y define rizos.",
    cgFriendly: true,
  },

  // ─── PROTEÍNAS (amarillo — riesgo de overload) ───
  {
    nombreINCI: "Hydrolyzed Keratin",
    nombreComun: "Queratina Hidrolizada",
    clasificacion: "amarillo",
    funcion: "Proteína",
    explicacion: "Repara temporalmente el cabello dañado y sella la cutícula. Puede causar sobrecarga de proteína.",
    notaRiesgo: "Úsalo con moderación. Si tu cabello está duro, crunchy o sin elasticidad, puede ser overload de proteína.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Hydrolyzed Wheat Protein",
    nombreComun: "Proteína de Trigo Hidrolizada",
    clasificacion: "amarillo",
    funcion: "Proteína",
    explicacion: "Proteína de tamaño medio que penetra y fortalece el cabello. Riesgo de overload si se usa en exceso.",
    notaRiesgo: "Monitorea cómo responde tu cabello. Si se vuelve rígido, reduce la frecuencia.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Hydrolyzed Collagen",
    nombreComun: "Colágeno Hidrolizado",
    clasificacion: "amarillo",
    funcion: "Proteína",
    explicacion: "Proteína de colágeno que añade fuerza y elasticidad. Riesgo de overload con uso frecuente.",
    notaRiesgo: "Equilibrar siempre con hidratación profunda.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Hydrolyzed Silk",
    nombreComun: "Seda Hidrolizada",
    clasificacion: "amarillo",
    funcion: "Proteína",
    explicacion: "Proteína de seda muy fina que añade brillo y suavidad. Menos riesgo de overload que otras proteínas.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Hydrolyzed Soy Protein",
    nombreComun: "Proteína de Soja Hidrolizada",
    clasificacion: "amarillo",
    funcion: "Proteína",
    explicacion: "Proteína vegetal que fortalece el cabello. Puede causar overload en cabello sensible a proteínas.",
    cgFriendly: true,
  },

  // ─── SILICONAS NO SOLUBLES (rojo) ───
  {
    nombreINCI: "Dimethicone",
    nombreComun: "Dimeticona / Silicona",
    clasificacion: "rojo",
    funcion: "Sellante",
    explicacion: "Silicona que crea una capa impermeable en el cabello. Bloquea la hidratación y se acumula.",
    notaRiesgo: "Solo se elimina con sulfatos. Evitar si sigues el método Curly Girl.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Cyclomethicone",
    nombreComun: "Ciclometicona / Silicona volátil",
    clasificacion: "rojo",
    funcion: "Sellante",
    explicacion: "Silicona volátil que puede acumularse y bloquear la hidratación del cabello rizado.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Cyclopentasiloxane",
    nombreComun: "D5 / Silicona Volátil",
    clasificacion: "rojo",
    funcion: "Sellante",
    explicacion: "Silicona no soluble en agua que puede acumularse en el cabello rizado.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Amodimethicone",
    nombreComun: "Amodimeticona",
    clasificacion: "amarillo",
    funcion: "Sellante",
    explicacion: "Silicona amino-funcional que se adhiere al cabello dañado. Más fácil de eliminar que Dimethicone.",
    notaRiesgo: "Puede acumularse con uso frecuente. Revisar si está combinado con surfactantes solubles.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Phenyl Trimethicone",
    nombreComun: "Feniltrimeticona",
    clasificacion: "rojo",
    funcion: "Sellante",
    explicacion: "Silicona que añade brillo pero se acumula y bloquea la hidratación.",
    cgFriendly: false,
  },

  // ─── SILICONAS SOLUBLES EN AGUA (amarillo) ───
  {
    nombreINCI: "PEG-Dimethicone",
    nombreComun: "Silicona Soluble en Agua (PEG)",
    clasificacion: "amarillo",
    funcion: "Sellante",
    explicacion: "Silicona soluble en agua. Se puede eliminar sin sulfatos, pero puede acumularse con el tiempo.",
    notaRiesgo: "No es ideal para el método CG estricto, pero es menos problemática que las siliconas no solubles.",
    cgFriendly: false,
  },

  // ─── ACEITES Y MANTECAS (verde) ───
  {
    nombreINCI: "Argania Spinosa Kernel Oil",
    nombreComun: "Aceite de Argán",
    clasificacion: "verde",
    funcion: "Sellante",
    explicacion: "Aceite ligero que sella la hidratación, añade brillo y reduce el frizz sin pesar el cabello.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Cocos Nucifera Oil",
    nombreComun: "Aceite de Coco",
    clasificacion: "amarillo",
    funcion: "Sellante",
    explicacion: "Sella la cutícula y penetra el cabello. Puede ser demasiado pesado para porosidad alta o cabello fino.",
    notaRiesgo: "Usar con moderación. Puede causar acumulación. Evitar en raíces.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Butyrospermum Parkii Butter",
    nombreComun: "Manteca de Karité / Shea",
    clasificacion: "verde",
    funcion: "Sellante",
    explicacion: "Manteca nutritiva que sella la hidratación y suaviza el cabello muy rizado o afro.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Ricinus Communis Seed Oil",
    nombreComun: "Aceite de Ricino / Castor Oil",
    clasificacion: "amarillo",
    funcion: "Sellante",
    explicacion: "Muy nutritivo y ayuda al crecimiento, pero puede ser muy pesado para algunos tipos de rizo.",
    notaRiesgo: "Usar en pequeñas cantidades o mezclar con aceites más ligeros.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Helianthus Annuus Seed Oil",
    nombreComun: "Aceite de Girasol",
    clasificacion: "verde",
    funcion: "Sellante",
    explicacion: "Aceite ligero rico en vitamina E. Sella la hidratación sin pesar el cabello.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Persea Gratissima Oil",
    nombreComun: "Aceite de Aguacate",
    clasificacion: "verde",
    funcion: "Sellante",
    explicacion: "Aceite rico en grasas saludables que nutre y penetra el cabello dañado o seco.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Mangifera Indica Seed Butter",
    nombreComun: "Manteca de Mango",
    clasificacion: "verde",
    funcion: "Sellante",
    explicacion: "Manteca suave que hidrata y define rizos sin dejar residuo pesado.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Prunus Amygdalus Dulcis Oil",
    nombreComun: "Aceite de Almendras Dulces",
    clasificacion: "verde",
    funcion: "Sellante",
    explicacion: "Aceite suave y emoliente que facilita el desenredado y añade suavidad.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Jojoba Wax",
    nombreComun: "Cera de Jojoba",
    clasificacion: "verde",
    funcion: "Sellante",
    explicacion: "Técnicamente una cera (no aceite) similar al sebo natural. Equilibra el cuero cabelludo y sella rizos.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Simmondsia Chinensis Seed Oil",
    nombreComun: "Aceite de Jojoba",
    clasificacion: "verde",
    funcion: "Sellante",
    explicacion: "Técnicamente una cera líquida similar al sebo natural. Equilibra y sella la hidratación.",
    cgFriendly: true,
  },

  // ─── CONSERVANTES (amarillo/verde) ───
  {
    nombreINCI: "Phenoxyethanol",
    nombreComun: "Fenoxietanol",
    clasificacion: "amarillo",
    funcion: "Conservante",
    explicacion: "Conservante muy común y generalmente seguro en concentraciones normales (<1%).",
    cgFriendly: true,
  },
  {
    nombreINCI: "Sodium Benzoate",
    nombreComun: "Benzoato de Sodio",
    clasificacion: "amarillo",
    funcion: "Conservante",
    explicacion: "Conservante natural suave. Bien tolerado por la mayoría.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Potassium Sorbate",
    nombreComun: "Sorbato de Potasio",
    clasificacion: "verde",
    funcion: "Conservante",
    explicacion: "Conservante natural derivado del ácido sórbico. Suave y bien tolerado.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Methylparaben",
    nombreComun: "Metilparabeno",
    clasificacion: "amarillo",
    funcion: "Conservante",
    explicacion: "Parabeno. Controversia sobre seguridad aunque la evidencia actual no es concluyente.",
    notaRiesgo: "Muchas personas con sensibilidades prefieren evitar los parabenos por precaución.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Propylparaben",
    nombreComun: "Propilparabeno",
    clasificacion: "amarillo",
    funcion: "Conservante",
    explicacion: "Parabeno. Similar al metilparabeno. Sujeto a debate científico.",
    notaRiesgo: "Muchas personas con sensibilidades prefieren evitar los parabenos por precaución.",
    cgFriendly: true,
  },

  // ─── FRAGANCIAS (rojo/amarillo) ───
  {
    nombreINCI: "Fragrance",
    nombreComun: "Fragancia / Perfume",
    clasificacion: "rojo",
    funcion: "Otro",
    explicacion: "Término paraguas que puede esconder cientos de químicos. Frecuentemente alergénico e irritante.",
    notaRiesgo: "Evitar en niñas y cuero cabelludo sensible. Puede causar dermatitis de contacto.",
    cgFriendly: false,
  },
  {
    nombreINCI: "Parfum",
    nombreComun: "Perfume / Fragancia",
    clasificacion: "rojo",
    funcion: "Otro",
    explicacion: "Término europeo para fragancia. Puede contener alérgenos no declarados.",
    notaRiesgo: "Evitar en niñas y cuero cabelludo sensible.",
    cgFriendly: false,
  },

  // ─── FIJADORES Y GELES (verde) ───
  {
    nombreINCI: "Carbomer",
    nombreComun: "Carbopol / Carbómero",
    clasificacion: "verde",
    funcion: "Otro",
    explicacion: "Gelificante que da textura a geles y cremas. No afecta al cabello en sí mismo.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Hydroxyethylcellulose",
    nombreComun: "Celulosa Vegetal",
    clasificacion: "verde",
    funcion: "Otro",
    explicacion: "Espesante derivado de la celulosa vegetal. CG-friendly y sin efectos negativos.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Polyquaternium-11",
    nombreComun: "Polyquaternium-11",
    clasificacion: "amarillo",
    funcion: "Acondicionador",
    explicacion: "Fijador catiónico que define rizos. Puede acumularse con el tiempo.",
    notaRiesgo: "Usar con moderación. Hacer limpiezas ocasionales si se acumula.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Polyquaternium-4",
    nombreComun: "Polyquaternium-4",
    clasificacion: "amarillo",
    funcion: "Acondicionador",
    explicacion: "Fijador suave de origen vegetal. Compatible con el método CG.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Polyquaternium-37",
    nombreComun: "Polyquaternium-37",
    clasificacion: "verde",
    funcion: "Acondicionador",
    explicacion: "Acondicionador catiónico suave que añade brillo y reduce el frizz.",
    cgFriendly: true,
  },

  // ─── INGREDIENTES ESPECIALES ───
  {
    nombreINCI: "Niacinamide",
    nombreComun: "Niacinamida / Vitamina B3",
    clasificacion: "verde",
    funcion: "Hidratante",
    explicacion: "Vitamina que fortalece la barrera capilar y mejora la salud del cuero cabelludo.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Biotin",
    nombreComun: "Biotina / Vitamina B7",
    clasificacion: "verde",
    funcion: "Otro",
    explicacion: "Vitamina asociada a la salud y crecimiento del cabello. Bien tolerada en productos tópicos.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Caffeine",
    nombreComun: "Cafeína",
    clasificacion: "verde",
    funcion: "Otro",
    explicacion: "Estimula la circulación en el cuero cabelludo y puede ayudar al crecimiento capilar.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Rosmarinus Officinalis Leaf Oil",
    nombreComun: "Aceite Esencial de Romero",
    clasificacion: "amarillo",
    funcion: "Otro",
    explicacion: "Aceite esencial con propiedades estimulantes del cuero cabelludo. Estudios prometen para crecimiento.",
    notaRiesgo: "Usar con moderación. No aplicar puro. Puede irritar en personas sensibles.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Menthol",
    nombreComun: "Mentol",
    clasificacion: "amarillo",
    funcion: "Otro",
    explicacion: "Da sensación de frescor. Puede irritar el cuero cabelludo sensible o en niñas.",
    notaRiesgo: "Evitar en niñas pequeñas y cuero cabelludo con eccema.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Citric Acid",
    nombreComun: "Ácido Cítrico",
    clasificacion: "verde",
    funcion: "Otro",
    explicacion: "Regula el pH del producto. Ayuda a cerrar la cutícula y mejorar el brillo.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Sodium Hydroxide",
    nombreComun: "Hidróxido de Sodio / Sosa",
    clasificacion: "amarillo",
    funcion: "Otro",
    explicacion: "Ajustador de pH. En concentraciones bajas es inofensivo. Forma parte de muchos productos.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Tocopherol",
    nombreComun: "Vitamina E",
    clasificacion: "verde",
    funcion: "Emoliente",
    explicacion: "Antioxidante que protege el cabello del daño ambiental y añade suavidad.",
    cgFriendly: true,
  },
  {
    nombreINCI: "Tocopheryl Acetate",
    nombreComun: "Acetato de Vitamina E",
    clasificacion: "verde",
    funcion: "Emoliente",
    explicacion: "Forma estable de la vitamina E. Protege y suaviza el cabello.",
    cgFriendly: true,
  },
];

// Normaliza el nombre para búsqueda (minúsculas, sin espacios extras)
function normalizar(texto: string): string {
  return texto.toLowerCase().trim().replace(/\s+/g, " ");
}

// Busca un ingrediente en la base de datos
export function buscarIngrediente(nombre: string): IngredienteDB | null {
  const n = normalizar(nombre);
  return (
    BASE_INGREDIENTES.find((ing) => normalizar(ing.nombreINCI) === n) ||
    BASE_INGREDIENTES.find(
      (ing) => ing.nombreComun && normalizar(ing.nombreComun) === n
    ) ||
    BASE_INGREDIENTES.find((ing) => n.includes(normalizar(ing.nombreINCI))) ||
    null
  );
}

// Palabras/frases que indican que una pieza de texto NO es un ingrediente
const NO_ES_INGREDIENTE = /^(?:ingredients?|ingredientes?|ingr[eé]dients?|ingredienti|inhaltsstoffe?|inci|contiene|contains?|composici[oó]n|composi[çc][aã]o|composition|may\s+contain|puede\s+contener|peut\s+contenir|warning|advertencia|caution|attention|precauci[oó]n|how\s+to\s+use|modo\s+de\s+uso|modo\s+de\s+empleo|conservar|store|keep|lagerung|manufactured|fabricado|distribuido|made\s+in|hecho\s+en|net\s+wt|peso\s+neto|poids\s+net|fl\s*oz|[\d.,]+\s*%|\d+\s*ml|\d+\s*g)$/i;

// Trozos que descartan la entrada aunque aparezcan en medio del texto:
// URLs, emails, cantidades (200ml, 6.8 fl oz), fechas y avisos típicos de etiqueta.
// También dos puntos (:) — ningún nombre INCI los lleva; son títulos o descripciones.
const CONTIENE_BASURA = /www\.|http|@|\.com\b|:|\d+\s*(?:ml|mL)\b|\d+\s*fl\.?\s*oz|\b\d{1,2}[\/\-]\d{2,4}\b|\bexp\.?\s*\d|\blote?\b|\bbatch\b/i;

// Palabras de frases de marketing/instrucciones que NUNCA aparecen en un nombre INCI.
// Si un token contiene 2 o más, es una frase del envase, no un ingrediente
// ("conditioning mask for hair...", "para todo tipo de cabello", etc.)
const PALABRAS_NO_INCI = /\b(?:the|for|with|your|this|that|those|who|want|have|from|are|will|you|all|don'?t|hair|mask|conditioner|moisturizing|conditioning|para|con|los|las|una?|del|este|esta|que|cabello|pelo|todo|tipo|piel|uso|aplicar|deja[r]?|enjuaga[r]?|minutos|resultados?|pour|avec|les|vos|cheveux|tous)\b/gi;

function pareceFraseDelEnvase(token: string): boolean {
  const coincidencias = (token.match(PALABRAS_NO_INCI) || []).length;
  if (coincidencias >= 2) return true;
  // Una sola palabra sospechosa en un token largo también descarta
  return coincidencias >= 1 && token.split(/\s+/).length >= 5;
}

// Parsea la lista cruda de ingredientes (separados por coma, salto de línea, punto y coma, bullet)
export function parsearIngredientes(texto: string): string[] {
  return (
    texto
      // Normalizar separadores del OCR: saltos, barras, bullets, punto y coma
      .replace(/[;|·•]/g, ",")
      .replace(/\n+/g, ",")
      // Expandir "(and)" que OCR confunde como separador
      .replace(/\(and\)/gi, ",")
      // Quitar porcentajes pegados al nombre: "Glycerin 2%" → "Glycerin"
      .replace(/\s+\d+[\.,]?\d*\s*%/g, "")
      // Quitar marcas de certificación: *, **, †, ‡
      .replace(/^[\*†‡\d]+\s*/gm, "")
      // Quitar paréntesis con descripciones largas tipo "(organic)", "(vegetal origin)"
      // pero CONSERVAR paréntesis que forman parte del nombre INCI (ej: PEG-40)
      .replace(/\s*\((?!and\b)[^)]{15,}\)/gi, "")
      .split(",")
      .map((s) => s.trim())
      // Red de seguridad: si un encabezado quedó pegado al primer ingrediente
      // ("es /Ingredients: Aqua"), quitar todo hasta el último encabezado incluido
      .map((s) => {
        const m = [...s.matchAll(/\b(?:ingredients?|ingredientes?|ingr[eé]dients?|ingredienti|inhaltsstoffe?|inci|composici[oó]n|composition)\b\s*[:\/]?\s*/gi)];
        if (m.length === 0) return s;
        const ultimo = m[m.length - 1];
        return s.slice((ultimo.index ?? 0) + ultimo[0].length);
      })
      // Quitar caracteres no-ingrediente al inicio/fin
      .map((s) => s.replace(/^[\*†‡:\-–—\.\s]+/, "").replace(/[\*†‡:\-–—\.\s]+$/, ""))
      .map((s) => s.trim())
      // Filtros de longitud: minimo 3 chars (descarta fragmentos tipo "Ad"), maximo 90
      .filter((s) => s.length >= 3 && s.length <= 90)
      // Debe contener al menos una letra
      .filter((s) => /[a-záéíóúüñ]/i.test(s))
      // Eliminar entradas que claramente no son ingredientes
      .filter((s) => !NO_ES_INGREDIENTE.test(s))
      .filter((s) => !CONTIENE_BASURA.test(s))
      // Frases del envase ("conditioning mask for hair...") no son ingredientes
      .filter((s) => !pareceFraseDelEnvase(s))
      // Eliminar duplicados
      .filter((s, i, arr) => arr.findIndex((x) => x.toLowerCase() === s.toLowerCase()) === i)
  );
}
