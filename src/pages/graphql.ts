import pg from 'pg'
import type {APIRoute} from "astro";

const {Client} = pg
const client = new Client({
    connectionString: import.meta.env.DATABASE_URL,
})
await client.connect()


export const GET: APIRoute = async ({params, request}) => {
    const {query, variables, operationName} = params;

    return graphql(query, variables, operationName);
}

export const POST: APIRoute = async ({params, request}) => {
    const {query, operationName, variables} = await request.json();
    return graphql(query, variables, operationName);
}

async function graphql(query?: string, variables?: string, operationName?: string) {
    try {
        const res = await client.query(
            'select graphql.resolve($1, $2, $3);',
            [query, variables, operationName]
        );

        return new Response(
            JSON.stringify(res.rows[0].resolve),
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
    } catch (e) {
        return new Response(
            JSON.stringify({errors: [e]}),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
    }
}
