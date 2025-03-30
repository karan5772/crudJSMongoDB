import express from "express";
import db from "./db.js"
import User from "./dbModel.js"

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5001;

const tableFn=function(a){
    let n = a;
    let table = [];
    for (let i = 1; i <= 10; ++i)
        table.push(`${n} * ${i} = ${n * i}`);
    return table
}

app.get("/table",async(req,res)=>{
    const number = req.body.number;
    return res.send(tableFn(number));
})

app.post("/create", async (req,res) => {
    const { name,phone } = req.body;
    if (!name || !phone){
        return res.status(400).json({
            success : false,
            messege : "Enter both the feilds",
        })
    }

    try {
        const user = await User.create({
            name : name,
            phone,
        })
        return res.status(200).json({
            success : true,
            messege : "User created",
        })
    } 
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
})

app.get("/read", async (req,res) => {
    try {
        const users = await User.find();
        res.send(users);

    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }


})

app.post("/update", async (req,res) => {
    const { name,phone } = req.body;
    if (!name || !phone){
        return res.status(400).json({
            success : false,
            messege : "Enter both the feilds",
        })
    }

    try {
        const user = await User.findOne({name,phone});
        if(!user){
            return res.status(400).json({
                success : false,
                messege : "User does not exist",
            })
        }

        user.name=name,
        user.phone=phone,

        await user.save();

        return res.status(200).json({
            success : true,
            messege : "User has been updated",
        })
        
    } 
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
})

app.post("/delete", async (req,res) => {
    const { name,phone } = req.body;
    if (!name || !phone){
        return res.status(400).json({
            success : false,
            messege : "Enter both the feilds",
        })
    }

    try {
        const user = await User.findOneAndDelete({name,phone});
        if(!user){
            return res.status(400).json({
                success : false,
                messege : "User does not exist",
            })
        }

        if(user){
            return res.status(200).json({
                success : true,
                messege : "User hasbeen deleted",
            })
        }
        
    } 
    catch (error) {
        console.error("Error deleteing user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
})


db();

app.listen(port,()=>{
    console.log(`Server running on port : ${port}`)
})