const express = require('express');
const Category = require('../models/Category');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories - Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/categories - Admin only
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message });
  }
});

// PUT /api/categories/:id - Admin only
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated', category });
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message });
  }
});

// DELETE /api/categories/:id - Admin only
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
