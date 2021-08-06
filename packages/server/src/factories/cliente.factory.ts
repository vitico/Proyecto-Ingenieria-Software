import Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { Cliente, Correo, ReferenciaGustoCliente } from '../models/cliente.model';
import { IngredienteUnidad } from '../models/ingrediente_unidad.model';
import { Grupo } from '../models/grupo.model';
import { Producto } from '../models/producto.model';
define(Cliente, (faker: typeof Faker, { grupos, productos, ingredientes }) => {
    // const gender = faker.random.number(1);
    const data = new Cliente();
    data.nombre = faker.name.firstName();
    data.apellido = faker.name.lastName();
    data.identificacion = '';

    // data.correos = await factory(Correo)({ cliente: data }).createMany(
    //     faker.random.number(),
    //     { cliente: data }
    // );
    data.identificacion = faker.finance.account();

    return data;
});
define<Correo, { cliente: Cliente }>(Correo, (faker: typeof Faker, { cliente }) => {
    // const gender = faker.random.number(1);
    const data = new Correo();
    data.correo = faker.internet.email(cliente.nombre, cliente.apellido);
    data.cliente = cliente;

    return data;
});

define<
    ReferenciaGustoCliente,
    {
        grupos: Grupo[];
        productos: Producto[];
        ingredientes: IngredienteUnidad[];
        cliente: Cliente;
    }
>(
    ReferenciaGustoCliente,
    (faker: typeof Faker, { grupos, productos, ingredientes, cliente }) => {
        const data = new ReferenciaGustoCliente();
        const n = faker.random.number(3);
        if (n >= 2) {
            data.grupo = faker.random.arrayElement(grupos);
        } else if (n >= 1) {
            data.producto = faker.random.arrayElement(productos);
        } else {
            data.ingrediente = faker.random.arrayElement(ingredientes).ingrediente;
        }
        data.cliente = cliente;
        data.rechazar = faker.random.boolean();

        return data;
    }
);
