import mongoose, { Schema } from "mongoose";

const workspaceSchema = new Schema({

    name:{
       type:String,
       required:true,
       trim:true,
    },

    description:{
       type:String,
       trim:true,
    },

    color:{
        type:String,
        default:'#FF5733',
        trim:true,
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        trim:true,   
    },

    members:[
        {
        user: { type:mongoose.Schema.Types.ObjectId,ref:'User'},
        role: {
            type: String,
            enum:["member" , "owner", "admin", "viewer"],
            default:"member"
        },
        jointAt:{ type:Date, default:Date.now}

        }

    ],

    projects: { type:mongoose.Schema.Types.ObjectId,ref:'Projects'},

    createdAt:{
        type:Date,
        trim:true,
    },                                                                                                                                                                      
    
    updatedAt:{
        type:Date,
        trim:true,
    }
},
{
    timestamps: true,
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;