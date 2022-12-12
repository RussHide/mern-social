import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* Register user */

export const register = async (req, res) => {
    try {
        console.log(req.body.firstName)
        console.log(req.body.password)
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile,
            impressions
        } = req.body
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

/* Login in */
export const login = async (req, res) => {
    try {
        /* Recibe los datos al haces login */
        const {email, password} = req.body
        /* Buscamos que si exista un usuario con el email que se proporciono y regresa toda la informacion del usuario en la variable usuario */
        const user = await User.findOne({email})
        /* Si no existe dale menaje de error */
        if (!user) return res.status(400).json({msg: 'User does not exists' })
        /* Si existe, compara las contraseñas */
        const isMatch = await bcrypt.compare(password, user.password)
        /* Si la contraseña esta equivocada */
        if (!isMatch) return res.status(400).json({msg: 'Invalid credentials' })
        /* Si es correcta dale el token */
        const token = jwt.sign({id: user._id}, procces.env.JWT_SECRET)
        /* Eliminar la contraseña para que no se mande al frontend */
        delete user.password
        res.status(200).json({token, user})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}