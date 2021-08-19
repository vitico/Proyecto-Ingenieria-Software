/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllGrupos
// ====================================================

export interface getAllGrupos_grupos {
  __typename: "Grupo";
  id: string;
  nombre: string;
  idParent: string | null;
}

export interface getAllGrupos {
  grupos: getAllGrupos_grupos[] | null;
}
