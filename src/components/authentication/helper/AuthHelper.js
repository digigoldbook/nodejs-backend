import jwt from 'jsonwebtoken';

// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader && authorizationHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: 'Access token is missing or invalid',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Access token has expired'
          : 'Failed to authenticate access token';

      return res.status(403).json({
        status: 403,
        message,
      });
    }

    req.user = decoded; // Store decoded token payload in req.user
    next(); // Proceed to the next middleware or route handler
  });
};

// Middleware to authorize roles
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        status: 403,
        message: 'Unauthorized access: insufficient role privileges',
      });
    }

    next(); // Proceed if the user's role is authorized
  };
};

// Middleware for centralized error handling
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    error: err.message,
  });
};

export { authenticateToken, authorizeRoles, errorHandler };
