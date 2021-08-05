import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Entidad } from './entidad.base';
import { Grupo } from './grupo.model';
import { IngredienteUnidad } from '@/models/ingrediente_unidad.model';

@Entity()
export class Producto extends Entidad {
    @ManyToMany(() => Grupo, (t) => t.productos)
    @JoinTable({ name: 'producto_grupo' })
    grupos!: Grupo;
    @Column({ default: 'false' })
    esCompania!: boolean;
    @Column({ default: 'false' })
    aceptaCompana!: boolean;

    @ManyToMany(() => Producto)
    @JoinTable({ name: 'ingrediente_producto' })
    ingredientes!: IngredienteUnidad[];
    // @OneToMany(() => DetalleOfertaProducto, (t) => t.producto)
    // ofertas!: DetalleOfertaProducto;
}
