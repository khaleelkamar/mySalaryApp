import { Sequelize, DataTypes, Model } from 'sequelize';

interface SalaryAttributes {
  id: number;
  name: string;
  salary: number;
  currency: string;
  department: string;
  sub_department: string;
  on_contract: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class Salary extends Model<SalaryAttributes> implements SalaryAttributes {
  public id!: number;
  public name!: string;
  public salary!: number;
  public currency!: string;
  public department!: string;
  public sub_department!: string;
  public on_contract!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Salary {
  Salary.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      salary: {
        type: DataTypes.INTEGER,
      },
      currency: {
        type: DataTypes.STRING,
      },
      department: {
        type: DataTypes.STRING,
      },
      sub_department: {
        type: DataTypes.STRING,
      },
      on_contract: {
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'salary',
      timestamps: true,
    }
  );

  return Salary;
}
