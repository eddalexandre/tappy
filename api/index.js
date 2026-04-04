import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.redirect('https://seusite.com'); 
    }

    try {
        const kv = createClient({
            url: process.env.TAPPY_REST_API_URL, // Ajustado para TAPPY
            token: process.env.TAPPY_REST_API_TOKEN, // Ajustado para TAPPY
        });

        const destination = await kv.get(id);

        if (destination) {
            return res.redirect(302, destination);
        } else {
            return res.status(404).send("ID não encontrado no sistema Tappy.");
        }
    } catch (error) {
        return res.status(500).send("Erro de conexão com Tappy.");
    }
}
