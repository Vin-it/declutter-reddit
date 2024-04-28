import { Request, Response } from 'express';
import express from 'express';
import { isInSession } from '../../middleware/user';
import { getSavedLinks } from './get-saved-links';

const redditRouter = express.Router();

redditRouter.use(express.urlencoded({ extended: true }));
redditRouter.use(express.json());

redditRouter.get('/saved', isInSession, getSavedLinks);

export { redditRouter };
