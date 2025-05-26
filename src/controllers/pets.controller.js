import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import AppError from "../utils/AppError.js";
import { logger } from '../app.js';
import { logControllerError } from "../utils/logControllerError.js";


const getAllPets = async(req,res,next)=>
{
    try 
    {
        logger.http("Get /api/pets/ method called");
        const pets = await petsService.getAll();
        logger.info("Get /api/pets/ method called successfully");
        res.status(200).json({status:"success",payload:pets})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "getAllPets", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const createPet = async(req,res,next)=> 
{
    try 
    {
        logger.http("Post /api/pets/ method called");

        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) throw new AppError("MISSING_REQUIRED_FIELDS");
        const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
        const result = await petsService.create(pet);

        logger.info(`Post /api/pets/ method called successfully - petID: ${result._id}`);
        res.status(200).json({status:"success",payload:result})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "createPet", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const updatePet = async(req,res,next) =>
{
    try 
    {
        logger.http("Put /api/pets/:pid method called");
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        if(!petId||!petUpdateBody) throw new AppError("MISSING_REQUIRED_FIELDS");
        logger.debug(`Put /api/pets/:pid calls service - petID: ${petId} - petUpdateBody: ${JSON.stringify(petUpdateBody)}`);
        const result = await petsService.update(petId,petUpdateBody);
        logger.info(`Put /api/pets/:pid method called successfully - petID: ${petId}`);
        res.status(200).json({status:"success", message:"Pet updated", payload:result})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "updatePet", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const deletePet = async(req,res,next)=> 
{
    try 
    {
        logger.http("Delete /api/pets/:pid method called");
        const petId = req.params.pid;
        if(!petId) throw new AppError("MISSING_REQUIRED_FIELDS");
        const result = await petsService.delete(petId);
        logger.info(`Delete /api/pets/:pid method called successfully - petID: ${petId}`);
        res.status(200).json({status:"success", message:"Pet deleted", payload:result})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "deletePet", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const createPetWithImage = async(req,res,next) =>
{
    try 
    {
        logger.http("Post /api/pets/ method called");
        const file = req.file;
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) throw new AppError("MISSING_REQUIRED_FIELDS");
        logger.info(file);
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image:`${__dirname}/../public/img/${file.filename}`
        });
        logger.info(pet);
        logger.debug(`Post /api/pets/ calls service - pet: ${JSON.stringify(pet)}`);
        const result = await petsService.create(pet);

        logger.info(`Post /api/pets/ method called successfully - petID: ${result._id}`);
        res.status(200).json({status:"success", message:"Pet created", payload:result})
    } 
    catch (e) 
    {
        logControllerError({ req, method: "createPetWithImage", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}


export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage,
}