import { Product } from './product.model'

export const getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean().exec()
    res.status(200).json({ data: product })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getAll = async (req, res) => {
  try {
    const products = await Product.find().lean().exec()
    res.status(200).json({ data: products })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const create = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(200).json({ data: product })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const update = async (req, res) => {
  try {
    const product = Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec()
    res.status(200).json({ data: product })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const remove = async (res, res) => {
  try {
    const product = Product.findByIdAndRemove(req.params.id, req.body).exec()
    res.status(200).json({ data: product })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
