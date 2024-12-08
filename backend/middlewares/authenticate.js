import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;


export default function (req, res, next) {
    const token = req.header("Authorization");
    // console.log(req.header("Authorization"))
    if(!token) return res.status(401).json({error: "Access denied"});
    try {
        const user = jwt.verify(token, jwtSecret);
        // console.log(user.id);
        req.user= {
            _id: user.id
        }
        next()
    } catch (error) {
        res.status(401).json({error: 'Invalid token'})
    }
}