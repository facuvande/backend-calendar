import { generarJwt } from "../helpers/jwt.js"
import Usuario from "../models/Usuario.js"
import bcrypt from 'bcryptjs'

export const crearUsuario = async(req, res) => {
    const { email, password } = req.body
    try {
        let usuario = await Usuario.findOne({ email: email});
        if(usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }
        
        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        
        // Generar JWT

        const token = await generarJwt( usuario.id, usuario.name );

        res.status(201).json({
            ok: 'true',
            msg: 'register',
            uid: usuario.id,
            name: usuario.name,
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

export const loginUsuario = async(req, res) => {

    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({ email: email});
        if(!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contrasena incorrectos'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // Generar JWT
        const token = await generarJwt( usuario.id, usuario.name );


        res.json({
            ok: 'true',
            uid: usuario.id,
            name: usuario.name,
            token,
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}

export const revalidarToken = async(req, res) => {

    const { uid, name } = req;
    // Generar nuevo jwt
    const token = await generarJwt( uid, name );

    res.json({
        ok: 'true',
        msg: 'renew',
        token
    })
}