import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { getLoader, getLoaderReturn } from '../utils/graphUtils';
import { DetalleFactura, Factura } from '../models/factura.model';

@InputType()
class ArgDetalleFactura {
    @Field()
    producto!: string;
    @Field()
    precio!: number;
    @Field()
    cantidad!: number;
    @Field()
    itbis!: number;
    @Field()
    importe!: number;
}

@Resolver(() => Factura)
@Service()
export class FacturaResolver {
    constructor(
        @InjectRepository(Factura) private readonly repo: Repository<Factura>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => [Factura], { nullable: true })
    async facturas(@getLoader() [loader, info]: getLoaderReturn): Promise<Factura[]> {
        return loader.loadEntity(Factura).info(info).loadMany();
    }

    @Query(() => Factura, { nullable: true })
    factura(@getLoader() [loader, info]: getLoaderReturn, @Arg('id') id: string) {
        return loader
            .loadEntity(Factura, 'dt')
            .where('dt.id=:id', { id: id })
            .info(info)
            .loadOne();
    }

    @Mutation(() => Boolean)
    async saveFactura(
        @Arg('id', { nullable: true }) id: string,
        @Arg('cliente') cliente: string,
        @Arg('fecha') fecha: Date,
        @Arg('detalles', (_) => [ArgDetalleFactura]) detalles: ArgDetalleFactura[]
    ) {
        const data = id ? await this.repo.findOne(id) : new Factura();
        data.cliente = <any>{ id: cliente };
        data.fecha = fecha;
        data.detalles = detalles.map((dt) => {
            const detalle = new DetalleFactura();
            detalle.factura = data;
            detalle.producto = <any>{ id: dt.producto };
            detalle.precio = dt.precio;
            detalle.importe = dt.importe;
            detalle.itbis = dt.itbis;
            detalle.cantidad = dt.cantidad;
            return detalle;
        });
        try {
            await this.repo.save(data);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }

    @Mutation(() => Boolean)
    async deleteFactura(@Arg('id') id: string) {
        try {
            await this.repo.delete(id);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
