// models/Info.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db'; // Assuming sequelize is correctly configured

// Define the attributes interface
interface InfoAttributes {
  id: string;
  info_businessName: string;
  info_phoneNumber: string;
  info_address: string;
  info_logo: string;
  info_email: string;
  info_website: string;
}

// Define the creation attributes interface extending optional
interface InfoCreationAttributes extends Optional<InfoAttributes, 'id'> {}

// Define the Info model class extending Model and interfaces
class Info
  extends Model<InfoAttributes, InfoCreationAttributes>
  implements InfoAttributes
{
  public id!: string; // Declare id as part of the class
  public info_businessName!: string;
  public info_phoneNumber!: string;
  public info_address!: string;
  public info_logo!: string;
  public info_email!: string;
  public info_website!: string;
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
    info_businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    info_phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    info_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    info_logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    info_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    info_website: {
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
