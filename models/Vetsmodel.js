import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import generateID from '../helpers/generateID.js';


const vetSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        default: "",
        trim: true
    },
    web: {
        type: String,
        default: ""
    },
    token: {
        type: String,
        default: generateID()
    },
    confirmed: {
        type: Boolean,
        default: false
    }
});

vetSchema.pre('save', async function(next) {
    if (!this.isModified("password")) {
        next();
    };
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

vetSchema.methods.checkPass = async function(formPass) {
    return await bcrypt.compare(formPass, this.password);
};

const VetsModel = mongoose.model("VetsModel", vetSchema);

export default VetsModel;