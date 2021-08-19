import {
    ApolloClient,
    ApolloLink,
    createHttpLink,
    DefaultOptions,
    from,
    InMemoryCache,
} from '@apollo/client';

// import { uncrunch } from 'graphql-crunch';
// import { userstore } from '~models/Userstore';
import { API_URL } from './constants';
//@ts-ignore
import omitDeep from 'omit-deep';

const cleanTypeName = new ApolloLink((operation, forward) => {
    if (operation.variables) {
        operation.variables = omitDeep(operation.variables, ['__typename', 'tableData']);
    }
    return forward(operation).map((data) => {
        return data;
    });
});

export function prueba() {
    return 'Hello WOrld';
}

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
};
const httpLink = createHttpLink({
    uri: (operation) => {
        return `${API_URL}graphql?crunch=1`;
    },
    credentials: 'same-origin',
});
console.log('enters 3', API_URL);

//
// const authLink = setContext((req, { headers }) => {
//     // get the authentication token from local storage if it exists
//     const token = userstore.userToken;
//     // return the headers to the context so httpLink can read them
//     return {
//         headers: {
//             ...headers,
//             authorization: token ? `Bearer ${token}` : '',
//         },
//     };
// });
//
// const uncruncher = new ApolloLink((operation, forward) =>
//     forward(operation).map((response) => {
//         response.data = uncrunch(response.data);
//         return response;
//     })
// );

// const logoutLink = onError(({ networkError, response }) => {
//     if ((networkError as ServerError).statusCode === 401) userstore.userToken = '';
// });
export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([
        cleanTypeName,
        // logoutLink,
        // uncruncher, authLink,
        httpLink,
    ]),
    defaultOptions: defaultOptions,
});
