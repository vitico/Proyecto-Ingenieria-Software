import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './cliente.model';
import { HBaseEntity } from './item.model';
import { Oferta } from './oferta.model';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
enum EstadoCorreo {
    cancelado = 'cancelado',
    enviado = 'enviado',
    sinEnviar = 'sinenviar',
}
registerEnumType(EstadoCorreo, {
    name: 'EstadoCorreo', // this one is mandatory
    description: 'Estado envio del correo', // this one is optional
});
@Entity()
@ObjectType()
export class Notificacion extends HBaseEntity {
    @ManyToOne(() => Cliente, (t) => t.notificaciones, { primary: true })
    @Field(() => Cliente)
    cliente!: Cliente;
    @ManyToOne(() => Oferta, (t) => t.notificaciones, { primary: true })
    @Field(() => Oferta)
    oferta!: Oferta;
    @Column()
    @Field()
    asunto!: string;
    @Column()
    @Field()
    cuerpo!: string;
    @Column({
        type: 'enum',
        enum: EstadoCorreo,
        default: EstadoCorreo.sinEnviar,
    })
    @Field(() => EstadoCorreo)
    estado!: EstadoCorreo;
}
