import postgres from 'postgres'
import dotenv from 'dotenv'
import { NextFunction, Router, type Request, type Response } from 'express'
import winstonLogger from '../logger/winstonLogger'

dotenv.config()

export const settingsRouter = Router()
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const conn = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
});

settingsRouter.patch('/:id/username', async (req: Request, res: Response, next: NextFunction) => {
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

settingsRouter.patch('/:id/display', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const { newDisplayPref } = req.body;

    console.log('newDiplayPref: ', newDisplayPref)

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
      success: true
    })
  } catch (err) {
    next(err)
  }
})

settingsRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
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
