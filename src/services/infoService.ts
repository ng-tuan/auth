// services/infoService.ts
import { Request, Response } from 'express';
import { StatusCode } from '../enum/AppConst';
import Info from '../models/Info'; // Import Info and InfoAttributes

const getInfo = async (req: Request, res: Response) => {
  try {
    const info = await Info.findOne(); // Assuming you only have one set of info in the database

    if (!info) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Information not found in database' });
    }

    res.status(StatusCode.SUCCESS).json({ data: info });
  } catch (error) {
    console.error('Error fetching info:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Internal server error' });
  }
};

const newInfo = async (req: Request, res: Response) => {
  const { business_name, phone_number, address, logo, email, website } =
    req.body;

  try {
    const info = await Info.create({
      business_name,
      phone_number,
      address,
      logo,
      email,
      website,
    });

    res.status(StatusCode.CREATED_SUCCESS).json({ data: info });
  } catch (error) {
    console.error('Error creating info:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to create information' });
  }
};

const editInfo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { business_name, phone_number, address, logo, email, website } =
    req.body;

  try {
    const info = await Info.findByPk(id);
    if (!info) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Information not found' });
    }

    // Update only the provided fields
    if (business_name !== undefined) info.business_name = business_name;
    if (phone_number !== undefined) info.phone_number = phone_number;
    if (address !== undefined) info.address = address;
    if (logo !== undefined) info.logo = logo;
    if (email !== undefined) info.email = email;
    if (website !== undefined) info.website = website;

    await info.save();

    res.status(StatusCode.SUCCESS).json({ data: info });
  } catch (error) {
    console.error('Error updating info:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to update information' });
  }
};

const deleteInfo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCount = await Info.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Information not found' });
    }

    res
      .status(StatusCode.SUCCESS)
      .json({ message: 'Information deleted successfully' });
  } catch (error) {
    console.error('Error deleting info:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to delete information' });
  }
};

export { deleteInfo, editInfo, getInfo, newInfo };
