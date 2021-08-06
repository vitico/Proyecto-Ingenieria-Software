import Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { Ingrediente } from '../models/Ingrediente.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';
import { Unidad } from '../models/unidad.model';
define(Ingrediente, (faker: typeof Faker) => {
    const data = new Ingrediente();
    data.nombre = faker.commerce.productName();
    return data;
});
//@ts-ignore
define(IngredienteUnidad, async (faker: typeof Faker, context: { prodId: string }) => {
    const data = new IngredienteUnidad();
    data.ingrediente = await factory(Ingrediente)().create();
    data.unidad = await factory(Unidad)().create();
    const dec = 2;

    const randValue = faker.random.number({ max: 1000, min: 1 });

    data.precio = Math.round(randValue * Math.pow(10, dec)) / Math.pow(10, dec);
    return data;
});
