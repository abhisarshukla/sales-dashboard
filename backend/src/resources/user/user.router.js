import { Router } from 'express'
import { me, updateMe, updateUser, getUsers, remove } from './user.controller'
import { grantAccess } from '../../roles/roles.middleware'

const router = new Router()

router.get('/', grantAccess('readOwn', 'profile'), me)
router.put('/', grantAccess('updateOwn', 'profile'), updateMe)
router.get('/all', grantAccess('readAny', 'user'), getUsers)
router.put('/:id', grantAccess('updateAny', 'user'), updateUser)
router.delete('/:id', grantAccess('deleteAny', 'user'), remove)

export default router
