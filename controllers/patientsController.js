import Patients from "../models/Patientsmodel.js";

const addPatient = async ( req, res ) => {
    const patient = new Patients({...req.body, veterinario: req.user._id});

    try {
        const savedPatient = await patient.save();
        res.json(savedPatient);
    } catch (error) {
        console.log(error);
    };
};

const getPatients = async ( req, res ) => {
    const patients = await Patients.find().where("veterinario").equals(req.user._id);

    res.json(patients);
};

const getPatient = async ( req, res ) => {
    const { id } = req.params;
    const patient = await Patients.findById(id);
    if (!patient) {
        const error = new Error("El paciente no existe");
        return res.status(400).json({msg: error.message});
    };

    if (patient.veterinario._id.toString() !== req.user._id.toString()) {
        return res.json({msg: "Acción restringida"});
    };

    return res.json(patient);
};

const updatePatient = async ( req, res ) => {
    const { id } = req.params;
    const patient = await Patients.findById(id);
    if (!patient) {
        const error = new Error("El paciente no existe");
        return res.status(400).json({msg: error.message});
    };

    if (patient.veterinario._id.toString() !== req.user._id.toString()) {
        return res.json({msg: "Acción restringida"});
    };

    for (const key in req.body) {
        patient[key] = req.body[key];
    };

    try {
        
        const updatedPatient = await patient.save();

        res.json(updatedPatient);

    } catch (error) {
        console.log(error);
    };
};

const deletePatient = async ( req, res ) => {
    const { id } = req.params;
    const patient = await Patients.findById(id);
    if (!patient) {
        const error = new Error("El paciente no existe");
        return res.status(400).json({msg: error.message});
    };

    if (patient.veterinario._id.toString() !== req.user._id.toString()) {
        return res.json({msg: "Acción restringida"});
    };

    try {
        await patient.deleteOne();
        res.json({msg: "Paciente eliminado"});
    } catch (error) {
        console.log(error);
    };
};


export { addPatient, getPatients, getPatient, updatePatient, deletePatient }