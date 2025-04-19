// models/Info.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db'; // Assuming sequelize is correctly configured

// Define the attributes interface
interface InfoAttributes {
  id: string;
  business_name: string;
  phone_number: string;
  address: string;
  logo: string;
  email: string;
  website: string;
}

// Define the creation attributes interface extending optional
interface InfoCreationAttributes extends Optional<InfoAttributes, 'id'> {}

// Define the Info model class extending Model and interfaces
class Info
  extends Model<InfoAttributes, InfoCreationAttributes>
  implements InfoAttributes
{
  public id!: string; // Declare id as part of the class
  public business_name!: string;
  public phone_number!: string;
  public address!: string;
  public logo!: string;
  public email!: string;
  public website!: string;
}

// Initialize the Info model with sequelize
Info.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Info', // Model name as per Sequelize convention
    tableName: 'info', // Table name in your database
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
  },
);

export default Info;
