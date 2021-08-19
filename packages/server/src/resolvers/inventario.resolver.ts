import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Column, EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { Inventario } from '../models/inventario.model';

@InputType()
class IdInventarioInput {
    @Field()
    idIngrediente: string;

    @Field()
    idUnidad: string;
    @Field()
    idAlmacen: string;
}

@Resolver(() => Inventario)
@Service()
export class InventarioResolver {
    constructor(
        @InjectRepository(Inventario) private readonly repo: Repository<Inventario>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((_) => [Inventario], { nullable: true })
    async inventarios(): Promise<Inventario[]> {
        return this.repo.find({});
    }

    @Query(() => Inventario, { nullable: true })
    inventario(@Arg('id') id: IdInventarioInput) {
        return this.repo.findOne({
            where: {
                idIngrediente: id.idIngrediente,
                idUnidad: id.idUnidad,
                idAlmacen: id.idAlmacen,
            },
        });
    }

    @Mutation(() => Boolean)
    async saveInventario(
        @Arg('id') id: IdInventarioInput,
        @Arg('cantidad', (_) => Int) cantidad: number
    ) {
        let data = await this.repo.findOne({
            where: {
                idIngrediente: id.idIngrediente,
                idUnidad: id.idUnidad,
                idAlmacen: id.idAlmacen,
            },
        });
        if (!data) {
            data = new Inventario();
            data.almacen = <any>{ id: id.idAlmacen };
            data.ingrediente = <any>{
                idIngrediente: id.idIngrediente,
                idUnidad: id.idUnidad,
            };
        }
        data.cantidad = cantidad;

        try {
            await this.repo.save(data);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }

    @Mutation(() => Boolean)
    async deleteInventario(@Arg('id') id: IdInventarioInput) {
        try {
            await this.repo.delete({
                idIngrediente: id.idIngrediente,
                idUnidad: id.idUnidad,
                idAlmacen: id.idAlmacen,
            });
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
