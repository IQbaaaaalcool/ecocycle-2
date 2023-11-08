import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403)
        req.name = decoded.name
        next()
    })
}

export const verifyTokens = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    
    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //   if (err) return res.sendStatus(403);
    //   req.userId = decoded.id; // Mengatur 'userId' berdasarkan ID pengguna yang diambil dari token
    //   next();
    // });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
      }
  
      req.userData = decoded; // Menyimpan data pengguna dalam objek req
      next(); // Lanjutkan eksekusi permintaan
    });
}  