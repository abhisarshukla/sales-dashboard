import { Customer } from './customer.model'
import * as dot from 'dot-object'

export const create = async (req, res) => {
  try {
    const customer = await Customer.create(req.body)
    res.status(200).json({ data: customer })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const update = async (req, res) => {
  try {
    const updates = dot.dot(req.body)
    const customer = await Customer.findOneAndUpdate(
      { customer_id: req.params.id },
      updates,
      { new: true }
    )
      .lean()
      .exec()
    res.status(200).json({ data: customer })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const get = async (req, res) => {
  try {
    const customer = await Customer.findOne({ customer_id: req.params.id })
      .lean()
      .exec()
    res.status(200).json({ data: customer })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getAll = async (req, res) => {
  try {
    const customer = await Customer.find().lean().exec()
    res.status(200).json({ data: customer })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
