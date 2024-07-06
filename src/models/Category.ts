// models/Category.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface CategoryAttributes {
  id: number;
  category_name: string;
  slug: string;
  parentId: number | null;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id'> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public category_name!: string;
  public slug!: string;
  public parentId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
  },
);

Category.hasMany(Category, {
  as: 'children',
  foreignKey: 'parentId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Category.belongsTo(Category, {
  as: 'parent',
  foreignKey: 'parentId',
});

export default Category;
