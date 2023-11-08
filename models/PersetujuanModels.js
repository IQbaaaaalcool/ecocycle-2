import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Pengajuan from "./PengajuanModels.js";

const { DataTypes } = Sequelize;

const Persetujuan = db.define('persetujuan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  pengajuan_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  admin_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('disetujui', 'ditolak'),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Persetujuan.belongsTo(Pengajuan);

export default Persetujuan;