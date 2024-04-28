import express from 'express';
import authRouter from './routes/auth';
import { redditRouter } from './routes/reddit/reddit.router';

const mainRouter = express.Router();

mainRouter.use(authRouter);
mainRouter.use(redditRouter);
mainRouter.get('*', (req, res) => {
  res.render('index');
});

export { mainRouter };
