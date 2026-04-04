import { Redis } from 'ioredis';

export default async function handler(req, res) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const id = urlParams.get('id');

    if (!id) return res.status(400).send("ID ausente.");

    const redis = new Redis(process.env.TAPPY_REDIS_URL);

    try {
        let destination = await redis.get(id);
        await redis.quit();

        if (destination) {
            // Limpa espaços em branco que podem ter ido sem querer
            destination = destination.trim();

            // FORÇA o link a ser externo
            if (!destination.startsWith('http')) {
                destination = 'https://' + destination;
            }

            // O segredo está aqui: o 301 ou 302 com o link completo
            // avisa o navegador para SAIR do seu domínio atual.
            res.writeHead(302, { Location: destination });
            return res.end();
        } else {
            return res.status(404).send("Tag nao encontrada.");
        }
    } catch (error) {
        return res.status(500).send("Erro: " + error.message);
    }
}
