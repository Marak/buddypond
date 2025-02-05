import tape from "tape";
import Resource from "../lib/Resource.js";

tape("Resource - MemoryProvider CRUD operations", (t) => {
    const petManager = new Resource("pet", {
        schema: {
            name: { type: "string" },
            age: { type: "number" },
        },
    });

    const owner = "user123";

    // 🟢 Create a pet
    const pet1 = petManager.create(owner, { name: "Buddy", age: 3 });
    t.ok(pet1.id, "Created pet should have a unique ID");
    t.equal(pet1.name, "Buddy", "Pet name should be 'Buddy'");
    t.equal(pet1.age, 3, "Pet age should be 3");

    // 🟢 List all pets
    const allPets = petManager.list(owner);
    t.equal(allPets.length, 1, "There should be one pet in the list");
    t.deepEqual(allPets[0], pet1, "Listed pet should match the created pet");

    // 🟢 Fetch pet by ID
    const fetchedPet = petManager.get(owner, pet1.id);
    t.deepEqual(fetchedPet, pet1, "Fetched pet should match created pet");

    // 🟢 Update pet age
    const updatedPet = petManager.update(owner, pet1.id, { age: 4 });
    t.equal(updatedPet.age, 4, "Updated pet age should be 4");

    // 🟢 Remove pet
    const deleteStatus = petManager.remove(owner, pet1.id);
    t.deepEqual(deleteStatus, { success: true }, "Delete status should indicate success");

    // 🟢 Verify pet is removed
    const petsAfterDelete = petManager.list(owner);
    t.equal(petsAfterDelete.length, 0, "Pet list should be empty after deletion");
    
    t.end();
});
