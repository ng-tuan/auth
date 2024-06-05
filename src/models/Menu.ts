import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './../config/db';

interface MenuAttributes {
  menu_id: number;
  menu_name: string;
  menu_parent: number;
  menu_level: number;
}

interface MenuCreationAttributes
  extends Optional<MenuAttributes, 'menu_id' | 'menu_parent'> {}

class Menu
  extends Model<MenuAttributes, MenuCreationAttributes>
  implements MenuAttributes
{
  public menu_id!: number;
  public menu_name!: string;
  public menu_parent!: number;
  public menu_level!: number;
}

Menu.init(
  {
    menu_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    menu_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    menu_parent: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    menu_level: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Menu',
    tableName: 'menu',
    timestamps: false,
  },
);

export default Menu;
