
import DataModel from "../../models/Users/UserModel.js";
import {UserCreateService} from "../../services/user/UserCreateService.js";



export const UserControllers={
    Registration:async (req, res) => {
        const result = await UserCreateService(req, DataModel);
        res.status(200).json(result);
    }
};

