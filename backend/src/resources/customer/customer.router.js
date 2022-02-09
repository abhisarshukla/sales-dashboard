import { Router } from 'express'
import { grantAccess } from '../../roles/roles.middleware'
import { create, update, get, getAll, remove } from './customer.controller'

const router = new Router()

router.post('/', grantAccess('createAny', 'customer'), create)
router.get('/all', grantAccess('readAny', 'customer'), getAll)
router.get('/:id', grantAccess('readAny', 'customer'), get)
router.put('/:id', grantAccess('updateAny', 'customer'), update)
router.delete('/:id', grantAccess('deleteAny', 'customer'), remove)

export default router
