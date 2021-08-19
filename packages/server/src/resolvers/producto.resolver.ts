import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, getManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { Producto } from '../models/producto.model';
import { IdIngredienteUnidad } from './ingrediente_unidad.resolver';
import { getLoader, getLoaderReturn } from '../utils/graphUtils';
import { Grupo } from '../models/grupo.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';

@Resolver(() => Producto)
@Service()
export class ProductoResolver {
    constructor(
        @InjectRepository(Producto) private readonly repo: Repository<Producto>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Producto], { nullable: true })
    async productos(@getLoader() [loader, info]: getLoaderReturn): Promise<Producto[]> {
        return loader.loadEntity(Producto).info(info).loadMany();
    }

    @Query(() => Producto, { nullable: true })
    producto(@Arg('id') id: string, @getLoader() [loader, info]: getLoaderReturn) {
        return loader
            .loadEntity(Producto, 'data')
            .where('data.id = :id', { id })
            .info(info)
            .loadOne();
    }

    @Mutation(() => Boolean)
    async saveProducto(
        @Arg('id', { nullable: true }) id: string,
        @Arg('nombre') nombre: string,
        @Arg('aceptaCompana', { nullable: true, defaultValue: false })
        aceptaCompana: boolean,
        @Arg('esCompania', { nullable: true, defaultValue: false }) esCompania: boolean,
        @Arg('precio') precio: number,
        @Arg('grupos', (_) => [String], { nullable: true }) grupos: string[] = [],
        @Arg('ingredientes', (_) => [IdIngredienteUnidad], { nullable: true })
        ingredientes: IdIngredienteUnidad[] = []
    ) {
        const data = id ? await this.repo.findOne(id) : new Producto();
        data.nombre = nombre;
        data.aceptaCompana = aceptaCompana;
        data.esCompania = esCompania;
        data.precio = precio;
        data.grupos = await getManager().findByIds(Grupo, grupos);
        // data.grupos = grupos.map((id) => <any>{ id });
        data.ingredientes = await getManager().findByIds(
            IngredienteUnidad,
            ingredientes.map((t) => ({
                idIngrediente: t.ingrediente,
                idUnidad: t.unidad,
            }))
        );
        try {
            await this.repo.save(data);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }

    @Mutation(() => Boolean)
    async deleteProducto(@Arg('id') id: string) {
        try {
            await this.repo.delete(id);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
