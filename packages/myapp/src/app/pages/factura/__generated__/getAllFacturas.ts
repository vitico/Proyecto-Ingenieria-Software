/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllFacturas
// ====================================================

export interface getAllFacturas_facturas_detalles {
  __typename: "DetalleFactura";
  cantidad: number;
  idProducto: string;
  importe: number;
  itbis: number;
  precio: number;
}

export interface getAllFacturas_facturas {
  __typename: "Factura";
  id: string;
  fecha: any;
  idCliente: string;
  detalles: getAllFacturas_facturas_detalles[];
}

export interface getAllFacturas {
  facturas: getAllFacturas_facturas[] | null;
}
