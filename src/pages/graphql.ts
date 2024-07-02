import { neon } from '@neondatabase/serverless';
import type {APIRoute} from "astro";

const sql = neon(import.meta.env.DATABASE_URL);

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
        const [res] = await sql`select graphql.resolve(${query}, ${variables}, ${operationName});`;

        return new Response(
            JSON.stringify(res.resolve),
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
