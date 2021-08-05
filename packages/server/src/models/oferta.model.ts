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

    @OneToMany(() => CondicionOferta, (t) => t.oferta)
    condicion!: CondicionOferta[];

    @Column({ nullable: true })
    porcentajeDescuento?: number;
    @Column({ nullable: true })
    precioDescuento?: number;

    @OneToMany(() => Notificacion, (t) => t.oferta)
    notificaciones!: Notificacion[];
    @Column()
    activo!: boolean;
}

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
