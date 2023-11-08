import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import db from "./config/database.js";
import cookieParser from "cookie-parser";
import Users from "./models/user_model.js";
import Profil from "./models/ProfilModels.js";
import Persetujuan from "./models/PersetujuanModels.js";
import Pengajuan from "./models/PengajuanModels.js";
import router from "./routes/index.js";
import ArticleRoute from "./routes/articleRoute.js"
import PengajuandanprofilRoute from "./routes/pengajuanRoute.js"
dotenv.config();
const app = express();

try {
    await db.authenticate()
    console.log('yesss konekk!')
    // await Users.sync();
    // await Pengajuan.sync();
    // await Profil.sync();
    // await Persetujuan.sync();
} catch (error) {
    console.log(error)
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(cookieParser())
app.use(express.json())
app.use(router)
app.use(PengajuandanprofilRoute)
app.use(ArticleRoute)

app.listen(5000, () => console.log('Server running at port 5000'));