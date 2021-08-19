/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllIngredientes
// ====================================================

export interface getAllIngredientes_ingredientes_unidades {
  __typename: "IngredienteUnidad";
  idUnidad: string;
  precio: number;
}

export interface getAllIngredientes_ingredientes {
  __typename: "Ingrediente";
  id: string;
  nombre: string;
  unidades: getAllIngredientes_ingredientes_unidades[] | null;
}

export interface getAllIngredientes {
  ingredientes: getAllIngredientes_ingredientes[] | null;
}
