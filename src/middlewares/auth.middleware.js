import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const authorization = req.get('Authorization');
  const match = authorization?.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ message: 'Token de autenticación requerido' });
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error('La variable JWT_SECRET no está configurada'));
  }

  try {
    req.usuario = jwt.verify(match[1], process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    return next(error);
  }
}
