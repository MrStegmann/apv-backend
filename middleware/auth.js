import jwt from "jsonwebtoken";
import VetsModel from "../models/Vetsmodel.js";

const checkAuth = async ( req, res, next ) => {

    if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
        let token;
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await VetsModel.findById(decoded.id).select("-password -token -confirmed");
            req.user = user;
            return next()
        } catch (e) {
            const error = new Error("Token no Válido");
            return res.status.json({msg: error.message});
        }
    };
    if (!token) {
        const error = new Error("Token no válido o inexistente");
        res.status(403).json({msg: error.message});
    };
    next();
};

export default checkAuth