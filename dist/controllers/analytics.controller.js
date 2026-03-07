import { prisma } from '../config/db.js';
import Click from '../models/Click.js';
// Get analytics for a specific slug
export const getUrlAnalytics = async (req, res) => {
    const { slug } = req.params;
    const user = req.user;
    try {
        // make sure the URL belongs to this user
        const url = await prisma.url.findUnique({ where: { slug } });
        if (!url) {
            res.status(404).json({ error: 'URL not found' });
            return;
        }
        if (url.userId !== user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        // total clicks
        const totalClicks = await Click.countDocuments({ slug });
        // clicks over last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const clicksOverTime = await Click.aggregate([
            {
                $match: {
                    slug,
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        // top browsers/devices from userAgent
        const topUserAgents = await Click.aggregate([
            { $match: { slug } },
            {
                $group: {
                    _id: '$userAgent',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        // top referers
        const topReferers = await Click.aggregate([
            { $match: { slug } },
            {
                $group: {
                    _id: '$referer',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        res.json({
            slug,
            originalUrl: url.original,
            totalClicks,
            clicksOverTime,
            topUserAgents,
            topReferers
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
// Get overview analytics for all user URLs
export const getOverviewAnalytics = async (req, res) => {
    const user = req.user;
    try {
        // get all slugs for this user
        const urls = await prisma.url.findMany({
            where: { userId: user.id },
            select: { slug: true, original: true, createdAt: true }
        });
        const slugs = urls.map((u) => u.slug);
        // total clicks across all URLs
        const totalClicks = await Click.countDocuments({ slug: { $in: slugs } });
        // clicks per slug
        const clicksPerSlug = await Click.aggregate([
            { $match: { slug: { $in: slugs } } },
            {
                $group: {
                    _id: '$slug',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.json({
            totalUrls: urls.length,
            totalClicks,
            clicksPerSlug,
            urls
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
//# sourceMappingURL=analytics.controller.js.map