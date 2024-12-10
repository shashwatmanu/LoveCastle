import express from "express";
import cors from "cors";
import "dotenv/config.js";
import dbConnect from "./helpers/dbConnect.js";
import authRoute from "./routes/auth.routes.js"
import authenticate from "./middlewares/authenticate.js";
import userRoute from "./routes/user.routes.js"

const app = express();

try {
     await dbConnect;
     app.use(cors());
     app.use(express.json());

     app.use('/auth', authRoute);
     app.use(authenticate);
     app.use('/user', userRoute);


     app.listen(8080, ()=>{
        console.log('Backend running on 8080')
    })

} catch (error) {
    console.error(error)
}

