import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { Unidad } from '../models/unidad.model';

@Resolver(() => Unidad)
@Service()
export class UnidadResolver {
    constructor(
        @InjectRepository(Unidad) private readonly repo: Repository<Unidad>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Unidad], { nullable: true })
    async unidades(): Promise<Unidad[]> {
        return this.repo.find();
    }

    @Query(() => Unidad, { nullable: true })
    unidad(@Arg('id') id: string) {
        return this.repo.findOne(id);
    }

    @Mutation(() => Boolean)
    async saveUnidad(
        @Arg('id', { nullable: true }) id: string,
        @Arg('nombre') nombre: string
    ) {
        const data = id ? await this.repo.findOne(id) : new Unidad();
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
    async deleteUnidad(@Arg('id') id: string) {
        try {
            // this.repo.
            await this.repo.delete(id);
            // await this.repo.save(this.repo.create(unidad));
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
