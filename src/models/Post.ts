// Post.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';
import User from './User';
import Category from './Category';

interface PostAttributes {
  id: number;
  author_id: string;
  title: string;
  excerpt: string | null;
  content: string;
  status: 'publish' | 'draft';
  slug: string;
  category_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public author_id!: string;
  public title!: string;
  public excerpt!: string;
  public content!: string;
  public status!: 'publish' | 'draft';
  public slug!: string;
  public category_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: {
    User: typeof User;
    Category: typeof Category;
  }) {
    Post.belongsTo(models.User, { foreignKey: 'author_id', as: 'author' });
    Post.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    author_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('publish', 'draft'),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
  },
);

export default Post;
