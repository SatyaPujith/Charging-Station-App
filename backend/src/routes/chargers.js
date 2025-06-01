const express = require('express');
const Charger = require('../models/Charger');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a charger
router.post('/', authMiddleware, async (req, res) => {
  try {
    const charger = new Charger({ ...req.body, createdBy: req.user.userId });
    await charger.save();
    res.status(201).json(charger);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all chargers
router.get('/', async (req, res) => {
  try {
    const chargers = await Charger.find();
    res.json(chargers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get chargers for the logged-in user
router.get('/my-chargers', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching chargers for userId:', req.user.userId); // Debug log
    const chargers = await Charger.find({ createdBy: req.user.userId });
    console.log('Found chargers:', chargers); // Debug log
    res.json(chargers);
  } catch (err) {
    console.error('Error fetching user chargers:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update a charger
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const charger = await Charger.findOne({ _id: req.params.id, createdBy: req.user.userId });
    if (!charger) {
      return res.status(404).json({ message: 'Charger not found or you do not have permission to edit it' });
    }
    Object.assign(charger, req.body);
    await charger.save();
    res.json(charger);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a charger
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const charger = await Charger.findOneAndDelete({ _id: req.params.id, createdBy: req.user.userId });
    if (!charger) {
      return res.status(404).json({ message: 'Charger not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Charger deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;