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

habitRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const userID = req.params.id;
    const userHabit = await conn`SELECT * FROM userhabit WHERE user_id = ${userID}`;

    if (userHabit.length === 0) {
      return res.status(404).json({ error: "User has no habits found" });
    }

    return res.status(200).json(userHabit)

  } catch (err) {
    console.log(`Error has occured at the userRouter. ${err}`)
    return res.status(500).json(
      {
        error: "Failed to get user habit",
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
      startDate,
      average,
      sd,
      total,
      numOfDays,
      colour
    } = habitData;

    if (
      !habitId || !userId || !title || !metric || !startDate || !colour ||
      typeof average !== 'boolean' ||
      typeof sd !== 'boolean' ||
      typeof total !== 'boolean' ||
      typeof numOfDays !== 'boolean'
    ) {
      return res.status(400).json({ error: "Missing or invalid habit entry data" });
    }

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

    res.status(201).json({
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
