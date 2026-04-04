import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    const { id, url } = req.query;

    if (!id || !url) {
        return res.status(400).json({ error: "ID e URL são obrigatórios" });
    }

    try {
        const kv = createClient({
            url: process.env.TAPPY_REST_API_URL, // Ajustado para TAPPY
            token: process.env.TAPPY_REST_API_TOKEN, // Ajustado para TAPPY
        });

        await kv.set(id, url);
        return res.status(200).json({ status: "success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Falha no banco TAPPY" });
    }
}
