import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './cliente.model';
import { HBaseEntity } from './item.model';
import { Oferta } from './oferta.model';
enum EstadoCorreo {
    cancelado = 'cancelado',
    enviado = 'enviado',
    sinEnviar = 'sinenviar',
}
@Entity()
export class Notificacion extends HBaseEntity {
    @ManyToOne(() => Cliente, (t) => t.notificaciones, { primary: true })
    cliente!: Cliente;
    @ManyToOne(() => Oferta, (t) => t.notificaciones, { primary: true })
    oferta!: Oferta;
    @Column()
    asunto!: string;
    @Column()
    cuerpo!: string;
    @Column({
        type: 'enum',
        enum: EstadoCorreo,
        default: EstadoCorreo.sinEnviar,
    })
    estado!: EstadoCorreo;
}
