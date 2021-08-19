/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllClientes
// ====================================================

export interface getAllClientes_clientes_items_correos {
  __typename: "Correo";
  correo: string;
}

export interface getAllClientes_clientes_items_gustos {
  __typename: "ReferenciaGustoCliente";
  idGrupo: string | null;
  idIngrediente: string | null;
  idProducto: string | null;
  rechazar: boolean;
}

export interface getAllClientes_clientes_items {
  __typename: "Cliente";
  id: number;
  nombre: string;
  apellido: string;
  identificacion: string;
  correos: getAllClientes_clientes_items_correos[] | null;
  gustos: getAllClientes_clientes_items_gustos[];
}

export interface getAllClientes_clientes {
  __typename: "PaginatedClienteResponse";
  items: getAllClientes_clientes_items[];
}

export interface getAllClientes {
  clientes: getAllClientes_clientes;
}
