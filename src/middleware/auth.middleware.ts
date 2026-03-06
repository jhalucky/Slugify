import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/db.js'

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string

  if (!apiKey) {
    res.status(401).json({ error: 'API key required' })
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { apiKey } })
    if (!user) {
      res.status(401).json({ error: 'Invalid API key' })
      return
    }

    // attach user to request
    (req as any).user = user
    next()
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}