import { Router } from 'express'
import { grantAccess } from '../../roles/roles.middleware'
import { create, update, get, getAll } from './customer.controller'

const router = new Router()

router.post('/', grantAccess('createAny', 'customer'), create)
router.get('/:id', grantAccess('readAny', 'customer'), get)
router.get('/all', grantAccess('readAny', 'customer'), getAll)
router.put('/:id', grantAccess('updateAny', 'customer'), update)

export default router
