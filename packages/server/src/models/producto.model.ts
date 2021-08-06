import { Column, Entity, JoinTable, ManyToMany, RelationId } from 'typeorm';
import { Entidad } from './entidad.base';
import { Grupo } from './grupo.model';
import { IngredienteUnidad } from './ingrediente_unidad.model';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Producto extends Entidad {
    @ManyToMany(() => Grupo, (t) => t.productos)
    @JoinTable({ name: 'producto_grupo' })
    @Field(() => [Grupo])
    grupos!: Grupo[];
    @Column({ default: 'false' })
    @Field()
    esCompania!: boolean;
    @Column({ default: 'false' })
    @Field()
    aceptaCompana!: boolean;

    @ManyToMany(() => Producto)
    @JoinTable({ name: 'ingrediente_producto' })
    @Field(() => [IngredienteUnidad])
    ingredientes!: IngredienteUnidad[];

    @Column()
    @Field()
    precio!: number;

    @RelationId((producto: Producto) => producto.grupos)
    @Field(() => [String])
    idGrupos: string[];
    @RelationId((producto: Producto) => producto.ingredientes)
    @Field(() => [String])
    idIngredientes: string[];
    // @OneToMany(() => DetalleOfertaProducto, (t) => t.producto)
    // ofertas!: DetalleOfertaProducto;
}
