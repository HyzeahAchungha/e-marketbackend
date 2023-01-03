const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userControler = {

    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await User.findOne({ email })
            if (user) return res.status(400).json({ msg: "The email already exists." })

            if (password.length < 6) {
                return res.status(400).json({ msg: "Password is at least 6 characters long." })
            }

            //password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new User({ name, email, password: passwordHash })


            // save mongodb
            await newUser.save()

            //then create jsonwebtoken to authenticate
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accesstoken })

        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },

    login: async (req, res) => {

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ msg: 'user does not exist' })
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ msg: 'Incorrect password' })

            }

            //if login success,create access token and refresh token

            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accesstoken })







        } catch (error) {
            return res.status().json({ msg: error.message })
        }
    },
    logout: async (req,res)=>{
try {
    res.clearCookie('refreshtoken', {path: "/user/refresh_token"})
    return res.json({msg:'Logged out'})

} catch (error) {
    return res.status(400).json({msg:error.message})
}
    },

    refreshtoken: (req, res) => {

        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) {
                return res.status(400).json({ msg: 'Please Login or Register' })
            }

            jwt.verify(rf_token, process.env.Refresh_Token_SECRET, (error, user) => {
                if (error) {
                    return res.status(400).json({ msg: 'Please Login or Register' })
                }
                const accesstoken = createAccessToken({ id: user.id })
                res.json({ accesstoken })
            })



        } catch (error) {
            return res.json({ msg: error.message })
        }


    },
    getUser:async (req,res)=>{
        try {
            const user = await User.findById(req.user.id).select('-password')
            if (!user) {
                return res.status(400).json({msg:"user does not exist"})
            }
            res.json(user)

        } catch (error) {
          return  res.status(500).json({msg:error.message})  
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.Access_Token_SECRET, { expiresIn: 'id' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.Access_Token_SECRET, { expiresIn: '7d' })
}

module.exports = userControler