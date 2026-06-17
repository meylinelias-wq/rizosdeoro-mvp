export interface Alternativa {
  nombre: string;
  puntuacion: number;
  categoria: string;
  imagen: null;
  cgFriendly: boolean;
}

export const alternativas: Record<string, Alternativa[]> = {
  "champú": [
    { nombre: "As I Am Coconut CoWash", puntuacion: 91, categoria: "co-wash", imagen: null, cgFriendly: true },
    { nombre: "Shea Moisture Coconut & Hibiscus", puntuacion: 88, categoria: "champú", imagen: null, cgFriendly: true },
    { nombre: "Cantu Shea Butter Cleansing Cream", puntuacion: 85, categoria: "champú suave", imagen: null, cgFriendly: true },
  ],
  "acondicionador": [
    { nombre: "Kinky Curly Knot Today", puntuacion: 94, categoria: "leave-in", imagen: null, cgFriendly: true },
    { nombre: "Shea Moisture Raw Shea Retention", puntuacion: 89, categoria: "acondicionador", imagen: null, cgFriendly: true },
    { nombre: "Cantu Conditioning Detangler", puntuacion: 86, categoria: "enjuague", imagen: null, cgFriendly: true },
  ],
  "leave-in": [
    { nombre: "Kinky Curly Knot Today Leave-In", puntuacion: 94, categoria: "leave-in", imagen: null, cgFriendly: true },
    { nombre: "Giovanni Direct Leave-In", puntuacion: 90, categoria: "leave-in", imagen: null, cgFriendly: true },
    { nombre: "Cantu Leave-In Conditioning Cream", puntuacion: 87, categoria: "leave-in", imagen: null, cgFriendly: true },
  ],
  "gel": [
    { nombre: "Eco Styler Olive Oil Gel", puntuacion: 84, categoria: "gel", imagen: null, cgFriendly: true },
    { nombre: "Camille Rose Curl Maker", puntuacion: 90, categoria: "gel", imagen: null, cgFriendly: true },
    { nombre: "TGIN Twist & Define Cream", puntuacion: 88, categoria: "crema-gel", imagen: null, cgFriendly: true },
  ],
  "mascarilla": [
    { nombre: "Shea Moisture Manuka Honey Masque", puntuacion: 93, categoria: "mascarilla", imagen: null, cgFriendly: true },
    { nombre: "Camille Rose Algae Renew Deep Cond.", puntuacion: 91, categoria: "mascarilla", imagen: null, cgFriendly: true },
    { nombre: "Cantu Shea Butter Deep Treatment", puntuacion: 87, categoria: "mascarilla", imagen: null, cgFriendly: true },
  ],
  "aceite": [
    { nombre: "Aceite de Argán puro (Artnaturals)", puntuacion: 97, categoria: "aceite", imagen: null, cgFriendly: true },
    { nombre: "Aceite de Jojoba 100% puro", puntuacion: 96, categoria: "aceite", imagen: null, cgFriendly: true },
    { nombre: "Mielle Organics Rosemary Mint Oil", puntuacion: 92, categoria: "aceite", imagen: null, cgFriendly: true },
  ],
  "crema": [
    { nombre: "Shea Moisture Curl Enhancing Smoothie", puntuacion: 90, categoria: "crema", imagen: null, cgFriendly: true },
    { nombre: "Cantu Moisturizing Curl Activator Cream", puntuacion: 86, categoria: "crema", imagen: null, cgFriendly: true },
    { nombre: "As I Am Twist Defining Cream", puntuacion: 88, categoria: "crema", imagen: null, cgFriendly: true },
  ],
  "otro": [
    { nombre: "Shea Moisture Coconut & Hibiscus", puntuacion: 88, categoria: "champú", imagen: null, cgFriendly: true },
    { nombre: "Kinky Curly Knot Today", puntuacion: 94, categoria: "leave-in", imagen: null, cgFriendly: true },
    { nombre: "Camille Rose Curl Maker", puntuacion: 90, categoria: "gel", imagen: null, cgFriendly: true },
  ],
};
