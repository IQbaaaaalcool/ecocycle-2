import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./user_model.js";
const { DataTypes } = Sequelize

const Profil = db.define('profile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, // Gunakan UUID versi 4
        primaryKey: true,
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
    }
}, {
    freezeTableName: true,
    timestamps: true
});

Profil.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

export default Profil;