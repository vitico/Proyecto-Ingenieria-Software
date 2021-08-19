import {
    ClassType,
    createParamDecorator,
    Field,
    InputType,
    Int,
    ObjectType,
} from 'type-graphql';
import { GraphQLDatabaseLoader } from '@mando75/typeorm-graphql-loader';
import { buildContext, PassportContext } from 'graphql-passport';
import { GraphQLResolveInfo } from 'graphql';
import { User } from '../models/user.model';
import { Request } from 'express';

export type getLoaderReturn = [MyContextType['loader'], GraphQLResolveInfo];

export function getLoader() {
    return createParamDecorator<MyContextType>(
        ({ context, info }) => [context.loader, info] as getLoaderReturn
    );
}

export function getContext() {
    return createParamDecorator<MyContextType>(({ context }) => context);
}

export function getUser() {
    return createParamDecorator<MyContextType>(({ context }) => context.getUser());
}

export function getInfo() {
    return createParamDecorator<MyContextType>(({ context, info }) => info);
}

export type $FixMe$TS = any;

type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R
    ? R
    : never;
export type MyContextType = PassportContext<User, $FixMe$TS, $FixMe$TS, Request> & {
    loader: GraphQLDatabaseLoader;
    // user?: UserModel
} & ReturnType<typeof buildContext>;

export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
    @ObjectType(`Paginated${TItemClass.name}Response`)
    abstract class PaginatedResponseClass {
        @Field((type) => [TItemClass])
        items: TItem[];

        @Field((type) => Int)
        nextOffset: number;

        @Field((type) => Int)
        total: number;

        @Field()
        hasMore: boolean;
    }

    return PaginatedResponseClass;
}

@InputType()
export class OffsetArg {
    @Field({ nullable: true })
    offset: number;
    @Field({ nullable: true })
    limit: number;
}
