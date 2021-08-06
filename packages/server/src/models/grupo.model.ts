import { Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Entidad } from './entidad.base';
// import { DetalleOfertaGrupo } from './oferta.model';
import { Producto } from './producto.model';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Grupo extends Entidad {
    @ManyToMany(() => Producto, (t) => t.grupos)
    @Field(() => [Producto])
    productos!: Producto[];

    @ManyToOne((type) => Grupo, (t) => t.children)
    @JoinColumn({ name: 'idGrupo' })
    @Field({ nullable: true })
    parent!: Grupo;

    @OneToMany((type) => Grupo, (t) => t.parent)
    @Field(() => [Grupo])
    children!: Grupo[];

    // @OneToMany((type) => DetalleOfertaGrupo, (t) => t.grupo)
    // ofertas!: DetalleOfertaGrupo[];
}
