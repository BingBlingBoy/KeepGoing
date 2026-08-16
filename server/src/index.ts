import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { habitRouter } from './routes/habit'
import { profileRouter } from './routes/profile'
import { settingsRouter } from './routes/settings'
import { logger } from './logger/logging'
import winstonLogger from './logger/winstonLogger'
import errorHandler from './middleware/errorMiddleware'

dotenv.config()

export const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(logger)

app.use('/api/habit', habitRouter);
app.use('/api/profile', profileRouter)
app.use('/api/settings', settingsRouter)

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    winstonLogger.info(`Server started on port ${PORT}`);
  })
}
