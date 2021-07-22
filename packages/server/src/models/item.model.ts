import { ObjectType, Field, ID } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export class HBaseEntity extends BaseEntity {
    constructor(data: any) {
        super();
        Object.assign(this, data);
    }
}
@Entity()
@ObjectType()
export class ItemClass extends HBaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn({})
    id!: string;
    @Field()
    @Column({ nullable: false })
    name!: string;

    @Field()
    @Column({ nullable: false })
    description!: string;

    @Field()
    @Column({ nullable: false, default: false })
    isActive!: boolean;

    @Field()
    @Column({ nullable: false })
    createdAt!: Date;

    @Field()
    @Column({ nullable: false })
    modifiedAt!: Date;
}

export const Item = ItemClass;
