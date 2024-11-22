import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import patientsRoutes from "./routes/patientsRoutes.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json())

connectDB();

const allowedDomains = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, cb) {
        if (allowedDomains.indexOf(origin) !== -1) {
            cb(null, true);
        } else {
            cb(new Error("No permitido por CORS"))
        };
    }
};

app.use(cors(corsOptions));

app.use('/api/vets', veterinarioRoutes);
app.use('/api/patients', patientsRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor conectado en el puerto ${PORT}`);
});