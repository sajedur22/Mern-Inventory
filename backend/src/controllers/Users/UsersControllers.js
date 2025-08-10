
import DataModel from "../../models/Users/UserModel.js";
import {UserCreateService} from "../../services/user/UserCreateService.js";
import {UserLoginService} from "../../services/user/UserLoginService.js"
import {UserUpdateService} from "../../services/user/UserUpdateService.js"
import CreateToken from "../../utility/CreateToken.js";


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

};

