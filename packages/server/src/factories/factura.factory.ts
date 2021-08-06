import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { DetalleFactura, Factura } from '../models/factura.model';
define(Factura, (faker: typeof Faker, { clientes }) => {
    // const gender = faker.random.number(1);
    const data = new Factura();
    data.cliente = faker.random.arrayElement(clientes);

    return data;
});
define(DetalleFactura, (faker: typeof Faker, { productos }) => {
    // const gender = faker.random.number(1);
    const data = new DetalleFactura();
    data.cantidad = faker.random.number({ min: 0, precision: 1 });
    data.producto = faker.random.arrayElement(productos);
    data.precio = data.producto.precio;
    data.importe = data.precio;
    data.itbis = 0;
    return data;
});
