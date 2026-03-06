import { Router } from 'express'
import { getUrlAnalytics, getOverviewAnalytics } from '../controllers/analytics.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/overview', requireAuth, getOverviewAnalytics)
router.get('/:slug', requireAuth, getUrlAnalytics)

export default router