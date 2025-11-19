import jwt from 'jsonwebtoken'
const isAuth = async(req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message:"Token No Found!"})
        }
        const verifyToken=await jwt.verify(token,process.env.JWT_SECRET)
        req.userId=verifyToken.userId

        next()

    } catch (error) {
        console.log(error)
        return res.status(403).json({message: "Is Auth Error"})
    }
}

export default isAuth