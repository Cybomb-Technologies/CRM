const express = require('express');
const router = express.Router();
const Visit = require('../../../models/file/integrations/Visit');

// GET all visits
router.get('/', async (req, res) => {
  try {
    const visits = await Visit.find().sort({ date: 1, startTime: 1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET statistics
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      scheduled: await Visit.countDocuments({ status: 'scheduled' }),
      completed: await Visit.countDocuments({ status: 'completed' }),
      inProgress: await Visit.countDocuments({ status: 'in-progress' }),
      overdue: await Visit.countDocuments({ status: 'overdue' }),
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a visit
router.post('/', async (req, res) => {
  const visit = new Visit({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    location: req.body.location,
    type: req.body.type,
    status: req.body.status || 'scheduled',
    // Add other fields as needed
  });

  try {
    const newVisit = await visit.save();
    res.status(201).json(newVisit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET a specific visit
router.get('/:id', getVisit, (req, res) => {
  res.json(res.visit);
});

// PUT update a visit
router.put('/:id', getVisit, async (req, res) => {
  if (req.body.title != null) {
    res.visit.title = req.body.title;
  }
  if (req.body.description != null) {
    res.visit.description = req.body.description;
  }
  if (req.body.date != null) {
    res.visit.date = req.body.date;
  }
  if (req.body.startTime != null) {
    res.visit.startTime = req.body.startTime;
  }
  if (req.body.endTime != null) {
    res.visit.endTime = req.body.endTime;
  }
  if (req.body.location != null) {
    res.visit.location = req.body.location;
  }
  if (req.body.status != null) {
    res.visit.status = req.body.status;
  }
  if (req.body.type != null) {
    res.visit.type = req.body.type;
  }

  try {
    const updatedVisit = await res.visit.save();
    res.json(updatedVisit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a visit
router.delete('/:id', getVisit, async (req, res) => {
  try {
    await res.visit.deleteOne();
    res.json({ message: 'Visit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update status (e.g., Check-in, Complete)
router.patch('/:id/status', getVisit, async (req, res) => {
  if (req.body.status != null) {
    res.visit.status = req.body.status;
    
    if (req.body.status === 'in-progress' && !res.visit.checkInTime) {
        res.visit.checkInTime = new Date();
    }
    if (req.body.status === 'completed' && !res.visit.checkOutTime) {
        res.visit.checkOutTime = new Date();
    }
  }

  try {
    const updatedVisit = await res.visit.save();
    res.json(updatedVisit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware to get visit by ID
async function getVisit(req, res, next) {
  let visit;
  try {
    visit = await Visit.findById(req.params.id);
    if (visit == null) {
      return res.status(404).json({ message: 'Cannot find visit' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.visit = visit;
  next();
}

module.exports = router;
