import { Router } from 'express'
import { createUrl, getUserUrls, deleteUrl } from '../controllers/url.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/', requireAuth, createUrl)
router.get('/', requireAuth, getUserUrls)
router.delete('/:slug', requireAuth, deleteUrl)

export default router