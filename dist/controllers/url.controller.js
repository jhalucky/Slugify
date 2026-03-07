import { prisma, redis } from '../config/db.js';
import { generateSlug } from '../utils/generateSlug.js';
import { randomBytes } from 'node:crypto';
import { addClickJob } from '../queues/analytics.queue.js';
// Create short URL
export const createUrl = async (req, res) => {
    const { original, customSlug, expiresAt } = req.body;
    const user = req.user;
    if (!original) {
        res.status(400).json({ error: 'Original URL is required' });
        return;
    }
    try {
        const slug = customSlug || generateSlug();
        // check if slug already exists in cache or DB
        const cached = await redis.get(`url:${slug}`);
        if (cached) {
            res.status(400).json({ error: 'Slug already taken, try a different one' });
            return;
        }
        const existing = await prisma.url.findUnique({ where: { slug } });
        if (existing) {
            res.status(400).json({ error: 'Slug already taken, try a different one' });
            return;
        }
        const url = await prisma.url.create({
            data: {
                slug,
                original,
                userId: user.id,
                expiresAt: expiresAt ? new Date(expiresAt) : null
            }
        });
        // cache the new URL right away
        await redis.set(`url:${slug}`, url.original, { EX: 86400 });
        res.status(201).json({
            message: 'Short URL created ✅',
            shortUrl: `http://localhost:3000/${url.slug}`,
            slug: url.slug,
            original: url.original,
            expiresAt: url.expiresAt
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
// Redirect to original URL
export const redirectUrl = async (req, res) => {
    const { slug } = req.params;
    // get or generate visitor ID
    let visitorId = req.cookies?.visitorId;
    if (!visitorId) {
        visitorId = randomBytes(16).toString('hex');
        res.cookie('visitorId', visitorId, {
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            httpOnly: true
        });
    }
    try {
        // 1. Check Redis first
        const cached = await redis.get(`url:${slug}`);
        if (cached) {
            console.log('Cache hit ⚡');
            const cachedUrl = typeof cached === 'string' ? cached : cached.toString();
            // fire analytics job async
            addClickJob({
                slug,
                originalUrl: cachedUrl,
                ip: req.ip ?? '',
                userAgent: req.headers['user-agent'] ?? '',
                referer: req.headers['referer'] ?? '',
                visitorId
            });
            res.redirect(cachedUrl);
            return;
        }
        // 2. Cache miss — hit PostgreSQL
        console.log('Cache miss 🐢');
        const url = await prisma.url.findUnique({ where: { slug } });
        if (!url) {
            res.status(404).json({ error: 'URL not found' });
            return;
        }
        if (url.expiresAt && new Date() > url.expiresAt) {
            res.status(410).json({ error: 'This URL has expired' });
            return;
        }
        // 3. Cache it for next time (24 hours)
        await redis.set(`url:${slug}`, url.original, { EX: 86400 });
        // fire analytics job async — on cache miss too!
        addClickJob({
            slug,
            originalUrl: url.original,
            ip: req.ip ?? '',
            userAgent: req.headers['user-agent'] ?? '',
            referer: req.headers['referer'] ?? '',
            visitorId
        });
        res.redirect(url.original);
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
// Get all URLs for a user
export const getUserUrls = async (req, res) => {
    const user = req.user;
    try {
        const urls = await prisma.url.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ urls });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
// Delete a URL
export const deleteUrl = async (req, res) => {
    const { slug } = req.params;
    const user = req.user;
    try {
        const url = await prisma.url.findUnique({ where: { slug } });
        if (!url) {
            res.status(404).json({ error: 'URL not found' });
            return;
        }
        if (url.userId !== user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        // delete from DB and cache both
        await prisma.url.delete({ where: { slug } });
        await redis.del(`url:${slug}`);
        res.json({ message: 'URL deleted ✅' });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
//# sourceMappingURL=url.controller.js.map