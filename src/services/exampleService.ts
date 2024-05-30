import { Request, Response } from "express";

const example = async (req: Request, res: Response) => {
  // logic code
  res.status(200).send("Success");
};

export { example };
