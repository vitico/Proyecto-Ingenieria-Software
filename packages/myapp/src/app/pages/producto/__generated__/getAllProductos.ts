/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllProductos
// ====================================================

export interface getAllProductos_productos_grupos {
  __typename: "Grupo";
  id: string;
  nombre: string;
}

export interface getAllProductos_productos_ingredientes {
  __typename: "IngredienteUnidad";
  idIngrediente: string;
  idUnidad: string;
}

export interface getAllProductos_productos {
  __typename: "Producto";
  id: string;
  nombre: string;
  aceptaCompana: boolean;
  esCompania: boolean;
  precio: number;
  grupos: getAllProductos_productos_grupos[];
  ingredientes: getAllProductos_productos_ingredientes[] | null;
}

export interface getAllProductos {
  productos: getAllProductos_productos[] | null;
}
