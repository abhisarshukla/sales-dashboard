import { Router } from 'express'
import {
  me,
  updateMe,
  updateUser,
  getUsers,
  remove,
  getOne,
  toggleRole,
} from './user.controller'
import { grantAccess } from '../../roles/roles.middleware'

const router = new Router()

router.get('/', grantAccess('readOwn', 'profile'), me)
router.put('/', grantAccess('updateOwn', 'profile'), updateMe)
router.get('/all', grantAccess('readAny', 'user'), getUsers)
router.get('/:id', grantAccess('readAny', 'user'), getOne)
router.put('/:id', grantAccess('updateAny', 'user'), updateUser)
router.delete('/:id', grantAccess('deleteAny', 'user'), remove)
router.put('/toggleRole/:id', grantAccess('updateAny', 'user'), toggleRole)

export default router
