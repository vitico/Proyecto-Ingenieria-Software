import { Column, Entity, ManyToOne } from 'typeorm';
import { HBaseEntity } from './item.model';
import { Unidad } from './unidad.model';
import { Ingrediente } from '@/models/Ingrediente.model';

@Entity()
export class IngredienteUnidad extends HBaseEntity {
    @ManyToOne(() => Ingrediente, { primary: true })
    ingrediente!: Ingrediente;
    @ManyToOne(() => Unidad, { primary: true })
    unidad!: Unidad;

    @Column()
    precio!: number;
}
