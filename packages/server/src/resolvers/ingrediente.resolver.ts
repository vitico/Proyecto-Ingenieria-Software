import {
    FieldResolver,
    Query,
    Resolver,
    Root,
    ResolverInterface,
    Args,
    Arg,
    Mutation,
} from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { Oferta } from '../models/oferta.model';
import { Cliente, ReferenciaGustoCliente } from '../models/cliente.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';
import { DetalleFactura } from '../models/factura.model';
import { Producto } from '../models/producto.model';
import { fieldsList, fieldsMap } from 'graphql-fields-list';
import { getInfo } from './item.resolver';
import { GraphQLResolveInfo } from 'graphql';
import { logger } from '../utils';
import { Unidad } from '../models/unidad.model';
import { Entidad } from '../models/entidad.base';

@Resolver(() => Unidad)
@Service()
export class UnidadResolver {
    constructor(
        @InjectRepository(Unidad) private readonly repo: Repository<Unidad>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Unidad])
    async unidades(): Promise<Unidad[]> {
        return this.repo.find();
    }

    @Query(() => Unidad)
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
