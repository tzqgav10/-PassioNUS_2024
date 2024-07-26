const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../middleware/cloudinaryConfig"); 
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const event = require("../models/events");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "events",
    allowed_formats: ["jpeg", "jpg", "png", "gif"],
  },
});

const upload = multer({ storage: storage });

// @route   POST api/events
// @desc    Create an event
// @access  Public
router.post("/", upload.single("file"), async (req, res) => {
    const { title, summary, venue, date, content, userId } = req.body;
    const cover = req.file.path; // URL to the uploaded file on Cloudinary
  
    try {
      const newEvent = await event.create({
        title,
        summary,
        venue,
        date,
        content,
        cover,
        userId,
      });
  
      res.status(201).json({ message: "Event created successfully", data: newEvent });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Public
router.put("/:id", upload.single("file"), async (req, res) => {
    const { title, summary, venue, date, content, userId } = req.body;
    const updateData = { title, summary, venue, date, content };
  
    if (req.file) {
      updateData.cover = req.file.path;
    }
  
    try {
      const updatedEvent = await event.findByIdAndUpdate(req.params.id, updateData, { new: true });
  
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

router.get("/", async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        res.status(200).json(
            await event.find({ date: { $gte: today } })
                .sort({ date: 1 })
                .limit(30)
        );
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const eventDoc = await event.findById(id);
        if (!eventDoc) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(eventDoc);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
