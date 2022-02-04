import { Router } from 'express'
import { me, updateMe } from './user.controller'

const router = new Router()

router.get('/', me)
router.put('/', updateMe)

export default router
