import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Almacen } from './almacen.model';
import { HBaseEntity } from './item.model';
import { IdIngredienteUnidadType, IngredienteUnidad } from './ingrediente_unidad.model';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Inventario extends HBaseEntity {
    @ManyToOne(() => IngredienteUnidad, { primary: true })
    @JoinColumn({ name: 'idIngrediente', referencedColumnName: 'idIngrediente' })
    @JoinColumn({ name: 'idUnidad', referencedColumnName: 'idUnidad' })
    @Field()
    ingrediente!: IngredienteUnidad;

    @ManyToOne(() => Almacen)
    @JoinColumn({ name: 'idAlmacen' })
    @Field()
    almacen!: Almacen;

    @Column()
    @Field()
    cantidad!: number;

    @Field()
    @Column({ primary: true })
    idIngrediente: string;

    @Field()
    @Column({ primary: true })
    idUnidad: string;
    @Field()
    @Column({ primary: true })
    idAlmacen: string;
}
