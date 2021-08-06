import { FieldResolver, Query, Resolver, Root, ResolverInterface } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { Oferta } from '../models/oferta.model';
import { Cliente, ReferenciaGustoCliente } from '../models/cliente.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';
import { DetalleFactura } from '../models/factura.model';
import { Producto } from '../models/producto.model';
function isGustoRelated(
    gusto: ReferenciaGustoCliente,
    grupos: any[],
    productos: any[],
    ingredientes: any[]
) {
    if (gusto.idGrupo) {
        if (grupos.includes(gusto.idGrupo)) return true;
    } else if (gusto.idProducto) {
        if (productos.includes(gusto.idProducto)) return true;
    } else if (gusto.idIngrediente) {
        if (ingredientes.includes(gusto.idIngrediente)) return true;
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
    ofertas(): Promise<typeof Oferta[]> {
        return this.repoOferta.find({
            relations: [
                'condicion',
                'extra',
                'condicion.producto',
                'extra.producto',
                'condicion.producto.ingredientes',
                'extra.producto.ingredientes',
            ],
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
                if (gustos.length > 0) return !gustos.some((gusto) => gusto.rechazar);
            }
            const productosFactura = cliente.facturas
                .reduce(
                    (acc, factura) => acc.concat(...factura.detalles),
                    [] as DetalleFactura[]
                )
                .reduce(
                    (acc, detalleFactura) => acc.concat(detalleFactura.producto),
                    [] as Producto[]
                );

            const productosFiltrados = productosFactura
                .filter((producto) => {
                    return (
                        productos.includes(producto.id) ||
                        producto.idGrupos.some((grupo) => grupos.includes(grupo)) ||
                        producto.idIngredientes.some((ingrediente) =>
                            ingredientes.includes(ingrediente)
                        )
                    );
                })
                .map((t) => t.id);
            const cantidadFacturas = 10;
            return new Set(productosFiltrados).size > cantidadFacturas;
        });
        return clientesFiltrados;
    }
}
