import UserModel from "../Models/User.Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../Utils/Cloudinary.js";
import getDataUri from "../Utils/DataUri.js";
import PostModel from "../Models/Post.Model.js";
import { sendResponse } from "../Utils/SendResponse.js";
import { GenerateOtp, ValidateOTP } from "../Services/User.Services.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("username", req.body);

    if (!username && !email && !password) {
      return res.status(401).json({
        message: "Please fill in all fields",
        success: false,
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        message: "Email already in use",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return sendResponse(res, 401, "Please fill in all fields", false);
      // return res.status(401).json({
      //   message: "Please fill in all fields",
      //   success: false,
      // });
    }
    let user = await UserModel.findOne({ email });
    if (!user) {
      return sendResponse(res, 401, "Incorrect email or password", false);
      // return res.status(401).json({
      //   message: "Incorrect email or password",
      //   success: false,
      // });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }

    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await PostModel.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        } else {
          return null;
        }
      })
    );
    let users = {
      id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profilePicture,
      followers: user.followers,
      following: user.following,
      post: populatedPost,
    };
    const token = jwt.sign({ userId: users.id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    if (token) {
      return res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000 * 1, //1 Day
        })
        .json({
          message: `${user.username} Logged in successfully`,
          success: true,
          user: users,
        });
    }
  } catch (error) {
    console.error(error);
  }
};

export const Logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const ForgetPassword = async (req, res) => {
  const email = req?.params?.email || req?.body?.email;
  const otp = req?.body?.otp;
  if (!email) {
    return sendResponse(res, 400, "Email is required", false, []);
  }
  if (otp === "") {
    const generateOtp = await GenerateOtp(email);
    if (generateOtp) {
      return sendResponse(res, 200, "Otp Send successfully", true, true);
    } else {
      return sendResponse(res, 400, "Error on Otp Send", false, []);
    }
  } else {
    const verifyOtp = await ValidateOTP({email, otp});
    console.log("verifyOtp", verifyOtp);
    if (verifyOtp) {
      return sendResponse(res, 200, "Otp verify successfully", true, true);
    } else {
      return sendResponse(res, 400, "Error on Otp verify", false, []);
    }
  }
};

export const ChangePassword = async (req, res) => {
  try {
    const { password, confirmPassword,email } = req.body;
    if(password !== confirmPassword){
      return sendResponse(res, 400, "Password and Confirm Password do not match", false, []);
    }
    else{
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.updateOne({
        email: email,
      }, {
        password: hashedPassword,
      });
      if(user.modifiedCount > 0){
        return sendResponse(res, 200, "Password changed successfully", true, []);
      }
      else{
        return sendResponse(res, 400, "Error on Password change", false, []);
      }

    }
  } catch (error) {
    console.log(error);  
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId)
      .select("-password")
      .populate({
        path: "posts",
        createdAt: -1,
      })
      .populate("bookmarks");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    console.log("userId", userId);
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await UserModel.find({ _id: { $ne: req.id } })
      .limit(5)
      .select("-password");
    if (!suggestedUser) {
      return res.status(400).json({
        message: "No users found",
        success: false,
      });
    } else {
      return res.status(200).json({
        suggestedUser,
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followkrneWala = req.id;
    const jiskoFollowKruga = req.params.id;

    if (followkrneWala === jiskoFollowKruga) {
      return res.status(400).json({
        message: "You can't follow yourself",
        success: false,
      });
    }

    const followKrneWalaUser = await UserModel.findById(followkrneWala);
    const jiskoFollowKrugaUser = await UserModel.findById(jiskoFollowKruga);

    if (!followKrneWalaUser || !jiskoFollowKrugaUser) {
      return res.status(404).json({
        message: "One or both users not found",
        success: false,
      });
    }

    const isFollowing = followKrneWalaUser.following.includes(jiskoFollowKruga);

    if (isFollowing) {
      await Promise.all([
        followKrneWalaUser.updateOne({
          $pull: { following: jiskoFollowKruga },
        }),
        jiskoFollowKrugaUser.updateOne({
          $pull: { followers: followkrneWala },
        }),
      ]);

      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      });
    } else {
      await Promise.all([
        followKrneWalaUser.updateOne({
          $push: { following: jiskoFollowKruga },
        }),
        jiskoFollowKrugaUser.updateOne({
          $push: { followers: followkrneWala },
        }),
      ]);

      return res.status(200).json({
        message: "Followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

export const SearchUser = async (req, res) => {
  try {
    let name = req.params.name;
    let allUser = await UserModel.find({
      username: { $regex: new RegExp(name), $options: "i" },
    }).populate({
      path: "posts",
      createdAt: -1,
    });
    console.log(allUser);
    return res.status(200).json({
      message: "User found",
      result: allUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
