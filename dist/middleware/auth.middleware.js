import { prisma } from '../config/db.js';
export const requireAuth = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        res.status(401).json({ error: 'API key required' });
        return;
    }
    try {
        const user = await prisma.user.findUnique({ where: { apiKey } });
        if (!user) {
            res.status(401).json({ error: 'Invalid API key' });
            return;
        }
        // attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
//# sourceMappingURL=auth.middleware.js.map