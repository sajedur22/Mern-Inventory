
import DataModel from '../../models/brand/BrandModel.js'
import {CreateService} from "../../services/common/CreateServices.js";
import {UpdateService} from "../../services/common/UpdateService.js";


export const BranController= {

    CreateBrand:async (req,res)=>{
        let Result= await CreateService(req,DataModel)
        res.status(200).json(Result)
    },
    UpdateBrand:async (req,res)=>{
        let Result= await UpdateService(req,DataModel)
        res.status(200).json(Result)
    },

}

