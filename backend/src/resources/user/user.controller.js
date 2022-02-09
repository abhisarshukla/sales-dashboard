import { User } from './user.model'
import * as dot from 'dot-object'

export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  if (req.body.role) {
    res.status(403).json({ error: 'Cannot change self role.' })
    return
  }
  try {
    const updates = dot.dot(req.body)
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    })
      .select('-password')
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ user_id: { $ne: req.user.user_id } })
      .select('-password')
      .lean()
      .exec()
    res.status(200).json({ data: users })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateUser = async (req, res) => {
  if (req.user.user_id === req.params.id) {
    res.status(403).json({ error: 'Cannot update self using this route!' })
    return
  }
  try {
    const updates = dot.dot(req.body)
    const user = await User.findOneAndUpdate(
      { user_id: req.params.id },
      updates,
      {
        new: true,
      }
    )
      .select('-password')
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const remove = async (req, res) => {
  try {
    const user = await User.findOneAndRemove(
      { user_id: req.params.id },
      req.body
    ).exec()
    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getOne = async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.id }).lean().exec()
    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const toggleRole = async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.id }).lean().exec()
    let nextRole = ''
    switch (user.role) {
      case 'admin':
        nextRole = 'sales'
        break
      case 'sales':
        nextRole = 'curator'
        break
      case 'curator':
        nextRole = 'admin'
        break
    }
    await Order.findOneAndUpdate({ user_id: req.params.id }, { role: nextRole })
      .lean()
      .exec()
    res.status(200).end()
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
