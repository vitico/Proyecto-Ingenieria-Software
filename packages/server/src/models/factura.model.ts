import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

    @OneToMany(() => DetalleFactura, (t) => t.factura, { cascade: true })
    @Field(() => [DetalleFactura])
    detalles!: DetalleFactura[];
    @ManyToOne(() => Cliente, (t) => t.facturas)
    @Field(() => Cliente)
    cliente!: Cliente;
}

@Entity()
@ObjectType()
export class DetalleFactura extends HBaseEntity {
    @ManyToOne(() => Factura, { primary: true })
    @Field()
    factura!: Factura;

    @ManyToOne(() => Producto, { primary: true })
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
}
