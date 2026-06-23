import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadID, setNewChat, setPrompt, setReply, setCurrThreadID, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () =>{
        
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadID: thread.threadID, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch (err) {
            console,log(err);
            
        }
    };

    useEffect(() =>{
        getAllThreads();
    },[currThreadID])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadID(uuidv1());
        setPrevChats([]);

    }

const changeThread = async (newThreadId) => {
    setCurrThreadID(newThreadId);

    try {
        const response =  await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
        const res = await response.json();
        console.log(res);
        setPrevChats(res);
        setNewChat(false);
        setReply(null);
    } catch(err) {
        console.log(err);
    }
}

// const changeThread = async (newThreadId) => {
//     console.log("newThreadId =", newThreadId);

//     try {
//         const response = await fetch(
//             `http://localhost:8080/api/thread/${newThreadId}`
//         );

//         const res = await response.json();
//         console.log(res);
//     } catch(err) {
//         console.log(err);
//     }
// }


const deleteThread = async (threadId) =>{
    try {
       const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
       const res = await response.json();
       console.log(res);


       //updated threads re-render
       setAllThreads(prev => prev.filter(thread => thread.threadID !== threadId));

       if(threadId === currThreadID) {
        createNewChat();
       }



    } catch (err) {
        console.log(err);
    }
}

    return (
        <section className="sidebar">
            
             <button onClick={createNewChat}>
                <img src="src/assets/Black_logo.png" alt="AI Logo"className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
             </button>
           
               <ul className="history">
                    {
                        allThreads?.map((thread, idx) =>(
                            <li key={idx}
                              onClick={() => changeThread(thread.threadID)}
                              className={thread.threadID === currThreadID ? "highlighted": " "}
                              
                              >
                                
                              {thread.title}
                              <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                e.stopPropagation(); //Stop Event Bubbling
                                deleteThread(thread.threadID);
                              }}
                              ></i>
                             
                            </li>
                        ))
                    }
               </ul>
            
            <div className="sign">
                <p>By Gurjasmanpreet Singh &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;