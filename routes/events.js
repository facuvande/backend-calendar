/*
    Routas de Eventos
    host + /api/events
*/
import { Router } from 'express';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { actualizarEvento, crearEvento, eliminarEvento, getEventos } from '../controllers/events.js';
import { check } from 'express-validator';
import { isDate } from '../helpers/isDate.js';

const router = Router();

// Cualquier peticion ejecuta el middleware
router.use(validarJWT);

// Obtener eventos
router.get("/", getEventos);
// Crear evento
router.post("/", [ 
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion obligatoria').custom( isDate ),
        validarCampos
    ] ,crearEvento);
// Actualizar evento
router.put('/:id', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion obligatoria').custom( isDate ),
        validarCampos
    ]
, actualizarEvento);
// Eliminar evento
router.delete('/:id', eliminarEvento);

export default router