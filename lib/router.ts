import express from 'express';
import authRouter from './routes/auth';

const mainRouter = express.Router();

mainRouter.use(authRouter);
mainRouter.get('*', (req, res) => {
  res.render('index');
});

export { mainRouter };
