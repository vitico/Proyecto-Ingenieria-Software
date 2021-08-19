/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IdIngredienteUnidad } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: saveProducto
// ====================================================

export interface saveProducto {
  saveProducto: boolean;
}

export interface saveProductoVariables {
  id?: string | null;
  nombre: string;
  aceptaCompana: boolean;
  esCompania: boolean;
  precio: number;
  ingredientes?: IdIngredienteUnidad[] | null;
  grupos?: string[] | null;
}
