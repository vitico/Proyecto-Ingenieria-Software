import {
    Arg,
    ArgsType,
    Field,
    InputType,
    Mutation,
    Query,
    registerEnumType,
    Resolver,
} from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from '../utils';
import { Cliente, Correo, ReferenciaGustoCliente } from '../models/cliente.model';
import PaginatedResponse, {
    getLoader,
    getLoaderReturn,
    OffsetArg,
} from '../utils/graphUtils';
import { QueryPagination } from '@mando75/typeorm-graphql-loader';

enum GustoType {
    producto,
    grupo,
    ingrediente,
}

registerEnumType(GustoType, {
    name: 'GustoType',
});

@InputType()
class GustoArg {
    @Field()
    id!: string;
    @Field((_) => GustoType)
    tipo!: GustoType;
    @Field()
    rechazar!: boolean;
}

const PaginatedClienteResponse = PaginatedResponse(Cliente);
type PaginatedClienteResponse = InstanceType<typeof PaginatedClienteResponse>;

@Resolver(() => Cliente)
@Service()
export class ClienteResolver {
    constructor(
        @InjectRepository(Cliente) private readonly repo: Repository<Cliente>,
        @InjectManager() private readonly manager: EntityManager
    ) {}

    @Query((returns) => PaginatedClienteResponse)
    async clientes(
        @getLoader() [loader, info]: getLoaderReturn,
        @Arg('pagination', { nullable: true }) pagination?: OffsetArg
    ): Promise<PaginatedClienteResponse> {
        if (!pagination)
            pagination = {
                offset: 0,
                limit: 10,
            };
        const [records, totalCount] = await loader
            .loadEntity(Cliente)
            .info(info, 'items')
            .paginate({ offset: pagination.offset, limit: pagination.limit })
            .loadPaginated();
        return {
            items: records,
            nextOffset: pagination.offset + records.length,
            hasMore: records.length < totalCount,
            total: totalCount,
        };
    }

    @Query(() => Cliente, { nullable: true })
    cliente(@Arg('id') id: number) {
        return this.repo.findOne(id, { relations: ['gustos'] });
    }

    @Mutation(() => Boolean)
    async saveCliente(
        @Arg('id', { nullable: true }) id: string,
        @Arg('nombre') nombre: string,
        @Arg('apellido') apellido: string,
        @Arg('identificacion') identificacion: string,
        @Arg('correos', (_) => [String]) correos: string[],
        @Arg('gustos', (_) => [GustoArg]) gustos: GustoArg[]
    ) {
        const data = id ? await this.repo.findOne(id) : new Cliente();
        data.nombre = nombre;
        data.apellido = apellido;
        data.identificacion = identificacion;
        data.gustos = gustos.map((t) => {
            const dt = new ReferenciaGustoCliente();
            let prop: keyof typeof dt = 'idProducto';
            switch (t.tipo) {
                case GustoType.ingrediente:
                    prop = 'ingrediente';
                    break;
                case GustoType.grupo:
                    prop = 'grupo';
                    break;
                case GustoType.producto:
                    prop = 'producto';
                    break;
            }
            dt[prop] = <any>{ id: t.id };
            dt.rechazar = t.rechazar;
            return dt;
        });
        data.correos = correos.map((t) => {
            const correo = new Correo();
            correo.correo = t;
            correo.cliente = data;
            return correo;
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
    async deleteCliente(@Arg('id') id: string) {
        try {
            await this.repo.delete(id);
            return true;
        } catch (e) {
            logger.error('error', e);
            return false;
        }
    }
}
