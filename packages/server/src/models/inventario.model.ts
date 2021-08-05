import { Column, Entity, ManyToOne } from 'typeorm';
import { Almacen } from './almacen.model';
import { HBaseEntity } from './item.model';
import { IngredienteUnidad } from './ingrediente_unidad.model';

@Entity()
export class Inventario extends HBaseEntity {
    @ManyToOne(() => IngredienteUnidad, { primary: true })
    ingrediente!: IngredienteUnidad;

    @ManyToOne(() => Almacen, { primary: true })
    almacen!: Almacen;

    @Column()
    cantidad!: number;
}
