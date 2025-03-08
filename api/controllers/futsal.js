import Futsal from "../models/Futsal.js";
import Slots from "../models/Slots.js";

export const createFutsal = async (req, res, next) => {
    const newFutsal = new Futsal(req.body)

    try {
        const savedFutsal = await newFutsal.save()
        res.status(200).json(savedFutsal);

    } catch (err) {
        next(err);
    }

}

export const updateFutsal = async (req, res, next) => {
    try {
        const updatedFutsal = await Futsal.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedFutsal);

    } catch (err) {
        next(err);
    }

}

export const deleteFutsal = async (req, res, next) => {
    try {
        await Futsal.findByIdAndDelete(
            req.params.id,
        );
        res.status(200).json("Futsal has been deleted");

    } catch (err) {
        next(err);
    }

}

export const getFutsal = async (req, res, next) => {
    try {
        const futsal = await Futsal.findById(
            req.params.id,
        );
        res.status(200).json(futsal);

    } catch (err) {
        next(err);
    }

}
//yasma alii
export const getFutsals = async (req, res, next) => {
    try {
        const { limit, featured, min, max, ...filters } = req.query;

        // Build query dynamically
        const query = { ...filters };

        // Convert 'featured' to a boolean
        if (featured !== undefined) {
            query.featured = featured === "true";
        }

        // Apply min and max filtering on `cheapestprice`
        if (min !== undefined || max !== undefined) {
            query.cheapestprice = {
                ...(min !== undefined ? { $gte: Number(min) } : {}),
                ...(max !== undefined ? { $lte: Number(max) } : {}),
            };
        }

        // Fetch from database with limit
        const futsals = await Futsal.find(query).limit(Number(limit) || 10);

        return res.status(200).json(futsals);
    } catch (err) {
        next(err);
    }
};




export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",")
    try {
        const list = await Promise.all(cities.map(city => {
            return Futsal.countDocuments({ city: city })
        }))
        res.status(200).json(list);

    } catch (err) {
        next(err);
    }

}

export const countByType = async (req, res, next) => {

    try {
        const futsalCount = await Futsal.countDocuments({ type: "Futsal" })
        const apartmentCount = await Futsal.countDocuments({ type: "apartment" });
        const resortCount = await Futsal.countDocuments({ type: "resort" });
        const villaCount = await Futsal.countDocuments({ type: "villa" });
        const cabinCount = await Futsal.countDocuments({ type: "cabin" });


        res.status(200).json([
            { type: "futsal", count: futsalCount },
            { type: "apartments", count: apartmentCount },
            { type: "resorts", count: resortCount },
            { type: "villas", count: villaCount },
            { type: "cabins", count: cabinCount },


        ]);

    } catch (err) {
        next(err);
    }

};

export const getFutsalSlots = async (req, res, next) => {
    try {
        const futsal = await Futsal.findById(req.params.id)
        const list = await Promise.all(futsal.slots.map(slot => {
            return Slots.findById(slot);
        }))

        res.status(200).json(list)

    } catch (err) {
        next(err)

    }

}

