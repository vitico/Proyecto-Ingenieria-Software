/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllUsuarios
// ====================================================

export interface getAllUsuarios_users {
  __typename: "User";
  id: string;
  username: string;
  password: string;
}

export interface getAllUsuarios {
  users: getAllUsuarios_users[] | null;
}
