import {
    FieldResolver,
    Query,
    Resolver,
    Root,
    ResolverInterface,
    Args,
    Arg,
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

function isGustoRelated(
    gusto: ReferenciaGustoCliente,
    grupos: any[],
    productos: any[],
    ingredientes: any[]
) {
    if (gusto.idGrupo) {
        return grupos.includes(gusto.idGrupo);
    } else if (gusto.idProducto) {
        return productos.includes(gusto.idProducto);
    } else if (gusto.idIngrediente) {
        return ingredientes.includes(gusto.idIngrediente);
    }
    return false;
}

@Resolver(() => Oferta)
@Service()
export class OfertaResolver implements ResolverInterface<Oferta> {
    constructor(
        @InjectRepository(Oferta) private readonly repoOferta: Repository<typeof Oferta>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Oferta])
    async ofertas(
        @Arg('id', { nullable: true }) id: string,
        @getInfo() info: GraphQLResolveInfo
    ): Promise<typeof Oferta[]> {
        logger.info({ message: 'this is an info message', answer: 42 });
        // or equivalently
        logger.info('this is an info message', { answer: 42 });

        // logger.error({ message: new Error('FakeError'), somenumber: 96 });
        // or equivalently
        // logger.error(new Error('FakeError'), { somenumber: 96 });
        const relations = [];
        const fields = fieldsList(info);
        if (fields.includes('clienteInteresado')) {
            relations.push(
                'condicion',
                'extra',
                'condicion.producto',
                'extra.producto',
                'condicion.producto.ingredientes',
                'extra.producto.ingredientes'
            );
        }
        if (id) return [await this.repoOferta.findOne(id, { relations })];
        return this.repoOferta.find({
            relations: relations,
        });
    }

    @FieldResolver(() => [Cliente], { nullable: true })
    async clienteInteresado(@Root() oferta: Oferta) {
        const clientes = await this.manager.find(Cliente, {
            relations: [
                'facturas',
                'facturas.detalles',
                'facturas.detalles.producto',
                'gustos',
            ],
        });
        const grupos = [
            ...oferta.condicion.map((t) => t.idGrupo),
            ...oferta.extra.map((t) => t.idGrupo),
        ].filter(Boolean);
        const _productos = [
            ...oferta.condicion.map((t) => t.producto),
            ...oferta.extra.map((t) => t.producto),
        ].filter(Boolean);
        const productos = _productos.map((t) => t.id);

        const ingredientes = _productos
            .reduce((acc, t) => [...acc, ...t.ingredientes], [] as IngredienteUnidad[])
            .map((t) => t.ingrediente.id);

        const clientesFiltrados = clientes.filter((cliente) => {
            if (cliente.gustos.length > 0) {
                const gustos = cliente.gustos.filter((gusto) =>
                    isGustoRelated(gusto, grupos, ingredientes, productos)
                );
                if (gustos.length > 0) {
                    const accept = !gustos.some((gusto) => gusto.rechazar);
                    logger.debug(
                        `cliente (${cliente.id}): ${
                            accept ? 'aceptado' : 'rechazado'
                        } por gusto`,
                        { gustos }
                    );

                    return accept;
                }
            }
            const detallesFacturas = cliente.facturas.reduce(
                (acc, factura) => acc.concat(...factura.detalles),
                [] as DetalleFactura[]
            );

            const facturasFiltradas = detallesFacturas
                .filter((detalle) => {
                    return (
                        productos.includes(detalle.producto.id) ||
                        detalle.producto.idGrupos.some((grupo) =>
                            grupos.includes(grupo)
                        ) ||
                        detalle.producto.idIngredientes.some((ingrediente) =>
                            ingredientes.includes(ingrediente)
                        )
                    );
                })
                .map((t) => t.idFactura);
            const cantidadFacturas = 10;
            const facturas = new Set(facturasFiltradas);
            const accept = facturas.size > cantidadFacturas;
            logger.debug(
                `cliente (${cliente.id}): ${
                    accept ? 'aceptado' : 'rechazado'
                } por facturas`,
                { facturas: facturasFiltradas, size: facturas.size }
            );
            return;
        });
        return clientesFiltrados;
    }
}
