import { Redis } from 'ioredis';

export default async function handler(req, res) {
    // 1. Pega o ID da tag (ex: b01) que vem na URL
    const { id } = req.query;

    // 2. Se a pessoa acessar sem ID, manda para o seu site principal
    if (!id) {
        return res.redirect('https://tappy.com.br'); 
    }

    // 3. Conecta no banco de dados usando a chave TAPPY_REDIS_URL
    const redis = new Redis(process.env.TAPPY_REDIS_URL);

    try {
        // 4. Pergunta ao banco: "Qual o link desse ID?"
        const destination = await redis.get(id);

        // 5. Fecha a conexão com o banco para não ficar gastando
        await redis.quit();

        // 6. Se o link existir, pula para ele. Se não, avisa que não achou.
        if (destination) {
            return res.redirect(302, destination);
        } else {
            return res.status(404).send("Tag não configurada no painel Tappy.");
        }
        
    } catch (error) {
        return res.status(500).send("Erro de conexão: " + error.message);
    }
}
