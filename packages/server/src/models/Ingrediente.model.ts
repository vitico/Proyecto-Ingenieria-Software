import { ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';
import { Entidad } from './entidad.base';

@Entity()
@ObjectType()
export class Ingrediente extends Entidad {}
