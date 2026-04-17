const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - Public checkout
router.post('/', async (req, res) => {
  try {
    const { customer, items, notes } = req.body;

    if (!customer || !items || !items.length) {
      return res.status(400).json({ message: 'Customer info and order items are required.' });
    }

    // Validate stock and calculate pricing
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(400).json({ message: `Product ${item.product} not found.` });
      if (!product.isActive) return res.status(400).json({ message: `${product.titleEn} is no longer available.` });

      const qty = item.quantity || 1;
      if (product.stock < qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.titleEn}. Only ${product.stock} left.`
        });
      }

      const price = product.discountPrice || product.price;
      subtotal += price * qty;

      validatedItems.push({
        product: product._id,
        title: product.titleEn,
        image: product.images?.[0] || '',
        price,
        quantity: qty,
        weight: item.weight || '',
      });
    }

    const deliveryFee = subtotal >= 2000 ? 0 : 150;
    const total = subtotal + deliveryFee;

    const order = new Order({
      customer,
      items: validatedItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: 'COD',
      notes: notes || '',
    });

    await order.save();

    // Reduce stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({
      message: 'Order placed successfully! 🎉',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orders - Admin only
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('items.product', 'titleEn images'),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, pagination: { page: Number(page), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orders/stats - Admin dashboard stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const [total, pending, shipped, delivered, revenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Shipped' }),
      Order.countDocuments({ status: 'Delivered' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);

    res.json({
      totalOrders: total,
      pendingOrders: pending,
      shippedOrders: shipped,
      deliveredOrders: delivered,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orders/:id - Admin only
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'titleEn images price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/orders/:id/status - Admin only
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
