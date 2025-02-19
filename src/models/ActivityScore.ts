import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";

export interface ActivityScoreDocument extends Document {
  client : UserDocument,
    "Starring score" : {
        Equifax : number,
        Experian : number, 
        TransUnion : number
    } | null,
    "End score" : {
        Equifax : number,
        Experian : number, 
        TransUnion : number
    },
    "Score Increase" : {
        Equifax : number,
        Experian : number, 
        TransUnion : number
    } 
}

const ActivityScoreSch = new Schema<ActivityScoreDocument>({
  client: { type: Schema.Types.ObjectId, ref: "client", required: true },
  "Starring score" : {
    type : {

        Equifax : {type : Number},
        Experian : {type : Number}, 
        TransUnion : {type : Number},
    },
        default : null
        
    },
    "End score" : {
        Equifax : {type : Number},
        Experian : {type : Number}, 
        TransUnion : {type : Number}
    },
    "Score Increase" : {
        Equifax : {type : Number},
        Experian : {type : Number}, 
        TransUnion : {type : Number}
    }
});

export default mongoose.model<ActivityScoreDocument>("ActivityScore", ActivityScoreSch);
