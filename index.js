import { createClient } from 'TAPPY_REDIS_URL'; // Ou a biblioteca do Redis que a Vercel sugerir

export default async function handler(req, res) {
    const { id } = req.query; // Pega o ?id=b01
    
    if (!id) {
        return res.redirect('https://seusite.com'); // Se não tiver ID, vai para sua home
    }

    try {
        const kv = createClient({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN,
        });

        const destination = await kv.get(id);

        if (destination) {
            return res.redirect(302, destination);
        } else {
            return res.redirect('https://seusite.com/404'); // Link não encontrado
        }
    } catch (error) {
        return res.status(500).send("Erro no servidor");
    }
}
