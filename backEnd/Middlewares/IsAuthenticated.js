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

        // Verify the token
        const decode = jwt.verify(req.token, process.env.SECRET_KEY);
        if (!decode || !decode.userId) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        // Extract just the userId
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}


export default isAuthenticated;