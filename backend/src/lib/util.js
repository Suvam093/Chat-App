import jsonwebtoken from 'jsonwebtoken';

export const generateToken = (userId,res) => {

    const token = jsonwebtoken.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });

    

    res.cookie('jwt', token,{
        maxAge: 7*24*60*60*1000, // 7 days
        httpOnly: true, // prevent xss attacks cross site scripting attacks
        sameSite: 'strict', // prevent csrf attacks cross site request forgery attacks
        secure: process.env.NODE_ENV !== 'development', // only send cookie over https in production
    })

    return token;
}
