import { Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Entidad } from './entidad.base';
// import { DetalleOfertaGrupo } from './oferta.model';
import { Producto } from './producto.model';

@Entity()
export class Grupo extends Entidad {
    @ManyToMany(() => Producto, (t) => t.grupos)
    productos!: Producto[];

    @ManyToOne((type) => Grupo, (t) => t.children)
    @JoinColumn({ name: 'idGrupo' })
    parent!: Grupo;

    @OneToMany((type) => Grupo, (t) => t.parent)
    children!: Grupo[];

    // @OneToMany((type) => DetalleOfertaGrupo, (t) => t.grupo)
    // ofertas!: DetalleOfertaGrupo[];
}
