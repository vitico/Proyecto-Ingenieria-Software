import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Entidad } from './entidad.base';
import { Grupo } from './grupo.model';
import { Unidad } from './unidad.model';

@Entity()
export class Producto extends Entidad {
    @ManyToMany(() => Grupo, (t) => t.productos)
    @JoinTable({ name: 'producto_grupo' })
    grupos!: Grupo;
    @Column()
    vendible!: boolean;

    @ManyToMany(() => Producto)
    @JoinTable({ name: 'ingrediente_producto' })
    ingredientes!: Producto[];
    // @OneToMany(() => DetalleOfertaProducto, (t) => t.producto)
    // ofertas!: DetalleOfertaProducto;
}
