import { Request, Response } from 'express';
import { StatusCode } from '../enum/AppConst';
import Menu from '../models/Menu';

const getMenu = async (req: Request, res: Response) => {
  try {
    const menu: Menu[] = await Menu.findAll();
    if (menu.length === 0 || !menu) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Menu not found in database' });
    }

    res.status(StatusCode.SUCCESS).json({ data: menu });
  } catch (error) {
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Internal server error' });
  }
};

export { getMenu };
