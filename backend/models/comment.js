import mongoose, {Schema} from "mongoose";


const commentSchema = new Schema({
    text:{
        type:String,
        trim:true,
        required: true,
    },
    task:{
        type:Schema.Types.ObjectId,
        ref:"Task",
        required:true,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    mentions:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"User",
            },
            offset:{
                type:Number,

            },
            length:{
                type:Number,
            }
        }
    ],
    reactions:[
        {
            emoji: {
                type: String,
                trim: true,
            },
            user:{
                type:Schema.Types.ObjectId,
                ref:"User",

            }
        }
    ],
    attachments:[
        {
            fileName:{
                type:String,
            },
            fileUrl:{
                type:String,
            },
            fileType:{
                type:String,
            },
            fileSize:{
                type:Number
            },
        }
    ],
    isEdited:{
        type:Boolean,
        default:false
    }
}, {
  timestamps: true // tự động thêm createdAt, updatedAt
});

module.exports = mongoose.model("Comment", commentSchema);
export default Comment;