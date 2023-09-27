import express from 'express';
import authRouter from './routes/auth';

const router = express.Router();

router.use(authRouter);

export default router;
