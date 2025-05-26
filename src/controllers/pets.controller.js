import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import { generatePet } from '../utils/mocking.js';
import AppError from "../utils/AppError.js";

const getAllPets = async(req,res,next)=>
{
    try 
    {
        const pets = await petsService.getAll();
        res.status(200).json({status:"success",payload:pets})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const createPet = async(req,res,next)=> 
{
    try 
    {
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) throw new AppError("MISSING_REQUIRED_FIELDS");
        const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
        const result = await petsService.create(pet);
        res.status(200).json({status:"success",payload:result})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const updatePet = async(req,res,next) =>
{
    try 
    {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        if(!petId||!petUpdateBody) throw new AppError("MISSING_REQUIRED_FIELDS");
        const result = await petsService.update(petId,petUpdateBody);
        res.status(200).json({status:"success", message:"Pet updated", payload:result})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const deletePet = async(req,res,next)=> 
{
    try 
    {
        const petId = req.params.pid;
        if(!petId) throw new AppError("MISSING_REQUIRED_FIELDS");
        const result = await petsService.delete(petId);
        res.status(200).json({status:"success", message:"Pet deleted", payload:result})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const createPetWithImage = async(req,res,next) =>
{
    try 
    {
        const file = req.file;
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) throw new AppError("MISSING_REQUIRED_FIELDS");
        console.log(file);
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image:`${__dirname}/../public/img/${file.filename}`
        });
        console.log(pet);
        const result = await petsService.create(pet);
        res.status(200).json({status:"success", message:"Pet created", payload:result})
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}

const mockPets = async(req,res,next) => 
{
    let {quantity} = req.query;
    if(!quantity) quantity = 100;

    let pets = [];

    for(let i = 0; i < quantity; i++)
    {
        pets.push(generatePet());
    }

    try 
    {
        await petsService.createMany(pets);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({pets});
    } 
    catch (e) 
    {
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }

}


export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage,
    mockPets
}