import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { HBaseEntity } from './item.model';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Entidad extends HBaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: string;
    @Column()
    @Field()
    nombre!: string;
}
