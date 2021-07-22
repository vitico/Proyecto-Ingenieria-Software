import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { HBaseEntity } from './item.model';

@Entity()
export class Almacen extends HBaseEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    nombre!: string;
}
