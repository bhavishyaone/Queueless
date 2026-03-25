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
