import express from "express";

const isAdmin = (user) => {
  // Ganti ini dengan logika Anda untuk memeriksa apakah user memiliki peran admin
  return user.role === 'admin';
};

export const adminOnly = (req, res, next) => {
  const user = req.user; // Dapatkan data pengguna terotentikasi dari req.user
  
  if (!user) {
    return res.status(401);
  }

  if (!isAdmin(user)) {
    return res.status(403).json({ msg: "Anda tidak diizinkan mengakses halaman ini" });
  }

  next(); // Jika pengguna adalah admin, lanjutkan ke endpoint selanjutnya
};