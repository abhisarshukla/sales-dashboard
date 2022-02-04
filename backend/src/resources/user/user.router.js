import { Router } from 'express'
import { me, updateMe, updateUser, getUsers } from './user.controller'
import { grantAcess } from '../../roles/roles.middleware'

const router = new Router()

router.get('/', grantAcess('readOwn', 'profile'), me)
router.put('/', grantAcess('updateOwn', 'profile'), updateMe)
router.put('/:id', grantAcess('updateAny', 'user'), updateUser)
router.get('/all', grantAcess('readAny', 'user'), getUsers)

export default router
