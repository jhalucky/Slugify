import { Request, Response } from 'express'
import { prisma } from '../config/db.js'
import { generateSlug } from '../utils/generateSlug.js'

// Create short URL
export const createUrl = async (req: Request, res: Response) => {
  const { original, customSlug, expiresAt } = req.body
  const user = (req as any).user

  if (!original) {
    res.status(400).json({ error: 'Original URL is required' })
    return
  }

  try {
    const slug = customSlug || generateSlug()

    // check if slug already exists
    const existing = await prisma.url.findUnique({ where: { slug } })
    if (existing) {
      res.status(400).json({ error: 'Slug already taken, try a different one' })
      return
    }

    const url = await prisma.url.create({
      data: {
        slug,
        original,
        userId: user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    })

    res.status(201).json({
      message: 'Short URL created ✅',
      shortUrl: `http://localhost:3000/${url.slug}`,
      slug: url.slug,
      original: url.original,
      expiresAt: url.expiresAt
    })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// Redirect to original URL
export const redirectUrl = async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string }

  try {
    const url = await prisma.url.findUnique({ where: { slug } })

    if (!url) {
      res.status(404).json({ error: 'URL not found' })
      return
    }

    // check expiry
    if (url.expiresAt && new Date() > url.expiresAt) {
      res.status(410).json({ error: 'This URL has expired' })
      return
    }

    res.redirect(url.original)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// Get all URLs for a user
export const getUserUrls = async (req: Request, res: Response) => {
  const user = (req as any).user

  try {
    const urls = await prisma.url.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ urls })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// Delete a URL
export const deleteUrl = async (req: Request, res: Response) => {
  const { slug } = req.params
  const user = (req as any).user

  try {
    const url = await prisma.url.findUnique({ where: { slug: slug as string } })

    if (!url) {
      res.status(404).json({ error: 'URL not found' })
      return
    }

    // make sure user owns this URL
    if (url.userId !== user.id) {
      res.status(403).json({ error: 'Not authorized' })
      return
    }

    await prisma.url.delete({ where: { slug: slug as string
     } })
    res.json({ message: 'URL deleted ✅' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}