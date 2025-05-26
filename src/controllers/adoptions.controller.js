import { adoptionsService, petsService, usersService } from "../services/index.js"
import AppError from "../utils/AppError.js";

const getAllAdoptions = async(req, res, next)=>
{   
    try 
    {
        const result = await adoptionsService.getAll();
        res.status(200).json(
        {
            status:"success",
            payload:result
        }
        );
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }    
}

const getAdoption = async(req,res)=>
{
    try 
    {
        const adoptionId = req.params.aid;
        if(!adoptionId) throw new AppError("MISSING_REQUIRED_FIELDS");

        const adoption = await adoptionsService.getBy({_id:adoptionId})
        if(!adoption) throw new AppError("ADOPTION_NOT_FOUND");
        res.status(200).json(
        {
            status:"success",payload:adoption
        }
        );
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const createAdoption = async(req, res, next)=>
{
    try 
    {
        const {uid,pid} = req.params;
        if(!uid||!pid) throw new AppError("MISSING_REQUIRED_FIELDS");

        const user = await usersService.getUserById(uid);
        if(!user) throw new AppError("USER_NOT_FOUND");
        const pet = await petsService.getBy({_id:pid});
        if(!pet) throw new AppError("PET_NOT_FOUND");
        if(pet.adopted) throw new AppError("ADOPTION_ALREADY_EXISTS");

        user.pets.push(pet._id);
        await usersService.update(user._id,{pets:user.pets})
        await petsService.update(pet._id,{adopted:true,owner:user._id})
        await adoptionsService.create({owner:user._id,pet:pet._id})
        res.status(200).json(
        {
            status:"success",
            message:"Pet adopted"
        }
        )
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}