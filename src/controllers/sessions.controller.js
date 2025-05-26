import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import AppError from "../utils/AppError.js";
import { logger } from '../app.js';
import { logControllerError } from "../utils/logControllerError.js";


const register = async (req, res, next) => {
    try 
    {
        logger.http("Post /api/sessions/register method called");
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) throw new AppError("MISSING_REQUIRED_FIELDS");
        logger.debug(`Post /api/sessions/register calls service`);
        const exists = await usersService.getUserByEmail(email);
        if (exists) throw new AppError("USER_ALREADY_EXISTS");
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        logger.debug(`Post /api/sessions/register calls service`);
        let result = await usersService.create(user);
        logger.info(`Post /api/sessions/register method called successfully - userID: ${result._id}`);
        res.status(201).json({ status: "success", payload: result._id });
    } 
    catch (e) 
    {
        logControllerError({ req, method: "register", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }
}

const login = async (req, res, next) => 
{
    try 
    {
        logger.http("Post /api/sessions/login method called");
        const { email, password } = req.body;
        if (!email || !password) throw new AppError("MISSING_REQUIRED_FIELDS");
        logger.debug(`Post /api/sessions/login calls service to authenticate user - email: ${email}`);
        const user = await usersService.getUserByEmail(email);
        if(!user) throw new AppError("USER_WRONG_CREDENTIALS");
        const isValidPassword = await passwordValidation(user,password);
        if(!isValidPassword) throw new AppError("USER_WRONG_CREDENTIALS");
        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto,'tokenSecretJWT',{expiresIn:"1h"});
        logger.info(`Post /api/sessions/login method called successfully - userID: ${user._id}`);
        res.cookie('coderCookie',token,{maxAge:3600000}).send({status:"success",message:"Logged in"})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "login", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const current = async(req,res,next) =>
{
    try
    {
        logger.http("Get /api/sessions/current method called");
        const cookie = req.cookies['coderCookie']
        const user = jwt.verify(cookie,'tokenSecretJWT');
        if(user)
        {
            logger.info(`Get /api/sessions/current method called successfully - userID: ${user._id}`);
            return res.status(200).json({status:"success",payload:user})
        }
    }
    catch(e)
    {
        logControllerError({ req, method: "current", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const unprotectedLogin  = async(req,res,next) =>
{
    try 
    {
        logger.http("Post /api/sessions/unprotectedLogin method called");
        const { email, password } = req.body;
        if (!email || !password) throw new AppError("MISSING_REQUIRED_FIELDS");
        logger.debug(`Post /api/sessions/unprotectedLogin calls service to authenticate user - email: ${email}`);
        const user = await usersService.getUserByEmail(email);
        if(!user) throw new AppError("USER_WRONG_CREDENTIALS");
        const isValidPassword = await passwordValidation(user,password);
        if(!isValidPassword) throw new AppError("USER_WRONG_CREDENTIALS");
        const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});
        logger.info(`Post /api/sessions/unprotectedLogin method called successfully - userID: ${user._id}`);
        res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "unprotectedLogin", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }
    
}
const unprotectedCurrent = async(req,res,next)=>
{
    try 
    {
        logger.http("Get /api/sessions/unprotectedCurrent method called");
        const cookie = req.cookies['unprotectedCookie']
        const user = jwt.verify(cookie,'tokenSecretJWT');
        if(user)
        {
            logger.info(`Get /api/sessions/unprotectedCurrent method called successfully - userID: ${user._id}`);
            return res.status(200).json({status:"success",payload:user})
        }
    } 
    catch (e) 
    {
        logControllerError({ req, method: "unprotectedCurrent", error: e });
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