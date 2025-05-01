import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export class Message extends Model {
  public id!: string;
  public roomId!: string;
  public senderId!: string;
  public content!: string;
  public type!: 'text' | 'image' | 'file';
  public status!: 'sent' | 'delivered' | 'read';
  public metadata?: {
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
  };
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('text', 'image', 'file'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read'),
      defaultValue: 'sent',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
  },
);

export interface MessageInput {
  roomId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  metadata?: {
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
  };
}
