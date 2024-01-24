const { default: mongoose } = require('mongoose');
const CraftModel = require('../models/CraftModel')

exports.getAllCraft = async (req, res) => {
    try {
        const crafts = await CraftModel.find({});
        
        res.status(200).json({ message: "found the craft successfully.", crafts });
    } catch (error) {
        res.status(500).json({ message: "unable to get the the Craft, please try again later. (controller error)", error });
    }
}

exports.addCraft = async (req, res) => {
    try {
        const craftToAdd = req.body;

        if (!craftToAdd) {
            res.status(400).json({ messasge: "craft is required" });
            return;
        }

        const newCraft = new CraftModel( {craftToAdd} )
        
        await newCraft.save();

        res.status(200).json({ message: "Craft updated successfully", craft: newCraft})
    } catch (error) {
        res.status(500).json({ message: "Some database error occured", error });
    }
}