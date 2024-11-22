import mongoose from "mongoose";

const patientSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    alta: {
        type: Date,
        required: true
    },
    sintomas: {
        type: String,
        required: true
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VetsModel"
    },
}, {
    timestamps: true
});

const Patients = mongoose.model("Patients", patientSchema);

export default Patients;