import { NextFunction, Router, type Request, type Response } from "express";
import { conn } from "../db";
import { requireAuth } from "../middleware/authMiddleware";
import winstonLogger from "../logger/winstonLogger";

export const habitRouter = Router()

habitRouter.get('/user/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.params.id;
    const userHabit = await conn`SELECT * FROM userHabit WHERE user_id = ${userID}`;

    if (userHabit.length === 0) {
      return res.status(404).json({ error: "User has no habits found" });
    }

    return res.status(200).json(userHabit)

  } catch (err) {
    next(err)
  }
})

habitRouter.get('/dates/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const habitID = req.params.id

    if (!habitID) {
      return res.status(400).json({ error: "Missing habit ID in request parameters" })
    }

    const habitExists = await conn`SELECT 1 FROM userHabit WHERE habit_id = ${habitID}`
    if (habitExists.length === 0) {
      return res.status(404).json({ error: "Habit ID does not exist" });
    }

    const habitDates = await conn`SELECT * FROM habit_heatmap_buckets WHERE habit_id = ${habitID}`

    return res.status(200).json(habitDates);

  } catch (err) {
    next(err)
  }
})

habitRouter.patch('/dates', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { habitData } = req.body;

    if (!habitData) {
      return res.status(400).json({ error: "Missing habitData in request body" })
    }

    const {
      habit_id: habitId,
      bucket_date: bucketDate,
      event_count: eventCount
    } = habitData;

    if (
      !habitId ||
      !bucketDate ||
      !eventCount
    ) {
      return res.status(400).json({ error: "Missing or invalid habit entry data" });
    }

    const habitCheck = await conn`SELECT 1 FROM userHabit WHERE habit_id = ${habitId} LIMIT 1`

    if (habitCheck.length === 0) {
      return res.status(404).json({ error: "Habit not found" })
    }

    await conn`
      INSERT INTO habit_heatmap_buckets (
        habit_id,
        bucket_date,
        event_count
      ) VALUES (
        ${habitId},
        ${bucketDate},
        ${eventCount}
      )
    `
    return res.status(200).json({
      success: true
    });

  } catch (err) {
    next(err)
  }
})

habitRouter.patch('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ...body } = req.body
    const userId = req.user.id;

    const {
      habit_id,
      title,
      metric,
      average,
      sd,
      total,
      numofdays,
      colour
    } = body.habitData

    if (
      !habit_id || !userId || !title || !metric || !colour ||
      typeof average !== 'boolean' ||
      typeof sd !== 'boolean' ||
      typeof total !== 'boolean' ||
      typeof numofdays !== 'boolean'
    ) {
      return res.status(400).json({ error: "Missing or invalid habit body data" });
    }

    const result = await conn`
      UPDATE userhabit
      SET
        title = ${title},
        metric = ${metric},
        average = ${average},
        sd = ${sd},
        total = ${total},
        numofdays = ${numofdays},
        colour = ${colour}
      WHERE user_id = ${userId} AND habit_id = ${habit_id}
    `
    if (result.count === 0) {
      return res.status(404).json({ error: "Habit not found or unauthorized to edit" });
    }
    return res.status(200).json({
      success: true
    });

  } catch (err) {
    next(err)
  }
})

habitRouter.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { habitId, userId, ...habitData } = req.body;
    winstonLogger.info(req.body)

    const {
      title,
      metric,
      average,
      sd,
      total,
      numofdays,
      colour,
      habit_type
    } = habitData;

    if (
      !habitId || !userId || !title || (habit_type === 'numbered' && !metric) || !colour || !habit_type ||
      typeof average !== 'boolean' ||
      typeof sd !== 'boolean' ||
      typeof total !== 'boolean' ||
      typeof numofdays !== 'boolean'
    ) {
      return res.status(400).json({ error: "Missing or invalid habit body data" });
    }

    const currDate = new Date()
    const year = currDate.getFullYear();
    const month = String(currDate.getMonth() + 1).padStart(2, '0');
    const day = String(currDate.getDate()).padStart(2, '0');

    const startDate = `${year}/${month}/${day}`;

    await conn`
      INSERT INTO userHabit (
        habit_id,
        user_id,
        title,
        metric,
        startDate,
        average,
        sd,
        total,
        numofdays,
        colour,
        habit_type
      ) VALUES (
        ${habitId},
        ${userId},
        ${title},
        ${metric},
        ${startDate},
        ${average},
        ${sd},
        ${total},
        ${numofdays},
        ${colour},
        ${habit_type}
      )
    `;

    return res.status(201).json({
      success: true
    });

  } catch (err) {
    next(err)
  }
})

habitRouter.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const habitId = req.params.id
    const { userId } = req.body

    if (!habitId) {
      return res.status(400).json({ error: "Missing or invlid habit id" })
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    await conn.begin(async (sql) => {
      await sql`
        DELETE FROM habit_heatmap_buckets
        WHERE habit_id = ${habitId}
      `

      const result = await sql`
        DELETE FROM userhabit
        WHERE habit_id = ${habitId} AND user_id = ${userId}
      `

      if (result.count === 0) {
        throw new Error('NOT_FOUND')
      }
    })
    return res.status(200).json({
      success: true
    })
  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ error: "Habit not found or you don't have permission to delete it" });
    }
    next(err)
  }
})
