import Clinic from '../../models/clinic.js';

export const getClinicDetails = async (req, res) => {
    try {
        const clinic = await Clinic.findOne();
        if (!clinic) {
            return res.status(404).json({ message: "Clinic info not configured." });
        }
        return res.status(200).json(clinic);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};

export const updateClinicDetails = async (req, res) => {
    try {
        const { name, address, openingHours, isOpen } = req.body;
        let clinic = await Clinic.findOne();

        if (!clinic) {
            clinic = new Clinic({ name: name || "Default Clinic", address, openingHours, isOpen });
        } else {
            if (name !== undefined) clinic.name = name;
            if (address !== undefined) clinic.address = address;
            if (openingHours !== undefined) clinic.openingHours = openingHours;
            if (isOpen !== undefined) clinic.isOpen = isOpen;
        }

        await clinic.save();
        return res.status(200).json({ message: "Clinic details updated successfully.", clinic });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
