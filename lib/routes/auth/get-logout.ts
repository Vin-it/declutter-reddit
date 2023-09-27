import { Request, Response } from "express";

function getLogout(req: Request, res: Response) {
  req.session.destroy();
  res.redirect('/');
}

export default getLogout;
