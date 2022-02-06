import { Router } from 'express'
import { grantAccess } from '../../roles/roles.middleware'
import { create, getAll } from './order.controller'

const router = new Router()
router.post('/', grantAccess('createAny', 'order'), create)
router.get('/all', grantAccess('readAny', 'order'), getAll)

export default router
