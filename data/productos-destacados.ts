export interface ProductoDestacado {
  id: number;
  nombre: string;
  marca: string;
  categoria: "champú" | "acondicionador" | "leave-in" | "gel" | "mascarilla" | "aceite" | "crema";
  puntuacion: number;
  cgFriendly: boolean;
  descripcion: string;
}

export const productosDestacados: ProductoDestacado[] = [
  { id: 1, nombre: "Cantu Shea Butter Leave-In Conditioning Repair Cream", marca: "Cantu", categoria: "leave-in", puntuacion: 87, cgFriendly: true, descripcion: "Ideal para rizos 3B-4C, muy hidratante" },
  { id: 2, nombre: "Kinky Curly Knot Today Leave-In Detangler", marca: "Kinky Curly", categoria: "leave-in", puntuacion: 94, cgFriendly: true, descripcion: "Uno de los mejores leave-in del mercado, sin siliconas" },
  { id: 3, nombre: "Shea Moisture Coconut & Hibiscus Curl Enhancing Smoothie", marca: "Shea Moisture", categoria: "crema", puntuacion: 90, cgFriendly: true, descripcion: "Crema definidora clásica para todo tipo de rizo" },
  { id: 4, nombre: "As I Am Coconut CoWash Cleansing Conditioner", marca: "As I Am", categoria: "champú", puntuacion: 91, cgFriendly: true, descripcion: "Co-wash suave perfecto para lavado sin sulfatos" },
  { id: 5, nombre: "Camille Rose Curl Maker Forming Custard", marca: "Camille Rose", categoria: "gel", puntuacion: 90, cgFriendly: true, descripcion: "Gel custard con fijación media sin efecto casco" },
  { id: 6, nombre: "Shea Moisture Manuka Honey & Yogurt Hydrate + Repair", marca: "Shea Moisture", categoria: "mascarilla", puntuacion: 93, cgFriendly: true, descripcion: "Mascarilla reparadora para rizos con daño químico" },
  { id: 7, nombre: "Mielle Organics Pomegranate & Honey Leave-In", marca: "Mielle Organics", categoria: "leave-in", puntuacion: 88, cgFriendly: true, descripcion: "Rico en antioxidantes y muy nutritivo" },
  { id: 8, nombre: "Giovanni Direct Leave-In Weightless Moisture", marca: "Giovanni", categoria: "leave-in", puntuacion: 85, cgFriendly: true, descripcion: "Ligero, ideal para rizos 2A-2C finos" },
  { id: 9, nombre: "Eco Styler Olive Oil Styling Gel", marca: "Eco Styler", categoria: "gel", puntuacion: 78, cgFriendly: true, descripcion: "Fijación fuerte con aceite de oliva, clásico del método CGM" },
  { id: 10, nombre: "Cantu Shea Butter Deep Treatment Masque", marca: "Cantu", categoria: "mascarilla", puntuacion: 82, cgFriendly: true, descripcion: "Mascarilla nutritiva de uso semanal" },
  { id: 11, nombre: "TGIN Butter Cream Daily Moisturizer", marca: "TGIN", categoria: "crema", puntuacion: 89, cgFriendly: true, descripcion: "Mantequilla ligera para hidratación diaria" },
  { id: 12, nombre: "Aceite de Argán Puro Certificado", marca: "Artnaturals", categoria: "aceite", puntuacion: 97, cgFriendly: true, descripcion: "100% argán puro, antifrizz y sellante ideal" },
  { id: 13, nombre: "DevaCurl SuperCream Coconut Curl Styler", marca: "DevaCurl", categoria: "crema", puntuacion: 76, cgFriendly: false, descripcion: "Alta fijación para rizos 3C-4A, no CG por fragancia" },
  { id: 14, nombre: "Camille Rose Algae Renew Deep Conditioning Mask", marca: "Camille Rose", categoria: "mascarilla", puntuacion: 91, cgFriendly: true, descripcion: "Mascarilla de proteína vegetal y algas marinas" },
  { id: 15, nombre: "Shea Moisture Raw Shea Butter Deep Treatment Masque", marca: "Shea Moisture", categoria: "mascarilla", puntuacion: 85, cgFriendly: true, descripcion: "Para rizos muy secos y con frizz intenso" },
];
