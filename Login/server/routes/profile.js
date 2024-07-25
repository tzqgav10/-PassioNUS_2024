const express = require('express');
const router = express.Router();
const collection = require('../models/config'); // Ensure this path is correct
const { studentModel } = require('../models/Student');

// Endpoint to fetch user profile
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('Received userId:', userId); // Debugging line

        // Fetch user profile and nickname from studentModel
        const userProfile = await collection.findOne({ userId: userId });
        const student = await studentModel.findOne({ _id: userId }).select("name nickname");

        if (!userProfile || !student) {
            return res.status(404).send({ message: 'Profile not found' });
        }

        const response = {
            ...userProfile._doc,
            name: student.name,
            nickname: student.nickname,
        };

        res.send(response);
    } catch (error) {
        console.error('Error fetching profile:', error); // Logging error
        res.status(500).send({ message: 'Server error' });
    }
});

// Endpoint to update user profile
router.put('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, faculty, year, gender, nickname } = req.body;

        const updatedProfile = await collection.findOneAndUpdate(
            { userId: userId },
            { faculty, year, gender },
            { new: true, useFindAndModify: false }
        );

        const updatedStudent = await studentModel.findOneAndUpdate(
            { _id: userId },
            { name, nickname },
            { new: true, useFindAndModify: false }
        );

        if (!updatedProfile || !updatedStudent) {
            return res.status(404).send({ message: 'Profile not found' });
        }

        const response = {
            ...updatedProfile._doc,
            name: updatedStudent.name,
            nickname: updatedStudent.nickname,
        };

        res.send(response);
    } catch (error) {
        console.error('Error updating profile:', error); // Logging error
        res.status(500).send({ message: 'Server error' });
    }
});

module.exports = router;
