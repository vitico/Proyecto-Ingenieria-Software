import { Field, ObjectType } from 'type-graphql';
import { Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Entidad } from './entidad.base';
import { IngredienteUnidad } from './ingrediente_unidad.model';

@ObjectType('IdIngredienteUnidad2')
class IdIngredienteUnidad {
    @Field()
    idIngrediente: string;
    @Field()
    idUnidad: string;
}

@Entity()
@ObjectType()
export class Ingrediente extends Entidad {
    @OneToMany(() => IngredienteUnidad, (t) => t.ingrediente, { cascade: true })
    @Field(() => [IngredienteUnidad], { nullable: true })
    unidades!: IngredienteUnidad[];

    @Field(() => [IdIngredienteUnidad])
    @RelationId('unidades')
    idUnidades: IdIngredienteUnidad[];
}
