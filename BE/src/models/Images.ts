import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface ImageAttributes {
  image_id: string;
  image_name: string;
  path: string;
  user_create: string;
  created_date: Date;
}

export interface ImageCreationAttributes
  extends Optional<
    ImageAttributes,
    'image_id' | 'created_date' | 'user_create'
  > {}

class Image
  extends Model<ImageAttributes, ImageCreationAttributes>
  implements ImageAttributes
{
  public image_id!: string;
  public image_name!: string;
  public path!: string;
  public user_create!: string;
  public created_date!: Date;
}

Image.init(
  {
    image_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    image_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_create: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Image',
    tableName: 'images',
    timestamps: false,
  },
);

export default Image;
