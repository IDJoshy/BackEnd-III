import { petsService } from "../services/index.js"
import { usersService } from "../services/index.js"
import { generatePet, generateUser } from '../utils/mocking.js';
import { logger } from '../app.js';
import { logControllerError } from "../utils/logControllerError.js";
import AppError from "../utils/AppError.js";

export const mockUsers = async (req, res, next) => 
{
  try 
  {
    logger.http("GET /api/users/mockingusers method called"); 

    let { quantity } = req.query;
    if (!quantity) quantity = 50; 
    quantity = parseInt(quantity);

    if (isNaN(quantity)) {
      throw new AppError("BAD_REQUEST", {
        message: "Quantity must be a valid number.",
      });
    }

    let users = [];
    for (let i = 0; i < quantity; i++) {
      users.push(await generateUser());
    }

    logger.debug(
      `GET /api/users/mockingusers calls service - quantity: ${quantity}`
    ); 
    await usersService.createMany(users);
    res.setHeader("Content-Type", "application/json");
    logger.info(
      `GET /api/users/mockingusers method called successfully - quantity: ${quantity}`
    ); 
    return res.status(200).json({ status: "success", payload: users }); 
  } catch (e) {
    logControllerError({ req, method: "mockUsers", error: e });
    next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
  }
};

export const mockPets = async(req,res,next) => 
{
    try {

        logger.http("Post /api/pets/mockingpets method called");

        let {quantity} = req.query;
        if(!quantity) quantity = 100;
        quantity = parseInt(quantity);
        if(isNaN(quantity)) throw new AppError("BAD_REQUEST");

        let pets = [];
        for(let i = 0; i < quantity; i++)
        {
            pets.push(generatePet());
        }

        logger.debug(`Post /api/pets/mockingpets calls service - quantity: ${quantity}`);
        await petsService.createMany(pets);
        res.setHeader('Content-Type', 'application/json');
        logger.info(`Post /api/pets/mockingpets method called successfully - quantity: ${quantity}`);
        return res.status(200).json({pets});
    } 
    catch (e) 
    {
        logControllerError({ req, method: "mockPets", error: e });
        next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
    }
}

export const generateData = async (req, res, next) => {
  try {
    logger.http("POST /api/mocks/generateData method called");

    let { users: numUsers, pets: numPets } = req.query;

    if (!numUsers) numUsers = 10; 
    if (!numPets) numPets = 10;   

    numUsers = parseInt(numUsers);
    numPets = parseInt(numPets);

    if (isNaN(numUsers) || isNaN(numPets)) {
      throw new AppError("BAD_REQUEST", {
        message: "Quantities for users and pets must be valid numbers.",
      });
    }

    //Users
    logger.debug(`Generating ${numUsers} mock users.`);
    let generatedUsers = [];
    for (let i = 0; i < numUsers; i++) {
      generatedUsers.push(await generateUser());
    }
    const createdUsers = await usersService.createMany(generatedUsers);
    logger.info(`Successfully created ${createdUsers.length} users.`);

    //Pets
    logger.debug(`Generating ${numPets} mock pets.`);
    let generatedPets = [];
    for (let i = 0; i < numPets; i++) {
      generatedPets.push(generatePet());
    }
    const createdPets = await petsService.createMany(generatedPets);
    logger.info(`Successfully created ${createdPets.length} pets.`);

    res.setHeader("Content-Type", "application/json");
    logger.info(`POST /api/mocks/generateData method called successfully.`);
    return res.status(200).json({
      status: "success",
      message: "Mock data generated and inserted successfully.",
      usersCreated: createdUsers.length,
      petsCreated: createdPets.length,
    });
  } 
  catch (e) 
  {
    logControllerError({ req, method: "generateData", error: e });
    next(new AppError("INTERNAL_SERVER_ERROR", { cause: e.message }));
  }
};
