import { createParamDecorator, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Item } from '@/models/item.model';
import { MyContextType } from '@/types/MyContext.type';
import { GraphQLResolveInfo } from 'graphql';
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
@Resolver((of) => Item)
@Service()
export class RecipeResolver {
    constructor(
        @InjectRepository(Item) private readonly items: Repository<typeof Item>
    ) {}

    @Query((returns) => [Item])
    recipes(): Promise<typeof Item[]> {
        return this.items.find();
    }
}
