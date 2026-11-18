import app from './app.js'
import connectToDB from "./database/mongodb.js";
import {smtpService} from "./services/mail/smtp.service.js";
import { PORT } from "./config/env.js";
import logger from "./config/logger.js";

app.listen(PORT, async () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  try {
    await connectToDB()
    await smtpService.connect()
    logger.info('Database and SMTP service connected successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
})
