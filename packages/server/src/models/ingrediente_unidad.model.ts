import { Column, Entity, ManyToOne } from 'typeorm';
import { HBaseEntity } from './item.model';
import { Unidad } from './unidad.model';
import { Ingrediente } from './Ingrediente.model';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class IngredienteUnidad extends HBaseEntity {
    @ManyToOne(() => Ingrediente, { primary: true })
    @Field()
    ingrediente!: Ingrediente;
    @ManyToOne(() => Unidad, { primary: true })
    @Field()
    unidad!: Unidad;

    @Column()
    @Field()
    precio!: number;
}
