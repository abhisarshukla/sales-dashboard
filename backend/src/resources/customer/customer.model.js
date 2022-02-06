import mongoose from 'mongoose'
import SequenceFactory from 'mongoose-sequence'

const AutoIncrement = SequenceFactory(mongoose)

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: Number,
    immutable: true,
  },
  name: {
    firstname: {
      type: String,
      required: true,
      maxlength: 255,
    },
    lastname: {
      type: String,
      required: true,
      maxlength: 255,
    },
  },
  address: {
    type: String,
    required: true,
    maxlength: 1000,
  },
})

customerSchema.plugin(AutoIncrement, { inc_field: 'customer_id' })

export const Customer = mongoose.model('customer', customerSchema)
