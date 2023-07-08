import Evento from "../models/Evento.js"

export const getEventos = async(req, res) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.status(201).json({
        ok: 'true',
        eventos
    })
}

export const crearEvento = async (req, res) => {
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        
        res.json({
            ok: 'true',
            eventoGuardado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: 'false',
            msg: 'Hable con el administrador',
        });
    }
}

export const actualizarEvento = async(req, res) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoId );
        if(!evento){
            return res.status(404).json({
                ok: 'false',
                msg: 'Evento no existe por ese id'
            })
        }

        // Para que no edite eventos de otros usuarios
        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: 'false',
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid,
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: 'false',
            msg: 'Hable con el administrador'
        })
    }
}

export const eliminarEvento = async(req, res) => {
    const eventoId = req.params.id;
    const uid = req.uid
    try {
        
        const evento = await Evento.findById( eventoId );
        if(!evento){
            return res.status(404).json({
                ok: 'false',
                msg: 'Evento no existe por ese id'
            })
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: 'false',
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }

        const deletedEvento = await Evento.findByIdAndDelete( eventoId );
        res.json({
            ok: true,
            eventoEliminado: deletedEvento
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: 'false',
            msg: 'Hable con el administrador'
        })
    }
}