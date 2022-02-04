import { User } from './user.model'

export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  if (req.body.role) {
    res.status(403).json({ error: 'Cannot change self role.' })
    return
  }
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
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

export const getUsers = async (_req, res) => {
  try {
    const users = User.find().select('-password').lean().exec()
    res.status(200).json({ data: users })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateUser = async (req, res) => {
  if (req.user._id === req.params.id) {
    res.status(403).json({ error: 'Cannot update self using this route!' })
    return
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
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
