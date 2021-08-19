import { Entity } from 'typeorm';
import { Entidad } from './entidad.base';
import { ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Almacen extends Entidad {}
