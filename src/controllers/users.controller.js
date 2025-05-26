import { usersService } from "../services/index.js"
import AppError from "../utils/AppError.js";

const getAllUsers = async(req, res, next)=>
{
    try 
    {
        const users = await usersService.getAll();
        res.status(200).json({status:"success",payload:users})
    } 
    catch (e) 
    {
        console.error("Error en getAllUsers:", e);
        next(new AppError("INTERNAL_SERVER_ERROR"));
    }

}

const getUser = async(req,res, next)=> 
{
    try 
    {
        const userId = req.params.uid;
        if(!userId) throw new AppError("MISSING_REQUIRED_FIELDS");
        const user = await usersService.getUserById(userId);
        if(!user) throw new AppError("USER_NOT_FOUND");
        res.send({status:"success",payload:user})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const updateUser =async(req,res,next)=>
{
    try 
    {
        const updateBody = req.body;
        if(!updateBody) throw new AppError("MISSING_REQUIRED_FIELDS");
        const userId = req.params.uid;
        if(!userId) throw new AppError("MISSING_REQUIRED_FIELDS");
        const user = await usersService.getUserById(userId);
        if(!user) throw new AppError("USER_NOT_FOUND");
        const result = await usersService.update(userId,updateBody);
        res.status(200).json({status:"success",message:"User updated"})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const deleteUser = async(req,res) =>
{
    try
    {
        const userId = req.params.uid;
        if(!userId) throw new AppError("MISSING_REQUIRED_FIELDS");
        const result = await usersService.getUserById(userId);
        res.status(200).json({status:"success",message:"User deleted"})
    }
    catch(e)
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}