import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Item } from '../models/item.model';

@Resolver((of) => Item)
@Service()
export class RecipeResolver {
    constructor(
        @InjectRepository(Item) private readonly items: Repository<typeof Item>
    ) {}

    @Query((returns) => [Item], { nullable: true })
    recipes(): Promise<typeof Item[]> {
        return this.items.find();
    }
}
