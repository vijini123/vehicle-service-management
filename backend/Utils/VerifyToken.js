import jwt from 'jsonwebtoken'

export const VerifyToken = (req,res,next) => {
    const token = req.cookies.accessToken

    if(!token){
        return 
            res
            .status(401)
            .json({
                success:false, 
                message: "You're not authorize"
            })}
    
    //if token is exist then verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) =>{
        if(err){
            return 
            res
                .status(401)
                .json({
                    success:false, 
                    message: "Token is invalid"
                })
        }

        req.user = user
        next()
    })
}

export const VerifyUser = (req,res, next) => {
    VerifyToken(req,res,next,()=>{
        if(req.user.id === req.params.id || req.user.role === 'admin'){
            next()
        } else{
            return
            res
            .status(401)
            .json({
                success:false, 
                message: "You're not authenticated"
            })
        }
    })
}

export const VerifyAdmin = (req,res, next) => {
    VerifyToken(req,res,next,()=>{
        if(req.user.role === 'admin'){
            next()
        } else{
            return
            res
            .status(401)
            .json({
                success:false, 
                message: "You're not authorize"
            })
        }
    })
}