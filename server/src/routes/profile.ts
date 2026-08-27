import { NextFunction, Router, type Request, type Response } from 'express'
import { conn } from '../db';
import { requireAuth } from '../middleware/authMiddleware';
import winstonLogger from '../logger/winstonLogger';

export const profileRouter = Router()

profileRouter.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
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
    next(err)
  }
})

profileRouter.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    winstonLogger.info("HELLO")

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID in request parameters" })
    }

    const userExists = await conn`SELECT 1 FROM userHabit WHERE user_id = ${userId}`
    if (!userExists) {
      return res.status(404).json({ error: "User ID not found" })
    }

    const profileData = await conn`SELECT * FROM user_metrics WHERE user_id = ${userId}`
    winstonLogger.info(profileData)

    return res.status(200).json(profileData);
  } catch (err) {
    next(err)
  }
})
