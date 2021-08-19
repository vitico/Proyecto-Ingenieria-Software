/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GustoArg } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: saveCliente
// ====================================================

export interface saveCliente {
  saveCliente: boolean;
}

export interface saveClienteVariables {
  id?: string | null;
  nombre: string;
  correos: string[];
  identificacion: string;
  apellido: string;
  gustos: GustoArg[];
}
