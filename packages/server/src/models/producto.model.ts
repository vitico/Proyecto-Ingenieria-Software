import { Column, Entity, JoinTable, ManyToMany, RelationId } from 'typeorm';
import { Entidad } from './entidad.base';
import { Grupo } from './grupo.model';
import { IdIngredienteUnidadType, IngredienteUnidad } from './ingrediente_unidad.model';
import { Field, ObjectType } from 'type-graphql';
// @Entity()
// class ProductoGrupo {
//     grupo:Grupo;
//     producto:Producto;
//     @Column({primary:true})
//     idProducto: string;
//     @Column({primary:true})
//     idGrupo: string;
// }
@Entity()
@ObjectType()
export class Producto extends Entidad {
    @ManyToMany(() => Grupo, (t) => t.productos, { cascade: true })
    @JoinTable({ name: 'producto_grupo' })
    @Field(() => [Grupo])
    grupos!: Grupo[];
    @Column({ default: 'false' })
    @Field()
    esCompania!: boolean;
    @Column({ default: 'false' })
    @Field()
    aceptaCompana!: boolean;

    @ManyToMany(() => IngredienteUnidad, { cascade: true })
    @JoinTable({ name: 'ingrediente_producto' })
    @Field(() => [IngredienteUnidad], { nullable: true, defaultValue: [] })
    ingredientes!: IngredienteUnidad[];

    @Column()
    @Field()
    precio!: number;

    @RelationId((producto: Producto) => producto.grupos)
    @Field(() => [String])
    idGrupos: string[];
    @RelationId((producto: Producto) => producto.ingredientes)
    @Field(() => [IdIngredienteUnidadType])
    idIngredientes: IdIngredienteUnidadType[];
    // @OneToMany(() => DetalleOfertaProducto, (t) => t.producto)
    // ofertas!: DetalleOfertaProducto;
}
