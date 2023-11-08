import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./user_model.js";
const { DataTypes } = Sequelize

const Pengajuan = db.define('pengajuan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, // Gunakan UUID versi 4
        primaryKey: true,
    },
    harga_sampah:{
        type: DataTypes.STRING
    },
    banyak_sampah_kg:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    metode_pembayaran:{
        type: DataTypes.ENUM('cod','dana','gopay'),
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    biaya_akomodasi:{
        type: DataTypes.STRING
    },
    total_harga:{
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: true
});

Users.hasMany(Pengajuan, { foreignKey: 'userId', as: 'pengajuan' });
Pengajuan.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

export default Pengajuan;