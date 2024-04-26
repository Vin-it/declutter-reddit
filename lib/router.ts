import express from 'express';
import authRouter from './routes/auth';

const router = express.Router();

router.use(authRouter);
router.get('*', (req, res) => {
  res.render('index');
});

export default router;
