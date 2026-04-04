import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    const { id, url } = req.query;

    const kv = createClient({
        url: process.env.KV_TAPPY_REST_API_URL,
        token: process.env.KV_TAPPY_REST_API_TOKEN,
    });

    await kv.set(id, url);
    return res.status(200).json({ status: "success" });
}
