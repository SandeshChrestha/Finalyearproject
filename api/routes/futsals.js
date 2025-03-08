import express from "express";
import Futsal from "../models/Futsal.js"
import { countByCity, countByType, createFutsal, deleteFutsal, getFutsal, getFutsals, updateFutsal, getFutsalSlots } from "../controllers/futsal.js";
import { verifyAdmin } from "../utils/verifyToken.js";



const router = express.Router();

// create 
router.post("/", verifyAdmin, createFutsal);


//update
router.put("/:id", verifyAdmin, updateFutsal);

//delete
router.delete("/:id", verifyAdmin, deleteFutsal);


//get
router.get("/find/:id", getFutsal);

//get all
router.get("/", getFutsals);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/slots/:id", getFutsalSlots);





export default router;