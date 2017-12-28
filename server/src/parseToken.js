import { verifyToken } from './util/token'

export async function parseToken (req, res, next) {
  if (req.cookies && req.cookies.token) {
    try {
      req.token = await verifyToken(req.cookies.token)
    } catch (e) {}
  }
  next()
}
