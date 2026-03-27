import Counter from '../../models/counter.js';
import { COUNTER_STATUS } from '../../utils/constants.js';

// Counter controller basics

export const createCounter = async (req, res) => {
    try {
        const { name } = req.body;
        const exists = await Counter.exists({ name });
        if (exists) return res.status(400).json({ message: "Counter name already exists" });

        const counter = await Counter.create({ name });
        return res.status(201).json({ message: "Counter created successfully", counter });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
