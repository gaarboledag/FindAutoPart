// Departamentos y ciudades de Colombia
export const COLOMBIA_LOCATIONS = {
    "Amazonas": ["Leticia", "Puerto Nariño"],
    "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Turbo", "Apartadó", "Rionegro", "Caucasia"],
    "Arauca": ["Arauca", "Tame", "Saravena"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Puerto Colombia"],
    "Bolívar": ["Cartagena", "Magangué", "Turbaco", "Arjona"],
    "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Paipa"],
    "Caldas": ["Manizales", "La Dorada", "Chinchiná", "Villamaría"],
    "Caquetá": ["Florencia", "San Vicente del Caguán", "Puerto Rico"],
    "Casanare": ["Yopal", "Aguazul", "Villanueva", "Monterrey"],
    "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada"],
    "Cesar": ["Valledupar", "Aguachica", "Bosconia", "Codazzi"],
    "Chocó": ["Quibdó", "Istmina", "Condoto"],
    "Córdoba": ["Montería", "Cereté", "Lorica", "Sahagún"],
    "Cundinamarca": ["Bogotá", "Soacha", "Fusagasugá", "Facatativá", "Zipaquirá", "Chía", "Girardot", "Madrid"],
    "Guainía": ["Inírida"],
    "Guaviare": ["San José del Guaviare"],
    "Huila": ["Neiva", "Pitalito", "Garzón", "La Plata"],
    "La Guajira": ["Riohacha", "Maicao", "Uribia", "Manaure"],
    "Magdalena": ["Santa Marta", "Ciénaga", "Fundación", "El Banco"],
    "Meta": ["Villavicencio", "Acacías", "Granada", "Puerto López"],
    "Nariño": ["Pasto", "Tumaco", "Ipiales", "Túquerres"],
    "Norte de Santander": ["Cúcuta", "Ocaña", "Pamplona", "Villa del Rosario"],
    "Putumayo": ["Mocoa", "Puerto Asís", "Sibundoy"],
    "Quindío": ["Armenia", "Calarcá", "La Tebaida", "Montenegro"],
    "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "La Virginia"],
    "San Andrés y Providencia": ["San Andrés", "Providencia"],
    "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja"],
    "Sucre": ["Sincelejo", "Corozal", "Sampués"],
    "Tolima": ["Ibagué", "Espinal", "Melgar", "Honda"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Cartago", "Buga", "Jamundí"],
    "Vaupés": ["Mitú"],
    "Vichada": ["Puerto Carreño"]
} as const;

export type Departamento = keyof typeof COLOMBIA_LOCATIONS;
export type Ciudad<T extends Departamento> = typeof COLOMBIA_LOCATIONS[T][number];

// Helper para obtener lista de departamentos
export const getDepartamentos = (): Departamento[] => {
    return Object.keys(COLOMBIA_LOCATIONS) as Departamento[];
};

// Helper para obtener ciudades de un departamento
export const getCiudades = (departamento: Departamento): readonly string[] => {
    return COLOMBIA_LOCATIONS[departamento] || [];
};

// Helper para verificar si una combinación departamento-ciudad es válida
export const isValidLocation = (departamento: string, ciudad: string): boolean => {
    const ciudades = COLOMBIA_LOCATIONS[departamento as Departamento];
    return ciudades ? ciudades.includes(ciudad as any) : false;
};
