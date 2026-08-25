import { generateToken } from "../utils/generateToken.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
export const signup = async (req, res) => {
  try {
    console.log("comming to user signup send otp");
    const { name, email, password } = req.body;
    console.log("data is ",name," ",email,", ",password,", ");
    if ((!name || !email, !password)) {
      return res.status(400).json({
        message: "All fields are requierd",
      });
    }

    //check user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // clear any previous unexpired OTP for this email
    await Otp.deleteMany({ email });
    //generate otp
    const otp = generateOtp();

    await Otp.create({ email, code: otp });

    await sendOtpEmail(email, otp);
     return res.status(200).json({
      message: 'OTP sent to your email. Verify to complete signup.',
    });
  } catch (err) {
    console.log("Error came in the signup ", err);
  }
};


// @route POST /api/user/verify-otp
// Frontend sends back name, email, password (held client-side) + otp
// User is actually created here, for the first time

export const verifyOtp = async (req,res) =>{
    try{

        console.log("Comming in verify-otp");
        const {name,email,password,otp} = req.body;
        console.log("req body is ","name ",name," email ",email," password ",password," otp ",otp);
        
        //check the fiels availability
        if(!name, !email, !password, !otp){
            res.status(400).json({
                message:"All fields are required"
            })
        }

        //check user exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User Already exist"
            })
        }

        //match the otp
        const matchOtp = await Otp.findOne({email,code:otp});
        if(!matchOtp){
            return res.status(400).json({
                message:"OTP is not matched..."
            })
        }

        //create user
        const newUser = await User.create({
            name,
            email,
            password,
            isVerified: true,
        })

        //clean up the otp
        await Otp.deleteMany({email});
        const token =   generateToken(newUser._id);
        return res.status(201).json({
            message:"User Created Succussfully",
            token,
        })

    }catch(err){
        console.log("Error occured in verify-top",err);
    }
}

