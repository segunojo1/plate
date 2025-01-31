"use client"
import React, { useContext, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import ChatBotContext from "@/context/ChatBotContext";
import Image from "next/image";
import ChatHeader from "@/modules/chat/ChatHeader";
import ChatQuestions from "@/modules/chat/ChatQuestions";
import ChatInput from "@/modules/chat/ChatInput";
import ChatMessages from "@/modules/chat/ChatMessages";
import Link from "next/link";
import Cookies from "js-cookie";
import withAuth from "../helpers/withAuth";

const Chat = () => {
  const {
    userMessage,
    setUserMessage,
    chatLog,
    isContentReplaced,
    setIsContentReplaced,
    sendMessage,
    loading,
    containerRef,
  } = useContext(ChatBotContext);

  const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    Cookies.set('visited', 'true');
  }, [])

  return (
    <div>
      <MainLayout fixedTopbar activePage="chat" className=" overflow-y-hidden pb-3 " includeMarginTop>
        {!isContentReplaced ? (
          <div className="justify-between flex flex-col lg:min-h-[80vh] xl:min-h-[85vh]">
            <ChatHeader />
            <ChatQuestions
              isContentReplaced={isContentReplaced}
              setIsContentReplaced={setIsContentReplaced}
              sendMessage={sendMessage}
            />
            <div>

            <ChatInput
              userMessage={userMessage}
              handleMessage={handleMessage}
              handleEnter={handleEnter}
              sendMessage={sendMessage}
            />
            <p className="text-[14px] font-normal  mb-2 w-fit mx-auto">FoodieAI can make mistakes. Check important info.</p>
            </div>
          </div>
        ) : (
          <div className="md:p-8 flex flex-col justify-between ">
            <Link href="/scanner" className="left-0  absolute">
              <Image src="/tryscanner.svg" alt="multi line" height={141} width={100} className="" />
            </Link>
            <ChatMessages chatLog={chatLog} loading={loading} containerRef={containerRef} />
            <ChatInput
              userMessage={userMessage}
              handleMessage={handleMessage}
              handleEnter={handleEnter}
              sendMessage={sendMessage}
            />
            <p className="text-[14px] font-normal  mb-2 w-fit mx-auto">FoodieAI can make mistakes. Check important info.</p>
          </div>
        )} 
      </MainLayout>
    </div>
  );
};

export default withAuth(Chat);
