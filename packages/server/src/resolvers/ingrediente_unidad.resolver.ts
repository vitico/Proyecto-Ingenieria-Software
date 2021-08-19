import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';

@InputType()
export class IdIngredienteUnidad {
    @Field()
    ingrediente: string;
    @Field()
    unidad: string;
}

@Resolver(() => IngredienteUnidad)
@Service()
export class IngredienteUnidadResolver {
    constructor(
        @InjectRepository(IngredienteUnidad)
        private readonly repo: Repository<IngredienteUnidad>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [IngredienteUnidad], { nullable: true })
    async ingredientes_unidad(): Promise<IngredienteUnidad[]> {
        return this.repo.find();
    }

    @Query(() => IngredienteUnidad, { nullable: true })
    ingrediente_unidad(@Arg('id') id: IdIngredienteUnidad) {
        return this.repo.findOne({
            where: {
                idIngrediente: id.ingrediente,
                idUnidad: id.unidad,
            },
        });
    }

    @Mutation(() => Boolean)
    async saveIngredienteUnidad(
        @Arg('id') id: IdIngredienteUnidad,
        @Arg('precio') precio: number
    ) {
        let data = await this.repo.findOne({
            where: {
                idIngrediente: id.ingrediente,
                idUnidad: id.unidad,
            },
        });
        if (!data) {
            data = new IngredienteUnidad();
            data.idIngrediente = id.ingrediente;
            data.idUnidad = id.unidad;
        }
        // data.ingrediente = <any>{ id: id.ingrediente };
        // data.unidad = <any>{ id: id.unidad };
        data.precio = precio;
        try {
            await this.repo.save(data);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }

    @Mutation(() => Boolean)
    async deleteIngredienteUnidad(@Arg('id') id: IdIngredienteUnidad) {
        try {
            await this.repo.delete({
                idIngrediente: id.ingrediente,
                idUnidad: id.unidad,
            });
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
