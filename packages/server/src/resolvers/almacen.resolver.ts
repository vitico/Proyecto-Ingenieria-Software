import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { Almacen } from '../models/almacen.model';

@Resolver(() => Almacen)
@Service()
export class AlmacenResolver {
    constructor(
        @InjectRepository(Almacen) private readonly repo: Repository<Almacen>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Almacen], { nullable: true })
    async almacenes(): Promise<Almacen[]> {
        return this.repo.find();
    }

    @Query(() => Almacen, { nullable: true })
    almacen(@Arg('id') id: string) {
        return this.repo.findOne(id);
    }

    @Mutation(() => Boolean)
    async saveAlmacen(
        @Arg('id', { nullable: true }) id: string,
        @Arg('nombre') nombre: string
    ) {
        const data = id ? await this.repo.findOne(id) : new Almacen();
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
    async deleteAlmacen(@Arg('id') id: string) {
        try {
            await this.repo.delete(id);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
