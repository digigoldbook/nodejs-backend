import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class UserDeviceModel extends Model {}

UserDeviceModel.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users", 
                key: "id",
            },
        },
        device_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db.sequelize,
        modelName: "UserDevice",
        tableName: "user_devices",
        freezeTableName: true,
        timestamps: false,
    }
);

export default UserDeviceModel;
