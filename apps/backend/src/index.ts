import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRouter } from './routes/auth.routes';
import { projectRouter } from './routes/project.routes';
import { purchaseRouter } from './routes/purchase.routes';
import { reviewRouter } from './routes/review.routes';
import { requestRouter } from './routes/request.routes';
import { adminRouter } from './routes/admin.routes';
import { messageRouter } from './routes/message.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/purchases', purchaseRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/requests', requestRouter);
app.use('/api/admin', adminRouter);
app.use('/api/messages', messageRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
