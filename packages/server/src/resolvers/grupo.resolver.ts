import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { Ingrediente } from '../models/Ingrediente.model';
import { Producto } from '../models/producto.model';

@Resolver(() => Producto)
@Service()
export class ProductoResolver {
    constructor(
        @InjectRepository(Producto) private readonly repo: Repository<Producto>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Producto])
    async productos(): Promise<Producto[]> {
        return this.repo.find();
    }

    @Query(() => Producto)
    producto(@Arg('id') id: string) {
        return this.repo.findOne(id);
    }

    @Mutation(() => Boolean)
    async saveProducto(
        @Arg('id', { nullable: true }) id: string,
        @Arg('nombre') nombre: string,
        @Arg('aceptaCompana') aceptaCompana: boolean,
        @Arg('esCompania') esCompania: boolean,
        @Arg('precio') precio: number,
        @Arg('grupos') grupos: string[],
        @Arg('ingredientes') ingredientes: string[]
    ) {
        const data = id ? await this.repo.findOne(id) : new Producto();
        data.nombre = nombre;
        data.aceptaCompana = aceptaCompana;
        data.esCompania = esCompania;
        data.precio = precio;
        data.idGrupos = grupos;
        data.idIngredientes = ingredientes;
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
