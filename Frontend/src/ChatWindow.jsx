import "./ChatWindow.css";
import Chat from"./Chat.jsx"
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader} from "react-spinners";

function ChatWindow(){
  const {prompt, setPrompt, reply, setReply, currThreadID, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); //set default false value

  const getReply = async() =>{
    setLoading(true);
    setNewChat(false);
     const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: prompt,
        threadID: currThreadID
      })
     };

     try {
      const response =  await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
     } catch (err) {
      console.log(err)
     }
     setLoading(false)
  }
  //Append New chats to preview chats
  useEffect(() => {
    if(prompt && reply){
      setPrevChats(prevChats =>(
        [...prevChats, {
          role: "user",
          content: prompt
        },{
          role: "assistant",
          content: reply
        }]
      ));
    }

    setPrompt("");
  },  [reply]);


  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }


    return (
        <div className="chatwindow">
            <div className="navbar">
              <span>SmartChat AI <i class="fa-solid fa-angle-down"></i></span>
              <div className="usericondiv" onClick={handleProfileClick}>
                <span className="userIcon"><i className="fa-solid fa-user"></i></span>
              </div>
            </div>
            {
              isOpen && 
              <div className="dropDown">
                
                <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
                <div className="dropDownItem"><i class="fa-solid fa-right-from-bracket"></i> Log Out</div>
                
              </div>
            }
          <Chat></Chat>
          <ScaleLoader color="#fff" loading={loading}>

          </ScaleLoader>
          <div className="chatinput">
            <div className="inputbox">
                <input className="input" placeholder="Ask Anything" type="text"
                
                value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}

                />
                  
                <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
            </div>
               <p className="info">
                SmartChat AI can make mistakes. Check important info.
               </p>
          </div>
        </div>
    )
}

export default ChatWindow;