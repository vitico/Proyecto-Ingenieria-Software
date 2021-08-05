import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HBaseEntity } from './item.model';
import { Producto } from './producto.model';
import { Cliente } from '@/models/cliente.model';

@Entity()
export class Factura extends HBaseEntity {
    @PrimaryGeneratedColumn({})
    id!: string;

    @OneToMany(() => DetalleFactura, (t) => t.factura, { lazy: true })
    detalles!: DetalleFactura[];
    @ManyToOne(() => Cliente, (t) => t.facturas)
    cliente!: Cliente;
}

@Entity()
export class DetalleFactura extends HBaseEntity {
    @ManyToOne(() => Factura, { primary: true })
    factura!: Factura;

    @ManyToOne(() => Producto, { primary: true })
    producto!: Producto;

    @Column()
    precio!: number;
    @Column()
    cantidad!: number;
    @Column()
    itbis!: number;
    @Column()
    importe!: number;
}
