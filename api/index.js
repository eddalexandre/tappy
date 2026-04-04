import { Redis } from 'ioredis';

export default async function handler(req, res) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const id = urlParams.get('id');

    if (!id) {
        return res.status(400).send("ID da tag nao fornecido.");
    }

    const redis = new Redis(process.env.TAPPY_REDIS_URL);

    try {
        let destination = await redis.get(id);
        await redis.quit();

        if (destination) {
            // AJUSTE MÁGICO: Se o link não começar com http, nós adicionamos!
            if (!destination.startsWith('http')) {
                destination = 'https://' + destination;
            }

            // Agora ele vai redirecionar para FORA do seu site
            return res.redirect(302, destination);
        } else {
            return res.status(404).send("Tag nao configurada no painel Tappy.");
        }
    } catch (error) {
        return res.status(500).send("Erro: " + error.message);
    }
}
