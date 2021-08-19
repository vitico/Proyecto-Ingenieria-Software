import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { HBaseEntity } from './item.model';
import { Field, ObjectType, ArgsType, InputType } from 'type-graphql';

@InputType('EntidadInput')
@ObjectType()
export class Entidad extends HBaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: string;
    @Column()
    @Field()
    nombre!: string;
}
