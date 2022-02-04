import { AccessControl } from 'accesscontrol'
const ac = new AccessControl()

ac.grant('seller')
  .createAny('order')
  .updateAny('order')
  .deleteAny('order')
  .readAny('order')
  .createAny('customer')
  .updateAny('customer')
  .deleteAny('customer')
  .readAny('customer')
  .updateOwn('profile', ['firstname', 'lastname', 'password', 'email'])
  .readOwn('profile')

ac.grant('curator')
  .createAny('product')
  .updateAny('product')
  .deleteAny('product')
  .readAny('product')
  .updateOwn('profile', ['firstname', 'lastname', 'password', 'email'])
  .readOwn('profile')

ac.grant('admin')
  .extend('seller')
  .extend('curator')
  .updateAny('user')
  .deleteAny('user')
  .readAny('user')

export default ac
