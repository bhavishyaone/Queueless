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

export const getAllCounters = async (req, res) => {
    try {
        const counters = await Counter.find();
        return res.status(200).json(counters);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};

export const updateCounterStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const counter = await Counter.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!counter) return res.status(404).json({ message: "Counter not found" });

        return res.status(200).json({ message: "Counter status updated successfully", counter });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
