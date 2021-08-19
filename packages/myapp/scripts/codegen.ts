import { run } from 'apollo';

(async () => {
    await run(
        'service:download --endpoint=http://localhost:3000/graphql schema.json'.split(' ')
    );
    await run(
        'codegen:generate --localSchemaFile=schema.json --target=typescript --tagName=gql'.split(
            ' '
        )
    );
})();
