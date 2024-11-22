import generateID from "../helpers/generateID.js";
import generateJWT from "../helpers/generateJWT.js";
import VetsModel from "../models/Vetsmodel.js";
import emailRegister from "../helpers/emailRegister.js";
import emailForgotPass from "../helpers/emailForgotPass.js";

const register = async ( req, res ) => {
    const { email, nombre } = req.body;

    // Check duplicate Users
    const userExist = await VetsModel.findOne({email});

    if (userExist) {
        const error = new Error('Ya existe un usuario con ese email');
        return res.status(400).json({msg: error.message});
    };

    try {
        // Save new Vet
        const vet = new VetsModel(req.body);
        const savedVet = await vet.save();

        emailRegister({
            email, 
            nombre, 
            token: savedVet.token
        });

        res.json(savedVet);

    } catch (error) {
        console.log(error);
    };
};

const confirm = async ( req, res ) => {
    const { token } = req.params;

    const confirmUser = await VetsModel.findOne({token});

    if (!confirmUser) {
        const error = new Error("Token no válido");
        return res.status(404).json({msg: error.message});
    };

    try {
        
        confirmUser.token = null;
        confirmUser.confirmed = true;

        await confirmUser.save();

        res.json({msg: "Usuario confirmado correctamente"});

    } catch (error) {
        console.log(error);
    };
}

const authenticate = async ( req, res ) => {
    const { email, password } = req.body;

    //check exist
    const user = await VetsModel.findOne({email});

    if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(403).json({msg: error.message});
    };

    //check confirmed
    if (!user.confirmed) {
        const error = new Error("Tu cuenta no ha sido confirmada aún");
        return res.status(403).json({msg: error.message});
    };


    //Check Password
    if ( !await user.checkPass(password) ) {
        const error = new Error("La contraseña es incorrecta");
        return res.status(403).json({msg: error.message});
    };

    // Auth user
    res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        token: generateJWT(user._id),
        confirmed: user.confirmed,
        telefono: user.telefono,
        web: user.web
    })

};

const forgetPass = async ( req, res ) => {
    const { email } = req.body;

    const userExist = await VetsModel.findOne({email});

    if (!userExist) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    };

    try {
        userExist.token = generateID();
        await userExist.save();

        emailForgotPass({
            email,
            nombre: userExist.nombre,
            token: userExist.token,
        });
        res.json({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error);
    };
};

const checkToken = async ( req, res ) => {
    const { token } = req.params;

    const validToken = await VetsModel.findOne({token});

    if (!validToken) {
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message});
    };

    res.json({msg: "Token válido"});
};

const changePass = async ( req, res ) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await VetsModel.findOne({token});

    if (!user) {
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message});
    };

    try {
        user.token = null;
        user.password = password;

        await user.save();
        res.json({msg: "Password modificado"});
    } catch (error) {
        console.log(error);
    };
};

const profile = ( req, res ) => {
    
    const { user } = req;
    res.json(user);

};

const updateProfile = async ( req, res ) => {
    const vet = await VetsModel.findById(req.params.id);

    if (!vet) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    };
    const userForm = req.body;
    const { email } = userForm;
    if (vet.email !== req.body.email) {
        const emailExist = await VetsModel.findOne({email});
        if (emailExist) {
            const error = new Error("Ese email ya está en uso");
            return res.status(400).json({msg: error.message});
        };
    };
    
    try {
        for (const key in userForm) {
            vet[key] = userForm[key]
        };

        const savedVet = await vet.save();
        res.json({
            _id: savedVet._id,
            nombre: savedVet.nombre,
            email: savedVet.email,
            token: savedVet.token,
            telefono: savedVet.telefono,
            web: savedVet.web,
            confirmed: savedVet.confirmed
        })
    } catch (error) {
        console.log(error);
    };
};

const updatePass = async ( req, res ) => {
    const  { _id } = req.user;
    const { password, newPassword } = req.body;

    const vet = await VetsModel.findById(_id);

    if (!vet) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    };

    //Check Password
    if ( !await vet.checkPass(password) ) {
        const error = new Error("La contraseña es incorrecta");
        return res.status(403).json({msg: error.message});
    };

    vet.password = newPassword;

    try {
        await vet.save();

        res.json({msg: "Contraseña actualizada correctamente"});
    } catch (error) {
        console.log(error)
    }
};


export { register, profile, confirm, authenticate, forgetPass, checkToken, changePass, updateProfile, updatePass };