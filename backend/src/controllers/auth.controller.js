import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";
import router from "../routes/auth.route.js";
import cloudinary from "../lib/cloudinary.js"; 


export const signup = async (req, res) => {
    const { fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" });
        }
        
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            });
        }else{
            return res.status(400).json({ message: "Invalid User data" });
        }
        
    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user =await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid Credentials"});
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            return res.status(400).json({ message: "Invalid Credentials"});
        }
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt","", {maxAge: 0})
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}



export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body; // ✅ Add this line
  
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json({ authUser: updatedUser }); 
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const checkAuth = async (req, res) => {     //check if the user is authenticated or not
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("error in checkAuth controller", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}