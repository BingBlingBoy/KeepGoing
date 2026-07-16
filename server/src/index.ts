import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { habitRouter } from './routes/habit'
import { profileRouter } from './routes/profile'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/api/habit', habitRouter);
app.use('/api/profile', profileRouter)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})
