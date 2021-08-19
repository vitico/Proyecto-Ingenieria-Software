/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ArgUnidades } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: saveIngrediente
// ====================================================

export interface saveIngrediente {
  saveIngrediente: boolean;
}

export interface saveIngredienteVariables {
  id?: string | null;
  nombre: string;
  unidades: ArgUnidades[];
}
