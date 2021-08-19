import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, getConnection, getManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { Ingrediente } from '../models/Ingrediente.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';

@InputType()
class ArgUnidades {
    @Field()
    idUnidad: string;
    @Field()
    precio: number;
}

@Resolver(() => Ingrediente)
@Service()
export class IngredienteResolver {
    constructor(
        @InjectRepository(Ingrediente) private readonly repo: Repository<Ingrediente>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Ingrediente], { nullable: true })
    async ingredientes(): Promise<Ingrediente[]> {
        return this.repo.find({
            relations: ['unidades'],
        });
    }

    @Query(() => Ingrediente, { nullable: true })
    ingrediente(@Arg('id') id: string) {
        return this.repo.findOne(id, {
            relations: ['unidades'],
        });
    }

    @Mutation(() => Boolean)
    async saveIngrediente(
        @Arg('id', { nullable: true }) id: string,
        @Arg('nombre') nombre: string,
        @Arg('unidades', () => [ArgUnidades]) unidades: ArgUnidades[]
    ) {
        const data = id
            ? await this.repo.findOne(id, {
                  relations: ['unidades'],
              })
            : new Ingrediente();
        data.nombre = nombre;
        const toAdd = unidades
            .map((unidad) => {
                const i = data.unidades.findIndex((t) => t.idUnidad == unidad.idUnidad);
                if (i !== -1) {
                    data.unidades[i].precio = unidad.precio;
                } else {
                    const dt = new IngredienteUnidad();
                    dt.ingrediente = data;
                    dt.idUnidad = unidad.idUnidad;
                    dt.precio = unidad.precio;
                    return dt;
                }
            })
            .filter(Boolean);
        const toRemove = data.unidades.filter(
            (t) => !unidades.some((uni) => uni.idUnidad == t.idUnidad)
        );
        try {
            await getManager().transaction(async (manager) => {
                await manager.save(data);
                await manager.remove(toRemove);
                await manager.save(
                    toAdd.map((t) => {
                        t.idIngrediente = data.id;
                        return t;
                    })
                );
            });

            // data.unidades = data.unidades(t=>t.);
            // await this.repo.save(data);
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
