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

habitRouter.get('/', async (req: Request, res: Response) => {
  try {
    console.log(PGDATABASE)
    console.log(PGHOST)
    const users = await conn`SELECT * FROM userhabit`;
    console.log(users)

  } catch (err) {
    console.log(`${err}`)
  }
})

habitRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, ...habitData } = req.body;

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
      !userId || !title || !metric || !startDate || !colour ||
      typeof average !== 'boolean' ||
      typeof sd !== 'boolean' ||
      typeof total !== 'boolean' ||
      typeof numOfDays !== 'boolean'
    ) {
      return res.status(400).json({ error: "Missing or invalid habit entry data" });
    }

    await conn`
      INSERT INTO userHabit (
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
