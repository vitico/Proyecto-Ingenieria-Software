/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ArgDetalleFactura } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: saveFactura
// ====================================================

export interface saveFactura {
  saveFactura: boolean;
}

export interface saveFacturaVariables {
  id?: string | null;
  cliente: string;
  fecha: any;
  detalles: ArgDetalleFactura[];
}
