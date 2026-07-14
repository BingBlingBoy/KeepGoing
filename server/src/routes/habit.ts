import { Router, type Request, type Response } from "express";
import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

export const habitRouter = Router()
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const conn = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
});

habitRouter.get('/user/:id', async (req: Request, res: Response) => {
  try {
    const userID = req.params.id;
    const userHabit = await conn`SELECT * FROM userHabit WHERE user_id = ${userID}`;

    if (userHabit.length === 0) {
      return res.status(404).json({ error: "User has no habits found" });
    }

    return res.status(200).json(userHabit)

  } catch (err) {
    console.error(`Error has occured at the userRouter. ${err}`)
    return res.status(500).json(
      {
        error: "Failed to get user habit",
        reason: `${err}`
      }
    )
  }
})

habitRouter.get('/dates/:id', async (req: Request, res: Response) => {
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
    console.error(`Error has occurred at the habitRouter GET /dates: ${err}`);
    return res.status(500).json({
      error: "Failed to get habit date values",
      reason: `${err}`
    })
  }
})

habitRouter.patch('/', async (req: Request, res: Response) => {
  try {
    const { habitData } = req.body;
    console.log(habitData)

    if (!habitData) {
      return res.status(400).json({ error: "Missing habitData in request body" })
    }

    const {
      habit_id: habitId,
      bucket_date: bucketDate
    } = habitData;

    console.log(`habitId: ${habitId}`)
    console.log(`bucketDate: ${bucketDate}`)

    if (
      !habitId ||
      !bucketDate
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
        1
      )
      ON CONFLICT (habit_id, bucket_date)
      DO UPDATE SET event_count = habit_heatmap_buckets.event_count + 1
    `
    return res.status(200).json({
      success: true
    });

  } catch (err) {
    console.log(`Error has occured at the userRouter. ${err}`)
    return res.status(500).json(
      {
        error: "Failed to update habit count",
        reason: `${err}`
      }
    )
  }
})

habitRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { habitId, userId, ...habitData } = req.body;

    console.log(`habitID: ${habitId}`)
    console.log(`userID: ${userId}`)
    console.log(`habitData: ${habitData}`)

    const {
      title,
      metric,
      average,
      sd,
      total,
      numOfDays,
      colour
    } = habitData;

    if (
      !habitId || !userId || !title || !metric || !colour ||
      typeof average !== 'boolean' ||
      typeof sd !== 'boolean' ||
      typeof total !== 'boolean' ||
      typeof numOfDays !== 'boolean'
    ) {
      return res.status(400).json({ error: "Missing or invalid habit entry data" });
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
        numOfDays,
        colour
      ) VALUES (
        ${habitId},
        ${userId},
        ${title},
        ${metric},
        ${startDate},
        ${average},
        ${sd},
        ${total},
        ${numOfDays},
        ${colour}
      )
    `;

    return res.status(201).json({
      success: true
    });

  } catch (err) {
    console.log(`Error has occured at the userRouter. ${err}`)
    return res.status(500).json(
      {
        error: "Failed to save user habit",
        reason: `${err}`
      }
    )
  }
})
