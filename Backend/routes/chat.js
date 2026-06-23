import express from "express";
import Thread from "..//models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";

const router = express.Router();

//Test
router.post("/test" , async(req, res) =>{
    try {
        const thread = new Thread({
            threadID: "abc",
            title: "Testing New Thread 2"
        });
        
        const response = await thread.save();
        res.send(response);
    } catch (error) {
        console.log(err);
        res.response(500).json({error: "Failed to save in DB"})
    }
});

// Get all threads 
router.get("/thread", async(req, res) =>{
    try {
        const threads = await Thread.find({}).sort({updatedAt: -1});
        // Need Threads in decsending order of updatedAt ... Most recent data on top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.response(500).json({error: "Error to fetch Threads"})
    }
});

router.get("/thread/:threadId", async(req, res) =>{
    const{threadId} = req.params;

    try {
    const thread = await Thread.findOne({threadID: threadId});

    if(!thread){
        res.status(404).json({error: "Thread is not found"})
    }

     res.json(thread.messages);
     
    } catch(err){
     console.log(err);
    res.status(500).json({error: "Error to fetch Chat"})
    }
});

router.delete("/thread/:threadID", async(req, res) =>{
    const {threadID} = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({threadID});

        if(!deletedThread) {
             return res.status(404).json({error: "Thread could not be deleted"})
        }

        res.status(200).json({success: "Thread delete successfully"});

    } catch (err) {
        console.log(err);

        res.status(500).json({error: "Error to delete Thread"});
    }
});

router.post("/chat", async(req, res) => {
    const {threadID, message} = req.body;
    
    if(!threadID || !message) {
        res.status(400).json({error: "Missing required fields"})
    }
    try {
        let thread = await Thread.findOne({threadID});
        if(!thread) {
            //Create anew thread in db
            thread = new Thread({
                threadID,
                title: message,
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message})
        }


        const assistantReplay =  await getGeminiAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReplay});
        thread.updatedAt = new Date();
        await thread.save()
        res.json({reply: assistantReplay});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
})

export default router;