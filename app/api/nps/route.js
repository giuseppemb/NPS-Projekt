import pkg from "pg";
const { Client } = pkg;

export async function POST(req) {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();

        const { deal, contact, question, answer, dealname } = await req.json();

        if (!deal || !contact || answer === undefined) {
            await client.end();
            return Response.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingVote = await client.query(
            `SELECT id FROM nps_responses
             WHERE deal_id = $1 AND contact_id = $2`,
            [deal, contact]
        );

        if (existingVote.rows.length > 0) {
            await client.end();
            return Response.json({
                success: false,
                alreadyAnswered: true,
                message: "Customer already voted",
            });
        }

        await client.query(
            `INSERT INTO nps_responses (deal_id, contact_id, question_id, answer, deal_name)
             VALUES ($1, $2, $3, $4, $5)`,
            [deal, contact, question, answer, dealname]
        );

        await client.end();
        return Response.json({
            success: true,
            alreadyAnswered: false,
            message: "Vote saved",
        });

    } catch (error) {
        console.error(error);
        await client.end();
        return Response.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}