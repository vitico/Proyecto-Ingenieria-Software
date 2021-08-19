/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getALlInventario
// ====================================================

export interface getALlInventario_inventarios {
  __typename: "Inventario";
  idAlmacen: string;
  idIngrediente: string;
  idUnidad: string;
  cantidad: number;
}

export interface getALlInventario {
  inventarios: getALlInventario_inventarios[] | null;
}
