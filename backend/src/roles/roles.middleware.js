import roles from './roles'

export const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource)
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        })
      }
      req.permission = permission
      next()
    } catch (error) {
      next(error)
    }
  }
}
