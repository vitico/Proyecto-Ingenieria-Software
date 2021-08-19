import {
    BaseEntity,
    Column,
    OneToMany,
    ManyToOne,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    Check,
    ManyToMany,
    JoinTable,
    RelationId,
} from 'typeorm';
import { Grupo } from './grupo.model';
import { HBaseEntity } from './item.model';
import { Producto } from './producto.model';
import { Notificacion } from './notificacion.model';
import { ObjectType, Field } from 'type-graphql';
import { Cliente } from './cliente.model';

@Entity()
@ObjectType()
@Check(
    '( CASE WHEN ( "porcentajeDescuento" IS NULL or "porcentajeDescuento" = 0 ) THEN 0 ELSE 1 END + CASE WHEN  ( "precioDescuento" IS NULL or "precioDescuento" = 0 )  THEN 0 ELSE 1 END ) <= 1'
)
export class Oferta extends HBaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: string;
    @Column()
    @Field()
    fechaInicial!: Date;
    @Column()
    @Field()
    fechaFinal!: Date;

    @OneToMany(() => CondicionOferta, (t) => t.oferta, { cascade: true })
    @Field(() => [CondicionOferta], { nullable: true })
    condicion!: CondicionOferta[];
    @OneToMany(() => ExtraOferta, (t) => t.oferta, { cascade: true })
    @Field(() => [ExtraOferta], { nullable: true })
    extra!: ExtraOferta[];

    @Column({ nullable: true })
    @Field({ nullable: true })
    porcentajeDescuento?: number;
    @Column({ nullable: true })
    @Field({ nullable: true })
    precioDescuento?: number;

    @OneToMany(() => Notificacion, (t) => t.oferta)
    @Field(() => [Notificacion])
    notificaciones!: Notificacion[];
    @Column()
    @Field()
    activo!: boolean;

    @Field(() => [Cliente], { nullable: true })
    clienteInteresado: Cliente[];
}

@Check(
    '( CASE WHEN "idProducto" IS NULL THEN 0 ELSE 1 END + CASE WHEN "idGrupo" IS NULL THEN 0 ELSE 1 END ) = 1'
)
@ObjectType()
export class BaseCondicionOferta extends HBaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: string;

    @ManyToOne(() => Producto, { nullable: true })
    @JoinColumn({ name: 'idProducto' })
    producto?: Producto;
    @ManyToOne(() => Grupo, { nullable: true })
    @JoinColumn({ name: 'idGrupo' })
    grupo?: Grupo;

    @Column()
    @Field()
    cantidad!: number;
    @ManyToOne(() => Oferta)
    @JoinColumn({ name: 'idOferta' })
    @Field()
    oferta!: Oferta;

    @Column({ nullable: true })
    @Field({ nullable: true })
    idProducto: string;
    @Column()
    @Field()
    idOferta: string;
    @Column({ nullable: true })
    @Field({ nullable: true })
    idGrupo: string;
}

@Entity({})
@ObjectType()
export class CondicionOferta extends BaseCondicionOferta {
    @Column({ default: 'false' })
    @Field()
    opcional!: boolean;
}

@Entity({})
@ObjectType()
export class ExtraOferta extends BaseCondicionOferta {}
