import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import AppError from "../utils/AppError.js";

const register = async (req, res, next) => {
    try 
    {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) throw new AppError("MISSING_REQUIRED_FIELDS");
        const exists = await usersService.getUserByEmail(email);
        if (exists) throw new AppError("USER_ALREADY_EXISTS");
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        console.log(result);
        res.status(201).json({ status: "success", payload: result._id });
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }
}

const login = async (req, res, next) => 
{
    try 
    {
        const { email, password } = req.body;
        if (!email || !password) throw new AppError("MISSING_REQUIRED_FIELDS");
        const user = await usersService.getUserByEmail(email);
        if(!user) throw new AppError("USER_WRONG_CREDENTIALS");
        const isValidPassword = await passwordValidation(user,password);
        if(!isValidPassword) throw new AppError("USER_WRONG_CREDENTIALS");
        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto,'tokenSecretJWT',{expiresIn:"1h"});
        res.cookie('coderCookie',token,{maxAge:3600000}).send({status:"success",message:"Logged in"})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const current = async(req,res,next) =>
{
    try
    {
        const cookie = req.cookies['coderCookie']
        const user = jwt.verify(cookie,'tokenSecretJWT');
        if(user) return res.status(200).json({status:"success",payload:user})
    }
    catch(e)
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const unprotectedLogin  = async(req,res,next) =>
{
    try 
    {
        const { email, password } = req.body;
        if (!email || !password) throw new AppError("MISSING_REQUIRED_FIELDS");
        const user = await usersService.getUserByEmail(email);
        if(!user) throw new AppError("USER_WRONG_CREDENTIALS");
        const isValidPassword = await passwordValidation(user,password);
        if(!isValidPassword) throw new AppError("USER_WRONG_CREDENTIALS");
        const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});
        res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }
    
}
const unprotectedCurrent = async(req,res,next)=>
{
    try 
    {
        const cookie = req.cookies['unprotectedCookie']
        const user = jwt.verify(cookie,'tokenSecretJWT');
        if(user)
            return res.status(200).json({status:"success",payload:user})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}
export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}