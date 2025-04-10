import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"; 

export const getUsersForSidebar = async(req , res) => {
    try {
        const loggedInUserId = req.user._id;       //Since this route is protected we can get the user id from the request object
        const filteredUser = await User.find({_id: {$ne: loggedInUserId}}).select("-password -__v -createdAt -updatedAt"); // get all the users except the logged in user and dont fetch the password and the createdAt and updatedAt fields
        
        res.status(200).json(filteredUser); 
    } catch (error) {
        console.log("error in getUsersForSidebar controller", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}


export const getMessages = async(req , res) => {

    try {
        const usertoChatId = req.params.id; // get the user id from the request params
        const myId = req.user._id; 

        const messages = await Message.find({
            $or:[
                { sender: myId, receiver: usertoChatId },
                { sender: usertoChatId, receiver: myId }
            ]
        })
        console.log("✅ Messages found:", messages.length);
        res.status(200).json(messages); 
    } catch (error) {
        console.log("error in getMessages controller", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }

}

export const sendMessage = async(req , res) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params;
        const senderId = req.user._id;

        let imageURL;
        if(image){
            // upload the image to cloudinary and get the url
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url; // get the secure url from the response
        }

        const newMessage = new Message({
            sender:senderId,
            receiver:receiverId,
            text,
            image:imageURL
        })
        await newMessage.save(); 

        //todo : realtime message sending using socket io will go here 

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("error in sendMessage controller", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}