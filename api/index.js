import { Redis } from 'ioredis';

export default async function handler(req, res) {
    // Usando a nova forma de ler a URL (WHATWG URL API)
    const url = new URL(req.url, `https://${req.headers.host}`);
    const id = url.searchParams.get('id');

    if (!id) {
        return res.status(400).send("ID da tag nao fornecido.");
    }

    const redis = new Redis(process.env.TAPPY_REDIS_URL);

    try {
        const destination = await redis.get(id);
        await redis.quit();

        if (destination) {
            return res.redirect(302, destination);
        } else {
            return res.status(404).send("Tag nao configurada no painel Tappy.");
        }
    } catch (error) {
        return res.status(500).send("Erro: " + error.message);
    }
}
