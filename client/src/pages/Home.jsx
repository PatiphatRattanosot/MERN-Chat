import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useEffect, useState } from "react";

const Home = () => {
  const [user, setUser] = useState(null);
  const { selectedUser } = useChatStore();

  useEffect(() => {
    const fetchUser = async () => {
      await setUser(selectedUser);
    };
    fetchUser();
  }, [selectedUser]);
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {console.log(selectedUser)}
            {!user ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
