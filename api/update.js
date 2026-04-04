import { Redis } from 'ioredis';

export default async function handler(req, res) {
    const { id, url } = req.query;

    if (!id || !url) {
        return res.status(400).json({ error: "ID e URL são obrigatórios" });
    }

    // Conecta usando a única variável que você tem disponível
    const redis = new Redis(process.env.TAPPY_REDIS_URL);

    try {
        // Grava no Redis (expira em 0, ou seja, para sempre)
        await redis.set(id, url);
        
        // Fecha a conexão para não gastar recursos
        await redis.quit();

        return res.status(200).json({ status: "success" });
    } catch (error) {
        return res.status(500).json({ error: "Erro no Redis: " + error.message });
    }
}
