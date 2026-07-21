import postgres from 'postgres'
import dotenv from 'dotenv'
import { Router, type Request, type Response } from 'express'

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

settingsRouter.patch('/', async (req: Request, res: Response) => {
  try {
    const { userId, newUsername } = req.body;

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
    console.log(`Error has occured at the settingsRouter: ${err}`)
    return res.status(500).json({
      error: "Failed to input error data",
      reason: `${err}`
    })
  }
})

settingsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    console.log(`userId: ${userId}`)

    if (!userId) {
      return res.status(400).json({ error: "Missing userData in request body" })
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
    console.log(`Error has occured at the settingsRouter: ${err}`)
    return res.status(500).json({
      error: "Failed to input error data",
      reason: `${err}`
    })

  }
})
