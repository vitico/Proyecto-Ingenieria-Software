import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    AfterLoad,
} from 'typeorm';
import { HBaseEntity } from './item.model';
import { Producto } from './producto.model';
import { ProductoUnidad } from './proudcto_unidad.model';
import { Unidad } from './unidad.model';

@Entity()
export class Factura extends HBaseEntity {
    @PrimaryGeneratedColumn({})
    id!: string;

    @OneToMany(() => DetalleFactura, (t) => t.factura, { lazy: true })
    detalles!: DetalleFactura[];
}
@Entity()
export class DetalleFactura extends HBaseEntity {
    @ManyToOne(() => Factura, { primary: true })
    factura!: Factura;

    @ManyToOne(() => ProductoUnidad, { primary: true })
    producto!: ProductoUnidad;

    @Column()
    precio!: number;
    @Column()
    cantidad!: number;
    @Column()
    itbis!: number;
    @Column()
    importe!: number;
}
