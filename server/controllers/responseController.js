const ResponseModel = require('../models/Responses');
const DropModel = require('../models/DropModel');

exports.getAllResponsesForDrop = async (req, res) => {
    try {
        const { dropId } = req.query;
        const responses = await ResponseModel.find({
            replyOf: dropId
        })

        res.status(200).json({ message: "responses sent!", responses });
    } catch (error) {
        res.status(500).json({ message: "unable to get responses mongoose error", error })
    }
}

exports.addResponse = async (req, res) => {
    try {
        const { dropId, response, senderId } = req.body;

        if (!dropId || !response) {
            res.status(400).json({ message: "dropId or response content not found." })
        };
        
        const dropToBeResponded = await DropModel.findById(dropId);

        if (!dropToBeResponded) {
            res.status(400).json({ message: "drop not found!", dropId });
            return;
        };

        const body = {
            replyOf: dropId,
            content: response,
        }

        if (senderId) {
            body.senderId = senderId
        }
        
        const responseToAdd = new ResponseModel(body);
        
        const newResponse = await responseToAdd.save();

        const updatedDrop = await DropModel.findByIdAndUpdate(
            dropId, 
            { $push: { responses: newResponse._id } },
            { new: true }
        )

        res.status(200).json({ message: "response added successfully", updatedDrop })

    } catch (error) {
        
        res.status(500).json({ message: "Error adding the resposne, mongoose error", error });
    }
}