import { PassportContext } from 'graphql-passport';
import { Request } from 'express';
import { GraphQLDatabaseLoader } from '@mando75/typeorm-graphql-loader';
import { User } from '../models/user.model';
type AnyType = any;
export type MyContextType = PassportContext<User, AnyType, AnyType, Request> & {
    loader: GraphQLDatabaseLoader;
};
