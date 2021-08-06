import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../models/user.model';

define(User, (faker: typeof Faker) => {
    const gender = faker.random.number(1);
    const name = faker.name.firstName(gender);

    const user = new User();
    user.password = faker.internet.password();
    user.username = faker.name.firstName(gender);
    return user;
});
