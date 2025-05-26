import { fakerES as fa } from "@faker-js/faker";

export const generatePet = () =>
{
    let name = fa.person.firstName();
    let specie = fa.animal.type();
    let birthDate = fa.date.past();
    let adopted = false;
    return {name,specie,birthDate,adopted};
}