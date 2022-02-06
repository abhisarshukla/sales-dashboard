import mongoose from 'mongoose'
import SequenceFactory from 'mongoose-sequence'

const AutoIncrement = SequenceFactory(mongoose)

const orderSchema = new mongoose.Schema({
  order_id: {
    type: Number,
    immutable: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  PaymentMethod: {
    type: String,
    enum: [
      'cash',
      'google pay',
      'internet banking',
      'credit/debit card',
      'paytm',
      'phonepe',
    ],
  },
  customer_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'customer',
    required: true,
  },
  product_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'product',
    required: true,
  },
})

orderSchema.plugin(AutoIncrement, { inc_field: 'order_id' })

export const Order = mongoose.model('order', orderSchema)
