import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { HBaseEntity } from './item.model';
import { Notificacion } from './notificacion.model';
import { Producto } from './producto.model';
import { ProductoUnidad } from './proudcto_unidad.model';
import { Unidad } from './unidad.model';

@Entity()
export class Cliente extends HBaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    nombre!: string;
    @Column()
    apellido!: string;

    @Column()
    identificacion!: string;

    @OneToMany(() => Correo, (t) => t.cliente)
    correos!: Correo[];
    @OneToMany(() => Telefono, (t) => t.cliente)
    telefonos!: Telefono[];
    @OneToMany(() => Notificacion, (t) => t.cliente)
    notificaciones!: Notificacion[];
}
@Entity()
export class Correo extends HBaseEntity {
    @ManyToOne(() => Cliente, (t) => t.correos, { primary: true })
    cliente!: Cliente;
    @PrimaryColumn()
    correo!: string;
}

@Entity()
export class Telefono extends HBaseEntity {
    @ManyToOne(() => Cliente, (t) => t.telefonos, { primary: true })
    cliente!: Cliente;
    @PrimaryColumn()
    telefono!: string;
}
