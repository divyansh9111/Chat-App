import { createContext, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';
const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const[chats,setChats]=useState([]);
  const history = useHistory();
  useEffect(() => {
    const cookieData=Cookies.get('userInfo');
    const userInfo=cookieData&&JSON.parse(cookieData); 
    console.log("user"+userInfo);
    console.log("history"+history);
    setUser(userInfo);
    if (!userInfo&&history ) {
      history.push("/"); 
    }
  }, [history]);
  return (
    <chatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,Cookies }}>
      {children}
    </chatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(chatContext);
};

export default ChatProvider;
