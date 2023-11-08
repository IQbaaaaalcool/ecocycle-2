import Users from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createTransport } from 'nodemailer';
import crypto from "crypto";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'nik', 'name', 'email']
        })
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}

export const register = async (req, res) => {
    const { nik, name, email, password, confPassword, role } = req.body
    if (password !== confPassword) return res.status(400).json({ msg: 'password tidak sama coy' })
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    if (name.includes(' ')) {
        return res.status(400).json({ msg: 'Nama tidak boleh mengandung spasi' });
    }
    if (password.length < 8) {
        return res.status(400).json({ msg: "Password harus memiliki setidaknya 8 karakter" });
    }
    if (nik.length < 16) {
        return res.status(400).json({ msg: "nik harus memiliki 16 karakter" });
    }
    try {
        const existingUser = await Users.findOne({
            where: { name }
        });
        
        if (existingUser) {
            return res.status(400).json({ msg: 'username sudah digunakan' });
        }
        
        const existingEmail = await Users.findOne({
            where: { email }
        });
        
        if (existingEmail) {
            return res.status(400).json({ msg: 'email sudah digunakan' });
        }

        await Users.create({
            nik,
            name,
            email,
            password: hashPassword,
            role: 'user'
        })
        res.json({ msg: "register berhasil!" })
    } catch (error) {
        console.log(error)
    }
}

export const registerAdmin = async (req, res) => {
    const { nik, name, email, password, confPassword, role } = req.body
    if (password !== confPassword) return res.status(400).json({ msg: 'password tidak sama' })
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    if (name.includes(' ')) {
        return res.status(400).json({ msg: 'Nama tidak boleh mengandung spasi' });
    }

    if (password.length < 8) {
        return res.status(400).json({ msg: "Password harus memiliki setidaknya 8 karakter" });
    }
    try {
        const existingUser = await Users.findOne({
            where: { name }
        });
        
        if (existingUser) {
            return res.status(400).json({ msg: 'username sudah digunakan' });
        }
        
        const existingEmail = await Users.findOne({
            where: { email }
        });
        
        if (existingEmail) {
            return res.status(400).json({ msg: 'email sudah digunakan' });
        }

        await Users.create({
            nik,
            name,
            email,
            password: hashPassword,
            role: 'admin'
        })
        res.json({ msg: "register berhasil!" })
    } catch (error) {
        console.log(error)
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                name: req.body.name
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match) return res.status(400).json({ msg: "password salah" })
        const userId = user[0].id
        const nik = user[0].nik
        const name = user[0].name
        const email = user[0].email
        const accessToken = jwt.sign({ userId, nik, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '5s'
        })
        const refreshToken = jwt.sign({ userId, nik, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.json({ accessToken })
    } catch (error) {
        res.status(404).json({ msg: "username tidak ditemukan" })
    }
}

export const forgotPassword = async (req, res) => {
    const transporter = createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "104a70f2a14002",
        pass: "454e5c5c47e8e1"
      }
    });
  
    const { email } = req.body;
    const user = await Users.findOne({ where: { email: req.body.email } });
  
    // Buat token reset password
    const token = crypto.randomBytes(20).toString('hex');
    const resetLink = `http://yourapp.com/reset-password?token=${token}`;
  
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Waktu kadaluwarsa token (contoh: 1 jam)
    user.save();
    // Konfigurasi email
    const mailOptions = {
      from: 'your_email@example.com',
      to: email,
      subject: 'Reset Password',
      text: `Click the following link to reset your password: ${resetLink}`,
    };
  
    // Kirim email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent for password reset' });
      }
    });
}
  
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    const user = await Users.findOne({ where: { resetPasswordToken: token } });
    if (user) {
      // Reset password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = null; // Invalidasi token
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } else {
      res.status(404).json({ message: 'Invalid or expired token' });
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    })
    if (!user[0]) return res.sendStatus(204)
    const userId = user[0].id
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.status(200).json({ msg: "logout berhasil" });
}