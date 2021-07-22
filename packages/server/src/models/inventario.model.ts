import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Almacen } from './almacen.model';
import { HBaseEntity } from './item.model';
import { Producto } from './producto.model';
import { ProductoUnidad } from './proudcto_unidad.model';
import { Unidad } from './unidad.model';

@Entity()
export class Inventario extends HBaseEntity {
    @ManyToOne(() => ProductoUnidad, { primary: true })
    productoUnidad!: ProductoUnidad;

    @ManyToOne(() => Almacen, { primary: true })
    almacen!: Almacen;

    @Column()
    cantidad!: number;
}
