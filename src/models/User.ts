import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface UserAttributes {
  user_id: string;
  user_name: string;
  password: string;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
  failed_login_attempts: number;
  account_locked: boolean;
  account_locked_until?: Date;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'user_id'
    | 'created_at'
    | 'updated_at'
    | 'failed_login_attempts'
    | 'account_locked'
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public user_id!: string;
  public user_name!: string;
  public password!: string;
  public last_login?: Date;
  public created_at!: Date;
  public updated_at!: Date;
  public failed_login_attempts!: number;
  public account_locked!: boolean;
  public account_locked_until?: Date;

  // Helper method to increment failed login attempts
  public async incrementFailedLogins(): Promise<void> {
    this.failed_login_attempts += 1;

    // Lock account after 5 failed attempts
    if (this.failed_login_attempts >= 5) {
      this.account_locked = true;
      // Lock for 30 minutes
      this.account_locked_until = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.save();
  }

  // Helper method to reset failed login attempts
  public async resetFailedLogins(): Promise<void> {
    this.failed_login_attempts = 0;
    this.account_locked = false;
    this.account_locked_until = undefined;
    this.last_login = new Date();
    await this.save();
  }

  // Helper method to check if account is locked
  public isAccountLocked(): boolean {
    if (!this.account_locked) return false;

    // If lock time has expired, account is no longer locked
    if (this.account_locked_until && this.account_locked_until < new Date()) {
      return false;
    }

    return this.account_locked;
  }
}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    failed_login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    account_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    account_locked_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: (user: User) => {
        user.updated_at = new Date();
      },
    },
  },
);

export default User;
