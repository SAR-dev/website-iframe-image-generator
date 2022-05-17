import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";

export class Snapshot extends Model {}

Snapshot.init(
  {
    url: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    bg: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "snapshot",
  }
);
