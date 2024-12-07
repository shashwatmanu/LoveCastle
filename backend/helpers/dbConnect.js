import mongoose from "mongoose"

const uri = process.env.MONGO_URI;

export default mongoose.connect(uri).then(()=> console.log('DB connected'))