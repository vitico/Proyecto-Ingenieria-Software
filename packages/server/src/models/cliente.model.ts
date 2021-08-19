import {
    Check,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    RelationId,
    Unique,
} from 'typeorm';
import { Factura } from './factura.model';
import { Ingrediente } from './Ingrediente.model';

import { HBaseEntity } from './item.model';
import { Notificacion } from './notificacion.model';
import { Producto } from './producto.model';
import { Grupo } from './grupo.model';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Cliente extends HBaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: number;
    @Column()
    @Field()
    nombre!: string;
    @Column()
    @Field()
    apellido!: string;

    @Column()
    @Field()
    identificacion!: string;

    @OneToMany(() => Correo, (t) => t.cliente, { cascade: true })
    @Field(() => [Correo], { nullable: true })
    correos!: Correo[];
    @OneToMany(() => Telefono, (t) => t.cliente, { cascade: true })
    @Field(() => [Telefono])
    telefonos!: Telefono[];
    @OneToMany(() => Notificacion, (t) => t.cliente)
    @Field(() => [Notificacion])
    notificaciones!: Notificacion[];
    @OneToMany(() => Factura, (t) => t.cliente)
    @Field(() => [Factura])
    facturas!: Factura[];
    @RelationId((c: Cliente) => c.facturas)
    idFactura: string[];
    @OneToMany(() => ReferenciaGustoCliente, (t) => t.cliente, { cascade: true })
    @Field(() => [ReferenciaGustoCliente])
    gustos: ReferenciaGustoCliente[];
}

@Entity()
@ObjectType()
export class Correo extends HBaseEntity {
    @ManyToOne(() => Cliente, (t) => t.correos, { primary: true })
    @Field(() => Cliente)
    cliente!: Cliente;
    @PrimaryColumn()
    @Field()
    correo!: string;
}

@Entity()
@ObjectType()
export class Telefono extends HBaseEntity {
    @ManyToOne(() => Cliente, (t) => t.telefonos, { primary: true })
    @Field(() => Cliente)
    cliente!: Cliente;
    @PrimaryColumn()
    @Field()
    telefono!: string;
}

@Entity()
@Check(
    '( CASE WHEN "idProducto" IS NULL THEN 0 ELSE 1 END ' +
        '+ CASE WHEN "idGrupo" IS NULL THEN 0 ELSE 1 END ' +
        '+ CASE WHEN "idIngrediente" IS NULL THEN 0 ELSE 1 END  ) = 1'
)
@ObjectType()
@Unique(['cliente', 'producto', 'grupo', 'ingrediente'])
export class ReferenciaGustoCliente extends HBaseEntity {
    @PrimaryGeneratedColumn()
    id: string;
    @ManyToOne(() => Cliente, (t) => t.telefonos)
    @Field(() => Cliente)
    cliente!: Cliente;
    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'idProducto' })
    @Field(() => Producto, { nullable: true })
    producto?: Producto;
    @ManyToOne(() => Grupo)
    @JoinColumn({ name: 'idGrupo' })
    @Field(() => Grupo, { nullable: true })
    grupo?: Grupo;
    @ManyToOne(() => Ingrediente)
    @JoinColumn({ name: 'idIngrediente' })
    @Field(() => Ingrediente, { nullable: true })
    ingrediente?: Ingrediente;
    @Column({ default: 'false' })
    @Field()
    rechazar?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    idProducto?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    idGrupo?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    idIngrediente?: string;
}
