import mongoose from 'mongoose'
import SequenceFactory from 'mongoose-sequence'

const AutoIncrement = SequenceFactory(mongoose)

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  price: {
    type: Number,
    min: 0,
  },
  quantity: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  product_id: {
    type: Number,
    immutable: true,
  },
})

productSchema.plugin(AutoIncrement, { inc_field: 'product_id' })

export const Product = mongoose.model('product', productSchema)
