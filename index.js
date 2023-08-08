import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoute from './routes/auth.js'
import eventsRoute from './routes/events.js'
import { dbConnection } from './database/config.js';


dotenv.config();

// Crear el servidor de express
const app = express();

// Conectar a la base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio Publico
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', authRoute);
app.use('/api/events', eventsRoute);

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});