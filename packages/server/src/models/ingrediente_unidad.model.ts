import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { HBaseEntity } from './item.model';
import { Unidad } from './unidad.model';
import { Ingrediente } from './Ingrediente.model';
import { Field, InputType, ObjectType } from 'type-graphql';

@ObjectType()
class IdType {
    @Field()
    id: string;
}

@ObjectType()
export class IdIngredienteUnidadType {
    @Field()
    ingrediente: IdType;
    @Field()
    unidad: IdType;
}

@Entity()
@ObjectType()
export class IngredienteUnidad extends HBaseEntity {
    @ManyToOne(() => Ingrediente)
    @JoinColumn({ name: 'idIngrediente' })
    @Field()
    ingrediente!: Ingrediente;
    @ManyToOne(() => Unidad)
    @JoinColumn({ name: 'idUnidad' })
    @Field()
    unidad!: Unidad;

    @Column()
    @Field()
    precio!: number;

    @Column({ primary: true })
    @Field()
    idIngrediente: string;
    @Column({ primary: true })
    @Field()
    idUnidad: string;
}
