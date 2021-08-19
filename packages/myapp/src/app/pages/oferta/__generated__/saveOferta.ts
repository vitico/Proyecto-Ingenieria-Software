/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ArgCondicionOferta, ArgExtraOferta } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: saveOferta
// ====================================================

export interface saveOferta {
  saveOferta: boolean;
}

export interface saveOfertaVariables {
  activo: boolean;
  condicion: ArgCondicionOferta[];
  extra: ArgExtraOferta[];
  fechaFinal: any;
  fechaInicial: any;
  id?: string | null;
  porcentajeDescuento: number;
  precioDescuento: number;
}
