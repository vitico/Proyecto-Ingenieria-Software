import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { HBaseEntity } from './item.model';
import { Producto } from './producto.model';
import { Unidad } from './unidad.model';

@Entity()
export class ProductoUnidad extends HBaseEntity {
    @ManyToOne(() => Producto, { primary: true })
    producto!: Producto;
    @ManyToOne(() => Unidad, { primary: true })
    unidad!: Unidad;

    @Column()
    precio!: number;
}
