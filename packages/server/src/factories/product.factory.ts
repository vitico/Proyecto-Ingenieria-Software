import Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { Producto } from '../models/producto.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';
import { Grupo } from '../models/grupo.model';
define(Producto, (faker: typeof Faker, { grupos, ingredientes }) => {
    // const gender = faker.random.number(1);
    const data = new Producto();
    data.aceptaCompana = faker.random.boolean();
    data.esCompania = data.aceptaCompana ? false : faker.random.boolean();
    data.ingredientes = ingredientes
        .sort(() => 0.5 - Math.random())
        .slice(0, faker.random.number({ min: 1, max: ingredientes.length }));
    const dec = 2;

    const randValue = faker.random.number({ max: 1000, min: 1 });

    data.precio = Math.round(randValue * Math.pow(10, dec)) / Math.pow(10, dec);
    data.nombre = faker.commerce.productName();
    data.grupos = grupos
        .sort(() => 0.5 - Math.random())
        .slice(0, faker.random.number({ min: 1, max: grupos.length }));
    return data;
});
define(Grupo, (faker: typeof Faker, { grupos }) => {
    const data = new Grupo();
    data.parent = grupos ? faker.random.arrayElement(grupos) : null;
    data.nombre = faker.name.jobArea();
    return data;
});
