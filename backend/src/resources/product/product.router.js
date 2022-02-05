import { Router } from 'express'
import { getOne, getAll, update, remove, create } from './product.controller'
import { grantAccess } from '../../roles/roles.middleware'

const router = new Router()
router.get('/:id', grantAccess('readAny', 'product'), getOne)
router.get('/all', grantAccess('readAny', 'product'), getAll)
router.put('/:id', grantAccess('updateAny', 'product'), update)
router.delete('/:id', grantAccess('deleteAny', 'product'), remove)
router.post('/', grantAccess('createAny', 'product'), create)

export default router
