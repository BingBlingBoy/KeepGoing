import postgres from 'postgres'
import dotenv from 'dotenv'
import { Router, type Request, type Response } from 'express'

dotenv.config()

export const profileRouter = Router()
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const conn = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
});

profileRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing profileData in request body" })
    }

    await conn`
      INSERT INTO user_metrics (
        user_id,
        login_count,
        last_login_at
      ) VALUES (
        ${userId},
        1,
        NOW()
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        login_count = user_metrics.login_count + 1,
        last_login_at = NOW(),
        updated_at = NOW();
    ;`

    return res.status(201).json({
      success: true
    })

  } catch (err) {
    console.error(`Error has occured at the profileRouter. ${err}`)
    return res.status(500).json(
      {
        error: "Failed to input error data",
        reason: `${err}`
      }
    )
  }
})

profileRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID in request parameters" })
    }

    const userExists = await conn`SELECT 1 FROM userHabit WHERE user_id = ${userId}`
    if (!userExists) {
      return res.status(404).json({ error: "User ID not found" })
    }

    const profileData = await conn`SELECT * FROM user_metrics WHERE user_id = ${userId}`

    return res.status(200).json(profileData);
  } catch (err) {
    console.error(`Error has occured at the profileRouter: ${err}`)
    return res.status(500).json(
      {
        error: "Failed to get the profile data",
        reason: `${err}`
      }
    )
  }
})
