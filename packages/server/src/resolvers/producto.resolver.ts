import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { Ingrediente } from '../models/Ingrediente.model';

@Resolver(() => Ingrediente)
@Service()
export class IngredienteResolver {
    constructor(
        @InjectRepository(Ingrediente) private readonly repo: Repository<Ingrediente>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Ingrediente])
    async ingredientes(): Promise<Ingrediente[]> {
        return this.repo.find();
    }

    @Query(() => Ingrediente)
    ingrediente(@Arg('id') id: string) {
        return this.repo.findOne(id);
    }

    @Mutation(() => Boolean)
    async saveIngrediente(
        @Arg('id', { nullable: true }) id: string,
        @Arg('nombre') nombre: string
    ) {
        const data = id ? await this.repo.findOne(id) : new Ingrediente();
        data.nombre = nombre;
        try {
            await this.repo.save(data);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }

    @Mutation(() => Boolean)
    async deleteIngrediente(@Arg('id') id: string) {
        try {
            await this.repo.delete(id);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
