import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { Grupo } from '../models/grupo.model';

@Resolver(() => Grupo)
@Service()
export class GrupoResolver {
    constructor(
        @InjectRepository(Grupo) private readonly repo: Repository<Grupo>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Grupo])
    async grupos(): Promise<Grupo[]> {
        return this.repo.find();
    }

    @Query(() => Grupo)
    grupo(@Arg('id') id: string) {
        return this.repo.findOne(id);
    }

    @Mutation(() => Boolean)
    async saveGrupo(
        @Arg('id', { nullable: true }) id: string,
        @Arg('nombre') nombre: string,
        @Arg('idPadre') idPadre: string
    ) {
        const data = id ? await this.repo.findOne(id) : new Grupo();
        data.nombre = nombre;
        data.idParent = idPadre;
        try {
            await this.repo.save(data);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }

    @Mutation(() => Boolean)
    async deleteGrupo(@Arg('id') id: string) {
        try {
            await this.repo.delete(id);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
