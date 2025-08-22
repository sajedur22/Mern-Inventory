
import DataModel from '../../models/brand/BrandModel.js'
import {CreateService} from "../../services/common/CreateServices.js";
import {UpdateService} from "../../services/common/UpdateService.js";
import {ListService} from "../../services/common/ListService.js";
import DropDownService from "../../services/common/DropDownService.js";
import CheckAssociateService from "../../services/common/CheckAssociateService.js";
import mongoose from "mongoose";
import DeleteService from "../../services/common/DeleteService.js";


export const BranController= {

    CreateBrand:async (req,res)=>{
        let Result= await CreateService(req,DataModel)
        res.status(200).json(Result)
    },
    UpdateBrand:async (req,res)=>{
        let Result= await UpdateService(req,DataModel)
        res.status(200).json(Result)
    },
    BrandList:async (req,res)=>{
        let SearchRgx = {"$regex": req.params.searchKeyword, "$options": "i"}
        let SearchArray=[{Name: SearchRgx}]
        let Result= await ListService(req,DataModel,SearchArray)
        res.status(200).json(Result)
    },
    BrandDropDown:async (req,res)=>{
        let Result= await DropDownService(req,DataModel,{_id:1,Name:1})
        res.status(200).json(Result)
    },
    DeleteBrand:async (req,res)=> {
    },

}

