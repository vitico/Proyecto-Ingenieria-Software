/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllOfertas
// ====================================================

export interface getAllOfertas_ofertas {
  __typename: "Oferta";
  id: string;
  fechaInicial: any;
  fechaFinal: any;
  activo: boolean;
}

export interface getAllOfertas {
  ofertas: getAllOfertas_ofertas[] | null;
}
