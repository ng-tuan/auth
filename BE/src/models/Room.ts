import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';

interface RoomAttributes {
  id: string;
  name: string;
  type: 'public' | 'private';
  createdBy: string;
  members: string[];
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

type RoomCreationAttributes = Optional<
  RoomAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'members' | 'lastActivity'
>;

export class Room extends Model<RoomAttributes, RoomCreationAttributes> {
  declare id: string;
  declare name: string;
  declare type: 'public' | 'private';
  declare createdBy: string;
  declare members: string[];
  declare lastActivity: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('public', 'private'),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    members: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: '[]',
      get() {
        const rawValue = this.getDataValue('members') as unknown as string;
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: string[]) {
        this.setDataValue(
          'members',
          JSON.stringify(value || []) as unknown as string[],
        );
      },
    },
    lastActivity: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'rooms',
    timestamps: true,
  },
);

export type RoomInput = RoomCreationAttributes;
