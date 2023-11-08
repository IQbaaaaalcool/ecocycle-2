import Users from "../models/user_model.js";

// Di dalam route atau controller yang sesuai
export const createPengajuan = async (req, res, next) => {
  const { no_telepon, alamat } = req.body;
  const nik = req.userData.nik; // Mengambil 'nik' dari middleware verifyToken

  try {
    // Mencari data pengajuan yang sudah ada untuk pengguna yang sudah login (berdasarkan 'nik')
    const existingPengajuan = await Users.findOne({
      where: { nik }
    });

    if (!existingPengajuan) {
      return res.status(404).json({ msg: "Data pengajuan tidak ditemukan" });
    }

    // Mengisi data pengajuan yang sudah ada dengan informasi yang baru
    existingPengajuan.no_telepon = no_telepon;
    existingPengajuan.alamat = alamat;

    // Menyimpan perubahan ke dalam data pengajuan yang sudah ada
    await existingPengajuan.save();

    res.json({ msg: "Pengajuan diri berhasil !" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal mengupdate pengajuan" });
  }
};

export const createProfil = async(req, res) => {
    const {tanggal_lahir} = req.body;
    if (req.files === null) {
        return res.status(400).json({ msg: "No file uploaded" });
    }
    const file = req.files.file;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  
    const allowedTypes = [".png", ".jpg", ".jpeg"];
    if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image format" });
    }
  
    const fileSize = file.data.length;
    if (fileSize > 50000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
    }
  
    await file.mv(`./public/images/${fileName}`);
    try {
        await Users .create({
            tanggal_lahir,
            url,
            images: fileName,
        })
        res.json({ msg: "pengajuan berhasil!" })
    } catch (error) {
        console.log(error)
    }
}