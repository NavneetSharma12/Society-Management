import nodemailer from "nodemailer";
import OtpModel from "../Models/Otp.model.js";


export const GenerateOtp = async (email) => {
  const random = Math.floor(100000 + Math.random() * 900000);
  const expiry = Date.now() + 60000; // OTP expiry in 60 seconds
console.log("random", email);
  try {
    // Find if there is a previous OTP for the email
    let previousOtpData = await OtpModel.findOne({ email });

    // If previous OTP exists and has expired, delete it
    if (previousOtpData && Date.now() > previousOtpData?.detail?.expiry) {
      await OtpModel.deleteOne({ _id: previousOtpData._id });
    }

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "programmernavneet2002@gmail.com",
        pass: process.env.PERSONAL_EMAIL_PASSWORD,
      },
    });

    // Send OTP email
    const res = await transporter.sendMail({
      from: process.env.PERSONAL_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${random}. It is valid for 60 seconds.`,
    });

    if (res) {
      // Save new OTP to the database with expiry time
      await OtpModel.create({
        email,
        detail: {
          otp: random,
          expiry,
        },
      });

      console.log("sendMail", res);
      return true;
    }
  } catch (error) {
    console.error("Error generating OTP:", error);
    return false;
  }
};

export const ValidateOTP = async (req, res) => {
  const { email, otp } = req;

  if (!email || !otp) {
    console.log("Email and OTP are required");
    return false;
  }

  const record = await OtpModel.findOne({ email });
  if (!record) {
    console.log("Invalid or expired OTP");
    return false;
  }

  if (Date.now() > record?.detail?.expiry) {
    await OtpModel.deleteOne({ email });
    console.log("OTP expired");
    return false;
  }

  if (record?.detail?.otp !== otp) {
    console.log("OTP not verify");
    return false;
  }

  await OtpModel.deleteOne({ email });
  console.log("OTP Verified");
  return true;
};
