/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: clientesInteresados
// ====================================================

export interface clientesInteresados_clientesOferta_correos {
  __typename: "Correo";
  correo: string;
}

export interface clientesInteresados_clientesOferta {
  __typename: "Cliente";
  id: number;
  nombre: string;
  apellido: string;
  identificacion: string;
  correos: clientesInteresados_clientesOferta_correos[] | null;
}

export interface clientesInteresados {
  clientesOferta: clientesInteresados_clientesOferta[] | null;
}

export interface clientesInteresadosVariables {
  oferta: string;
  cantidad: number;
}
