import jwt from  'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Fallback to cookie if no Authorization header
            const cookieToken = req.cookies.token;
            if (!cookieToken) {
                return res.status(401).json({ message: 'No token provided', success: false });
            }
            req.token = cookieToken;
        } else {
            // Extract token from Authorization header
            req.token = authHeader.split(' ')[1];
        }

        try {
            // Verify the token
            const decode = jwt.verify(req.token, process.env.SECRET_KEY);
            if (!decode || !decode.userId) {
                return res.status(401).json({ message: 'Unauthorized', success: false });
            }

            // Extract just the userId
            req.id = decode.userId;
            next();
        } catch (tokenError) {
            // If token is expired, try to use refresh token
            if (tokenError.name === 'TokenExpiredError') {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    return res.status(401).json({ 
                        message: 'Access token expired and no refresh token available', 
                        success: false,
                        tokenExpired: true
                    });
                }

                try {
                    // Verify refresh token
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
                    
                    // Generate new access token
                    const newAccessToken = jwt.sign(
                        { userId: decoded.userId },
                        process.env.SECRET_KEY,
                        { expiresIn: '1h' }
                    );

                    // Set new access token in cookie
                    res.cookie('token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 1000 // 1 hour
                    });

                    // Continue with the request using new token
                    req.id = decoded.userId;
                    next();
                } catch (refreshError) {
                    return res.status(401).json({ 
                        message: 'Invalid refresh token', 
                        success: false,
                        tokenExpired: true
                    });
                }
            } else {
                return res.status(401).json({ message: 'Invalid token', success: false });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}


export default isAuthenticated;