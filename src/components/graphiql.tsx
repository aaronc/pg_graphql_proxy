import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.css';

export const GraphiQLWrapper = () => {
    const fetcher = createGraphiQLFetcher({ url: '/graphql' });
    return <div style={{height:"100vh"}}><GraphiQL fetcher={fetcher} /></div>
}