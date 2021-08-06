import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Cliente, Correo } from '../models/cliente.model';
import { CondicionOferta, Oferta } from '../models/oferta.model';
define(Oferta, (faker: typeof Faker) => {
    // const gender = faker.random.number(1);
    const data = new Oferta();
    data.fechaInicial = faker.date.future();
    data.fechaFinal = faker.date.future(undefined, data.fechaInicial);
    data.activo = true;
    data.porcentajeDescuento = faker.random.number(100);
    return data;
});

define(CondicionOferta, (faker, { oferta, grupos, productos }) => {
    const data = new CondicionOferta();
    const esGrupo = faker.random.boolean();
    data.oferta = oferta;
    data.cantidad = faker.random.number(5);
    if (esGrupo) {
        data.grupo = faker.random.arrayElement(grupos);
    } else {
        data.producto = faker.random.arrayElement(productos);
    }
    data.opcional = faker.random.boolean();
    return data;
});
