import {
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    RelationId,
} from 'typeorm';
import { Entidad } from './entidad.base';
// import { DetalleOfertaGrupo } from './oferta.model';
import { Producto } from './producto.model';
import { Field, ObjectType } from 'type-graphql';

@Entity({
    orderBy: {
        id: 'ASC',
    },
})
@ObjectType()
export class Grupo extends Entidad {
    @ManyToMany(() => Producto, (t) => t.grupos)
    @Field(() => [Producto])
    productos!: Producto[];

    @ManyToOne((type) => Grupo, (t) => t.children, {
        nullable: true,
    })
    @JoinColumn({ name: 'idGrupo' })
    @Field({ nullable: true })
    parent?: Grupo;

    @OneToMany((type) => Grupo, (t) => t.parent)
    @Field(() => [Grupo])
    children!: Grupo[];

    @RelationId((data: Grupo) => data.parent)
    @Field({ nullable: true })
    idParent?: string;

    @RelationId((data: Grupo) => data.children)
    idChildren!: string[];

    // @OneToMany((type) => DetalleOfertaGrupo, (t) => t.grupo)
    // ofertas!: DetalleOfertaGrupo[];
}
