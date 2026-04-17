const mongoose = require('mongoose');

const weightOptionSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g. "1 kg", "5 kg"
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  titleEn: { type: String, required: true, trim: true },
  titleUr: { type: String, required: true, trim: true },
  descriptionEn: { type: String, required: true },
  descriptionUr: { type: String, required: true },

  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: null },

  stock: { type: Number, required: true, default: 0, min: 0 },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  images: [{ type: String }],

  weightOptions: [weightOptionSchema],

  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },

  tags: [{ type: String }],

}, { timestamps: true });

// Virtual: is in stock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// Virtual: discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (!this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
