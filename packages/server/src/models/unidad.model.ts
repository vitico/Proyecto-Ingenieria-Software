import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Entidad } from './entidad.base';
import { Grupo } from './grupo.model';
import { Producto } from './producto.model';
import { IngredienteUnidad } from './ingrediente_unidad.model';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Unidad extends Entidad {
    @OneToMany(() => IngredienteUnidad, (t) => t.unidad)
    @Field(() => [IngredienteUnidad])
    ingredientes!: IngredienteUnidad[];
}
