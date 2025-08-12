
import DataModel from "../../models/Users/UserModel.js";
import {UserCreateService} from "../../services/user/UserCreateService.js";
import {UserLoginService} from "../../services/user/UserLoginService.js"
import {UserUpdateService} from "../../services/user/UserUpdateService.js"
import {UserDetailsService} from "../../services/user/UserDetailsService.js";
import CreateToken from "../../utility/CreateToken.js";
import {UserVerifyEmailService} from "../../services/user/UserVerifyEmailService.js";
import {UserVerifyOtpService} from "../../services/user/UserVerifyOtpService.js";
import OTPSModel from "../../models/Users/OTPSModel.js";
import {UserResetPassService} from "../../services/user/UserResetPassService.js";



export const UserControllers={
    Registration:async (req, res) => {
        const result = await UserCreateService(req, DataModel);
        res.status(200).json(result);
    },
    Login:async (req,res)=>{
        try {
            const user = await UserLoginService(req.body.email, req.body.password, DataModel);

            if (!user) {
                return res.status(401).json({ status: "unauthorized" });
            }


            const token = CreateToken(user.email);


            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });


            res.set("Authorization", `Bearer ${token}`);


            return res.status(200).json({
                status: "success",
                token,
                data: user,
            });
        } catch (error) {
            return res.status(500).json({
                status: "fail",
                data: error.toString(),
            });
        }
    },
    ProfileUpdate:async (req,res)=>{
        let Result=await UserUpdateService(req,DataModel)
        res.status(200).json(Result)
    },
    ProfileDetails:async (req,res)=>{
        let Result=await UserDetailsService(req,DataModel)
        res.status(200).json(Result)
    },
    RecoverVerifyEmail:async (req,res)=>{
        let Result=await UserVerifyEmailService(req,DataModel)
        res.status(200).json(Result)
    },
    RecoverVerifyOTP: async (req, res) => {
        const jwtSecret = process.env.JWT_SECRET;
        const result = await UserVerifyOtpService(req, OTPSModel, jwtSecret);

        if (result.status === "success") {
            res.cookie('resetToken', result.data.resetToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000,
                sameSite: 'lax',
            });
            return res.status(200).json({ status: 'success', data: 'OTP verified and reset token set in cookie' });
        } else {
            return res.status(400).json(result);
        }
    },
    RecoverResetPass:async (req,res)=>{
        try {
            const jwtSecret = process.env.JWT_SECRET; // or wherever you keep it
            const result = await UserResetPassService(req, DataModel, jwtSecret);

            if (result.status === 'success') {
                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            return res.status(500).json({ status: 'fail', data: error.toString() });
        }
    },
};

