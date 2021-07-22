import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Entidad } from './entidad.base';
import { Grupo } from './grupo.model';
import { Producto } from './producto.model';
import { ProductoUnidad } from './proudcto_unidad.model';

@Entity()
export class Unidad extends Entidad {
    @OneToMany(() => ProductoUnidad, (t) => t.unidad)
    productos!: ProductoUnidad[];
}
