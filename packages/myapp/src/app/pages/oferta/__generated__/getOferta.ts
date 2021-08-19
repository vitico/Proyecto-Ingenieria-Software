/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOferta
// ====================================================

export interface getOferta_oferta_condicion {
  __typename: "CondicionOferta";
  cantidad: number;
  idGrupo: string | null;
  idOferta: string;
  idProducto: string | null;
  opcional: boolean;
}

export interface getOferta_oferta_extra {
  __typename: "ExtraOferta";
  cantidad: number;
  idGrupo: string | null;
  idOferta: string;
  idProducto: string | null;
}

export interface getOferta_oferta {
  __typename: "Oferta";
  activo: boolean;
  condicion: getOferta_oferta_condicion[] | null;
  extra: getOferta_oferta_extra[] | null;
  fechaFinal: any;
  fechaInicial: any;
  porcentajeDescuento: number | null;
  precioDescuento: number | null;
}

export interface getOferta {
  oferta: getOferta_oferta | null;
}

export interface getOfertaVariables {
  id?: string | null;
}
