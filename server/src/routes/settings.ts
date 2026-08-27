import { NextFunction, Router, type Request, type Response } from 'express'
import { conn } from '../db';
import { requireAuth } from '../middleware/authMiddleware';

export const settingsRouter = Router()

settingsRouter.patch('/:id/username', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const { newUsername } = req.body;

    if (!userId || !newUsername) {
      return res.status(400).json({ error: "Missing userData in request body" })
    }

    const updatedUser = await conn`
      UPDATE neon_auth."user"
      SET name = ${newUsername}
      WHERE id = ${userId}
      RETURNING id, name
    `
    if (updatedUser.length === 0) {
      return res.status(400).json({ error: "User ID not found" })
    }

    return res.status(200).json({
      success: true
    })

  } catch (err) {
    next(err)
  }
})

settingsRouter.patch('/:id/display', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const { newDisplayPref } = req.body;

    if (newDisplayPref === undefined) {
      return res.status(400).json({ error: "Missing userData in request body" })
    }

    const updatedDisplayPref = await conn`
      UPDATE user_metrics
      SET light_mode = ${newDisplayPref}
      WHERE user_id = ${userId}
      RETURNING user_id, light_mode
    `

    if (updatedDisplayPref.length === 0) {
      return res.status(400).json({ error: "User ID not found" })
    }

    return res.status(200).json({
      success: true,
      newDisplayPref
    })
  } catch (err) {
    next(err)
  }
})

settingsRouter.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id

    if (!userId) {
      return res.status(400).json({ error: "Missing userData in request url" })
    }

    const deletedUser = await conn`
      DELETE FROM neon_auth."user"
      WHERE id = ${userId}
      RETURNING id
    `

    if (deletedUser.length === 0) {
      return res.status(400).json({ error: "User not found" })
    }

    return res.status(200).json({
      success: true
    })
  } catch (err) {
    next(err)
  }
})
