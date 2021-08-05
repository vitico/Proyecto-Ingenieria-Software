import { AfterLoad, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { HBaseEntity } from './item.model';
import bcryptjs from 'bcryptjs';

@Entity()
export class User extends HBaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    username!: string;
    @Column()
    password!: string;

    private tempPassword = '';

    @AfterLoad()
    private loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    @BeforeUpdate()
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
}
