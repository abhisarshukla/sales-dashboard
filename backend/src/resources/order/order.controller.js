import { Order } from './order.model'
import { Customer } from '../customer/customer.model'
import { Product } from '../product/product.model'

export const create = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      customer_id: req.body.customer_id,
    })
      .lean()
      .exec()
    const product = await Product.findOne({ product_id: req.body.product_id })
      .lean()
      .exec()
    if (!customer || !product) {
      return res.status(400).json({
        code: 'INVALID_ID',
        message: 'Invalid customer_id or product_id',
      })
    }
    req.body.customer_id = customer._id
    req.body.product_id = product._id
    const order = await Order.create(req.body)
    res.status(200).json({ data: order })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getAll = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer_id')
      .populate('product_id')
      .lean()
      .exec()
    res.status(200).json({ body: orders })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const update = async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.id }).lean().exec()
    let nextState = ''
    switch (order.status) {
      case 'pending':
        nextState = 'shipped'
        break
      case 'shipped':
        nextState = 'delivered'
        break
      case 'delivered':
        nextState = 'pending'
        break
    }
    await Order.findOneAndUpdate(
      { order_id: req.params.id },
      { status: nextState }
    )
      .lean()
      .exec()
    res.status(200).end()
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
