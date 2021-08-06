import Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { Ingrediente } from '../models/Ingrediente.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';
import { Unidad } from '../models/unidad.model';
define(Unidad, (faker: typeof Faker) => {
    const data = new Unidad();
    data.nombre = faker.commerce.productName();
    return data;
});
