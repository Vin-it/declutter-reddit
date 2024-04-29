import { Request, Response } from 'express';
import { fetchSavedLinks } from '../../services/reddit';

export const getSavedLinks = async (req: Request, res: Response) => {
  if (!res.locals.isInSession || !req.session.user) {
    res.status(401).send();
  } else {
    const { after, before } = req.query;
    if (
      (after && typeof after !== 'string') ||
      (before && typeof before !== 'string')
    )
      return;
    const user = req.session.user;
    const response = await fetchSavedLinks(
      user.accessToken,
      user.username,
      after,
      before,
    );
    res.status(200).json(response.data);
  }
};
