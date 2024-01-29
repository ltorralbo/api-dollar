export interface Dolar {
    version:       string;
    autor:         string;
    codigo:        string;
    nombre:        string;
    unidad_medida: string;
    serie:         Price[];
}

export interface Price {
    fecha: Date;
    valor: number;
}
