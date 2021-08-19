import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';
import { HBaseEntity } from './item.model';
import { Producto } from './producto.model';
import { Cliente } from './cliente.model';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Factura extends HBaseEntity {
    @PrimaryGeneratedColumn({})
    @Field()
    id!: string;
    @Column()
    @Field()
    fecha: Date;

    @OneToMany(() => DetalleFactura, (t) => t.factura, { cascade: true })
    @Field(() => [DetalleFactura])
    detalles!: DetalleFactura[];
    @ManyToOne(() => Cliente, (t) => t.facturas)
    @JoinColumn({ name: 'idCliente' })
    @Field(() => Cliente)
    cliente!: Cliente;

    @Column()
    @Field()
    idCliente: string;
}

@Entity()
@ObjectType()
export class DetalleFactura extends HBaseEntity {
    @ManyToOne(() => Factura)
    @JoinColumn({ name: 'idFactura' })
    @Field()
    factura!: Factura;

    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'idProducto' })
    @Field()
    producto!: Producto;

    @Column()
    @Field()
    precio!: number;
    @Column()
    @Field()
    cantidad!: number;
    @Column()
    @Field()
    itbis!: number;
    @Column()
    @Field()
    importe!: number;

    @Column({ primary: true })
    @Field()
    idFactura: string;

    @Column({ primary: true })
    @Field()
    idProducto: string;
}
