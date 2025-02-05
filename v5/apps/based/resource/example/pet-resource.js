import Resource from '../lib/Resource.js';

// Example Usage
const petManager = new Resource("pet", {
    provider: 'memory', // also rest
    schema: {
        name: { type: "string" },
        age: { type: "number" },
    },
});
// Sample operations
const owner = "user123";
const pet1 = petManager.create(owner, { name: "Buddy", age: 3 });
console.log("Created Pet:", pet1);

const allPets = petManager.list(owner);
console.log("All Pets:", allPets);

const fetchedPet = petManager.get(owner, pet1.id);
console.log("Fetched Pet:", fetchedPet);

const updatedPet = petManager.update(owner, pet1.id, { age: 4 });
console.log("Updated Pet:", updatedPet);

const deleteStatus = petManager.remove(owner, pet1.id);
console.log("Deleted Pet:", deleteStatus);
