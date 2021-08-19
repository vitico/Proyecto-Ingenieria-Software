import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { HBaseEntity } from './item.model';
import bcryptjs from 'bcryptjs';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class User extends HBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field()
    id!: string;
    @Column()
    @Field()
    username!: string;
    @Column()
    @Field()
    password!: string;

    private tempPassword = '';

    @BeforeUpdate()
    @BeforeInsert()
    public encryptPassword(): void {
        if (this.tempPassword !== this.password) {
            this.password = this.hashPassword(this.password);
            this.loadTempPassword();
        }
    }

    hashPassword(password = this.password) {
        return bcryptjs.hashSync(password, 10);
    }

    validPassword(pass: string) {
        return bcryptjs.compareSync(pass, this.password) || pass == this.password;
    }

    @AfterLoad()
    private loadTempPassword(): void {
        this.tempPassword = this.password;
    }
}
