import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { HBaseEntity } from './item.model';

export class Entidad extends HBaseEntity {
    @PrimaryGeneratedColumn()
    id!: string;
    @Column()
    nombre!: string;
}
