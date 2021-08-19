/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum GustoType {
  grupo = "grupo",
  ingrediente = "ingrediente",
  producto = "producto",
}

export enum TipoDataOferta {
  grupo = "grupo",
  producto = "producto",
}

export interface ArgCondicionOferta {
  id: string;
  cantidad: number;
  typo: TipoDataOferta;
  opcional: boolean;
}

export interface ArgDetalleFactura {
  producto: string;
  precio: number;
  cantidad: number;
  itbis: number;
  importe: number;
}

export interface ArgExtraOferta {
  id: string;
  cantidad: number;
  typo: TipoDataOferta;
}

export interface ArgUnidades {
  idUnidad: string;
  precio: number;
}

export interface GustoArg {
  id: string;
  tipo: GustoType;
  rechazar: boolean;
}

export interface IdIngredienteUnidad {
  ingrediente: string;
  unidad: string;
}

export interface IdInventarioInput {
  idIngrediente: string;
  idUnidad: string;
  idAlmacen: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
