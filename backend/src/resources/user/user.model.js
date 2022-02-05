import mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import SequenceFactory from 'mongoose-sequence'

const AutoIncrement = SequenceFactory(mongoose)

const userSchema = new mongoose.Schema({
  name: {
    firstname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'sales',
    enum: ['sales', 'curator', 'admin'],
  },
  user_id: {
    type: Number,
    immutable: true,
  },
})

userSchema.plugin(AutoIncrement, { inc_field: 'user_id' })

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err)
    }

    this.password = hash
    next()
  })
})

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }

      resolve(same)
    })
  })
}

export const User = mongoose.model('user', userSchema)
