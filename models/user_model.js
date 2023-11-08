import { Sequelize } from "sequelize";
import db from "../config/database.js";
const { DataTypes } = Sequelize

const Users = db.define('Auth', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, // Gunakan UUID versi 4
        primaryKey: true,
    },
    nik: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: true
        },
        validate:{
            len: [16]
        }
    },  
    name: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: true
        }
    },
    images: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.STRING
    },
    tanggal_lahir: {
        type: DataTypes.STRING
    },
    no_telepon: {
        type: DataTypes.STRING
    },
    alamat: {
        type: DataTypes.TEXT
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    resetPasswordToken: {
        type: DataTypes.STRING, // Kolom untuk menyimpan token reset password
    },
    resetPasswordExpires: {
        type: DataTypes.DATE, // Kolom untuk menyimpan waktu kadaluwarsa token
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: true
});

export default Users;