import jwt from  'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Unauthorized', success: false });
        
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        
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