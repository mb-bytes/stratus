const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const jobSchema = new Schema({
    company_name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ["offered", "rejected", "applied", "interviewed"],
    },
    notes:{
        type: String,
        required: false
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports= mongoose.model("Job", jobSchema);