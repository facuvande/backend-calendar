import express from 'express'
import jwt from 'jsonwebtoken'

export const validarJWT = (req, res = express.response, next) => {
    
    // X-TOKEN HEADERS
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );
        req.uid = payload.uid;
        req.name = payload.name;

        next()
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }
}