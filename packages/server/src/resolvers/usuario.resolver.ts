import { User } from '../models/user.model';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';

@Resolver(() => User)
@Service()
export class UserResolver {
    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [User], { nullable: true })
    async users(): Promise<User[]> {
        return this.repo.find();
    }

    @Query(() => User, { nullable: true })
    user(@Arg('id') id: string) {
        return this.repo.findOne(id);
    }

    @Mutation(() => Boolean)
    async saveUser(
        @Arg('id', { nullable: true }) id: string,
        @Arg('nombre') nombre: string,
        @Arg('pass') pass: string
    ) {
        const data = id ? await this.repo.findOne(id) : new User();
        data.username = nombre;
        data.password = pass;
        try {
            await this.repo.save(data);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg('id') id: string) {
        try {
            await this.repo.delete(id);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
