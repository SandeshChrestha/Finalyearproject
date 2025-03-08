import Slots from "../models/Slots.js"
import Futsal from "../models/Futsal.js"
import { createError } from "../utils/error.js"

export const createSlots = async (req, res, next) => {
    const futsalId = req.params.futsalid;
    const newSlots = new Slots(req.body)

    try {
        const savedSlots = await newSlots.save();
        try {
            await Futsal.findByIdAndUpdate(futsalId, {
                $push: { slots: savedSlots._id },

            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedSlots);

    } catch (err) {
        next(err);
    }

};


export const updateSlots = async (req, res, next) => {
    try {
        const updatedSlots = await Slots.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedSlots);

    } catch (err) {
        next(err);
    }

}

export const updateSlotsAvailability = async (req, res, next) => {
    try {
        await Slots.updateOne({ "slotNumbers._id": req.params.id },
            {
                $push: {
                    "slotNumbers.$.unavailableDates": req.body.dates

                },

            }
        )
        res.status(200).json("Room status has updated");

    } catch (err) {
        next(err);
    }

}

export const deleteSlots = async (req, res, next) => {
    const futsalId = req.params.futsalid;


    try {
        await Slots.findByIdAndDelete(
            req.params.id,
        );
        try {
            await Futsal.findByIdAndUpdate(futsalId, {
                $pull: { slots: req.params.id },

            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Slots has been deleted");

    } catch (err) {
        next(err);
    }

}

export const getSlot = async (req, res, next) => {
    try {
        const slots = await Slots.findById(
            req.params.id
        );
        res.status(200).json(slots);

    } catch (err) {
        next(err);
    }

}

export const getSlots = async (req, res, next) => {
    try {
        const slots = await Slots.find();
        res.status(200).json(slots);

    } catch (err) {
        next(err);
    }

}
