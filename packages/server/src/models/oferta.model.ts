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
} from 'typeorm';
import { Grupo } from './grupo.model';
import { HBaseEntity } from './item.model';
import { Producto } from './producto.model';
import { Notificacion } from './notificacion.model';

@Entity()
@Check(
    '( CASE WHEN "porcentajeDescuento" IS NULL THEN 0 ELSE 1 END + CASE WHEN "precioDescuento" IS NULL THEN 0 ELSE 1 END ) = 1'
)
export class Oferta extends HBaseEntity {
    @PrimaryGeneratedColumn()
    id!: string;
    @Column()
    fechaInicial!: Date;
    @Column()
    fechaFinal!: Date;
    // @OneToMany(() => DetalleOfertaProducto, (t) => t.oferta)
    // detallesProductos!: DetalleOfertaProducto[];
    // @OneToMany(() => DetalleOfertaGrupo, (t) => t.oferta)
    // detallesGrupos!: DetalleOfertaGrupo[];
    // @OneToMany(() => DetalleOfertaPaquete, (t) => t.oferta)
    // detallesPaquete!: DetalleOfertaPaquete[];

    @OneToMany(() => CondicionOferta, (t) => t.oferta)
    condicion!: CondicionOferta[];
    // @OneToMany(() => CondicionOfertaPaquete, (t) => t.oferta)
    // condicionPaquete!: CondicionOfertaPaquete[];
    @Column({ nullable: true })
    porcentajeDescuento?: number;
    @Column({ nullable: true })
    precioDescuento?: number;
    // @OneToMany(() => OfertaCondicionProducto, (t) => t.oferta)
    // condicionProducto!: OfertaCondicionProducto[];
    // @OneToMany(() => OfertaCondicionGrupo, (t) => t.oferta)
    // condicionGrupo!: OfertaCondicionGrupo[];

    @OneToMany(() => Notificacion, (t) => t.oferta)
    notificaciones!: Notificacion[];
    @Column()
    activo!: boolean;
}
// export class BaseDetalleOferta extends HBaseEntity {
//     @ManyToOne(() => Oferta, { primary: true })
//     @JoinColumn({ name: 'idOferta' })
//     oferta!: Oferta;
// }

@Check(
    '( CASE WHEN "idProducto" IS NULL THEN 0 ELSE 1 END + CASE WHEN "idGrupo" IS NULL THEN 0 ELSE 1 END ) = 1'
)
export class BaseCondicionOferta extends HBaseEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @ManyToOne(() => Producto, { nullable: true })
    @JoinColumn({ name: 'idProducto' })
    producto?: Producto;
    @ManyToOne(() => Grupo, { nullable: true })
    @JoinColumn({ name: 'idGrupo' })
    grupo?: Grupo;

    @Column()
    cantidad!: number;
    @Column({ default: 'false' })
    opcional!: boolean;
}
@Entity({})
export class CondicionOferta extends BaseCondicionOferta {
    @ManyToOne(() => Oferta)
    @JoinColumn({ name: 'idOferta' })
    oferta!: Oferta;
}
// @Entity({})
// export class DetalleOfertaProducto extends BaseDetalleOferta {
//     @ManyToOne(() => Producto, { primary: true })
//     producto?: Producto;
// }

// @Entity()
// export class DetalleOfertaPaquete extends BaseDetalleOferta {
//     @ManyToMany(() => Producto, { primary: true })
//     @JoinTable({ name: 'detalle_oferta_paquete_producto' })
//     producto?: Producto;
// }

// @Entity()
// export class DetalleOfertaGrupo extends BaseDetalleOferta {
//     @ManyToOne(() => Grupo, (t) => t.ofertas, { primary: true })
//     grupo?: Grupo;
// }

// @Entity()
// export class OfertaCondicionProducto extends BaseDetalleOferta {
//     @ManyToOne(() => Producto, { primary: true })
//     producto!: Producto;
//     @Column()
//     cantidad!: number;
// }

// @Entity()
// export class OfertaCondicionGrupo extends BaseDetalleOferta {
//     @ManyToOne(() => Grupo, { primary: true })
//     grupo!: Grupo;
//     @Column()
//     cantidad!: number;
// }
