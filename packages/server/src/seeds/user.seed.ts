import { User } from '../models/user.model';
import { factory, Factory, Seeder } from 'typeorm-seeding';
import { Producto } from '../models/producto.model';
import { DetalleFactura, Factura } from '../models/factura.model';
import * as faker from 'faker';
import { getConnection, getManager } from 'typeorm';
import { Cliente, Correo, ReferenciaGustoCliente } from '../models/cliente.model';
import { Grupo } from '../models/grupo.model';
import { CondicionOferta, Oferta } from '../models/oferta.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';

export default class CreateUsers implements Seeder {
    public async run(factory: Factory): Promise<void> {
        await factory(User)({ roles: [] }).createMany(10);
        const grupos = await factory(Grupo)({}).createMany(10);
        grupos.push(...(await factory(Grupo)({ grupos }).createMany(10)));
        const ingredientes = await factory(IngredienteUnidad)().createMany(50);
        const productos = await factory(Producto)({ grupos, ingredientes }).createMany(
            50
        );
        const clientes = await factory(Cliente)({
            grupos,
            productos,
            ingredientes,
        }).createMany(10);
        for (const cliente of clientes) {
            cliente.gustos = await factory(ReferenciaGustoCliente)({
                grupos,
                productos,
                ingredientes,
                cliente,
            }).createMany(2);
            cliente.correos = await factory(Correo)({
                cliente,
            }).createMany(faker.random.number(3));
        }
        const facturas = await factory(Factura)({ clientes }).createMany(10);
        for (const factura of facturas) {
            await factory(DetalleFactura)({ productos }).createMany(10, {
                factura,
            });
        }
        const ofertas = await factory(Oferta)({}).createMany(10);
        for (const oferta of ofertas) {
            await factory(CondicionOferta)({ oferta, productos, grupos }).createMany(10);
        }
        await factory(Oferta)({}).createMany(10);
    }
}
