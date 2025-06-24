import { DataTypes, Model, Optional } from 'sequelize'
import { DatabaseService } from '../services/DatabaseService'

interface UserAttributes {
  id: number
  email: string
  firstName: string
  lastName: string
  createdAt?: Date
  updatedAt?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public email!: string
  public firstName!: string
  public lastName!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export function initializeUserModel() {
  const sequelize = DatabaseService.getInstance()
  
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true
    }
  )

  return User
}
