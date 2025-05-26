import { usersService } from "../services/index.js"
import AppError from "../utils/AppError.js";
import { logger } from '../app.js';
import { logControllerError } from "../utils/logControllerError.js";

const getAllUsers = async(req, res, next)=>
{
    try 
    {
        logger.http("Get /api/users/ method called");
        const users = await usersService.getAll();
        logger.info("Get /api/users/ method called successfully");
        res.status(200).json({status:"success",payload:users})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "getAllUsers", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR"));
    }

}

const getUser = async(req,res, next)=> 
{
    try 
    {
        logger.http("Get /api/users/:uid method called");
        const userId = req.params.uid;
        if(!userId) throw new AppError("MISSING_REQUIRED_FIELDS");
        logger.debug(`Get /api/users/:uid calls service - userID: ${userId}`);
        const user = await usersService.getUserById(userId);
        if(!user) throw new AppError("USER_NOT_FOUND");
        logger.info(`Get /api/users/:uid method called successfully - userID: ${userId}`);
        res.send({status:"success",payload:user})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "getUser", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const updateUser =async(req,res,next)=>
{
    try 
    {
        logger.http("Put /api/users/:uid method called");
        const updateBody = req.body;
        if(!updateBody) throw new AppError("MISSING_REQUIRED_FIELDS");
        const userId = req.params.uid;
        if(!userId) throw new AppError("MISSING_REQUIRED_FIELDS");
        logger.debug(`Put /api/users/:uid calls service - userID: ${userId}`);
        const user = await usersService.getUserById(userId);
        if(!user) throw new AppError("USER_NOT_FOUND");
        const result = await usersService.update(userId,updateBody);
        logger.info(`Put /api/users/:uid method called successfully - userID: ${userId}`);
        res.status(200).json({status:"success",message:"User updated"})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "updateUser", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const deleteUser = async(req,res) =>
{
    try
    {
        logger.http("Delete /api/users/:uid method called");
        const userId = req.params.uid;
        if(!userId) throw new AppError("MISSING_REQUIRED_FIELDS");
        logger.debug(`Delete /api/users/:uid calls service - userID: ${userId}`);
        await usersService.delete(userId);
        const result = await usersService.getUserById(userId);
        logger.info(`Delete /api/users/:uid method called successfully - userID: ${userId}`);
        res.status(200).json({status:"success",message:"User deleted"})
    }
    catch(e)
    {
        logControllerError({ req, method: "deleteUser", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }
}




export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
}