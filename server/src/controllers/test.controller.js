import { Router } from "express";

const router = Router();


router.get("/customers", async (req, res) => {
    console.log("customers")
    const customers = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Brad', lastName: 'Traversy' },
        { id: 3, firstName: 'Mary', lastName: 'Swanson' },
    ];
    res.json(customers);
});

export default { router };
