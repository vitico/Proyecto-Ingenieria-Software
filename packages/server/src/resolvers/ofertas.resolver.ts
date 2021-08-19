import {
    Arg,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    Query,
    registerEnumType,
    Resolver,
    ResolverInterface,
    Root,
} from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, getManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { CondicionOferta, ExtraOferta, Oferta } from '../models/oferta.model';
import { Cliente, ReferenciaGustoCliente } from '../models/cliente.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';
import { DetalleFactura } from '../models/factura.model';
import { fieldsList } from 'graphql-fields-list';
import { GraphQLResolveInfo } from 'graphql';
import { logger } from '../utils';
import { getInfo } from '../utils/graphUtils';

enum TipoDataOferta {
    producto,
    grupo,
}

@InputType()
class ArgExtraOferta {
    @Field()
    id: string;
    @Field()
    cantidad: number;
    @Field(() => TipoDataOferta)
    typo: TipoDataOferta;
}

@InputType()
class ArgCondicionOferta extends ArgExtraOferta {
    @Field()
    opcional: boolean;
}

registerEnumType(TipoDataOferta, {
    name: 'TipoDataOferta',
});

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

async function getClientesInteresados(oferta: Oferta, cantidadFacturas = 10) {
    const clientes = await getManager().find(Cliente, {
        relations: [
            'facturas',
            'facturas.detalles',
            'facturas.detalles.producto',
            'gustos',
            'correos',
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
        .map((t) => t.idIngrediente);

    return clientes.filter((cliente) => {
        if (cliente.gustos.length > 0) {
            const gustos = cliente.gustos.filter((gusto) =>
                isGustoRelated(gusto, grupos, ingredientes, productos)
            );
            if (gustos.length > 0) {
                const accept = !gustos.some((gusto) => gusto.rechazar);
                logger.info(
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
                    detalle.producto.idGrupos.some((grupo) => grupos.includes(grupo)) ||
                    detalle.producto.idIngredientes.some((ingrediente) =>
                        ingredientes.includes(ingrediente.ingrediente.id)
                    )
                );
            })
            .map((t) => t.idFactura);
        const facturas = new Set(facturasFiltradas);
        const accept = facturas.size > cantidadFacturas;
        logger.info(
            `cliente (${cliente.id}): ${accept ? 'aceptado' : 'rechazado'} por facturas`,
            { facturas: facturasFiltradas, size: facturas.size }
        );
        return;
    });
}

@Resolver(() => Oferta)
@Service()
export class OfertaResolver implements ResolverInterface<Oferta> {
    constructor(
        @InjectRepository(Oferta) private readonly repoOferta: Repository<Oferta>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Oferta], { nullable: true })
    async ofertas(
        @Arg('id', { nullable: true }) id: string,
        @getInfo() info: GraphQLResolveInfo
    ): Promise<Oferta[]> {
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
        if (fields.includes('condicion')) relations.push('condicion');

        if (fields.includes('extra')) relations.push('extra');
        return this.repoOferta.find({
            relations: relations,
        });
    }

    @Query((returns) => Oferta, { nullable: true })
    async oferta(
        @Arg('id', { nullable: true }) id: string,
        @getInfo() info: GraphQLResolveInfo
    ): Promise<Oferta> {
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
        if (fields.includes('condicion')) relations.push('condicion');

        if (fields.includes('extra')) relations.push('extra');

        return this.repoOferta.findOne(id, { relations });
    }

    @Mutation(() => Boolean)
    async saveOferta(
        @Arg('id', { nullable: true }) id: string,
        @Arg('fechaInicial') fechaInicial: Date,
        @Arg('fechaFinal') fechaFinal: Date,
        @Arg('activo') activo: boolean,
        @Arg('precioDescuento') precioDescuento: number,
        @Arg('porcentajeDescuento') porcentajeDescuento: number,
        @Arg('extra', (_) => [ArgExtraOferta]) extra: ArgExtraOferta[],
        @Arg('condicion', (_) => [ArgCondicionOferta]) condicion: ArgCondicionOferta[]
    ) {
        const data = id ? await this.repoOferta.findOne(id) : new Oferta();
        data.fechaInicial = fechaInicial;
        data.fechaFinal = fechaFinal;
        data.activo = activo;
        data.precioDescuento = precioDescuento;
        data.porcentajeDescuento = porcentajeDescuento;
        const _extra = extra.map((t) => {
            const dt = new ExtraOferta();
            dt.oferta = data;
            let prop: keyof typeof dt = 'idGrupo';
            switch (t.typo) {
                case TipoDataOferta.grupo:
                    prop = 'idGrupo';
                    break;
                case TipoDataOferta.producto:
                    prop = 'idProducto';
                    break;
            }
            dt[prop] = t.id;
            dt.cantidad = t.cantidad;
            return dt;
        });
        const _condicion = condicion.map((t) => {
            const dt = new CondicionOferta();
            dt.oferta = data;
            let prop: keyof typeof dt = 'idGrupo';
            switch (t.typo) {
                case TipoDataOferta.grupo:
                    prop = 'idGrupo';
                    break;
                case TipoDataOferta.producto:
                    prop = 'idProducto';
                    break;
            }
            dt[prop] = t.id;
            dt.cantidad = t.cantidad;
            dt.opcional = t.opcional;
            return dt;
        });
        // data.
        try {
            await getManager().transaction(async (manager) => {
                await manager.save(data);
                await manager.save(
                    _condicion.map((t) => {
                        t.oferta = data;
                        return t;
                    })
                );
                await manager.save(
                    _extra.map((t) => {
                        t.oferta = data;
                        return t;
                    })
                );
            });
            // await this.repoOferta.save(data);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }

    @Query((returns) => [Cliente], { nullable: true })
    async clientesOferta(
        @Arg('oferta') id: string,
        @Arg('cantidadFacturas', (_) => Int, { defaultValue: 10 })
        cantidadFacturas: number
    ) {
        const oferta = await this.repoOferta.findOne(id, {
            relations: [
                'condicion',
                'extra',
                'condicion.producto',
                'extra.producto',
                'condicion.producto.ingredientes',
                'extra.producto.ingredientes',
            ],
        });
        return getClientesInteresados(oferta, cantidadFacturas);
    }

    @FieldResolver(() => [Cliente], { nullable: true })
    async clienteInteresado(@Root() oferta: Oferta) {
        return getClientesInteresados(oferta);
    }
}
