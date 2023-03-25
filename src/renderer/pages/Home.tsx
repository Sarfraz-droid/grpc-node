import React, { useState } from 'react';
import { ClientHeader, ServerHeader } from '../components/Headers';
import MessageInput from 'renderer/components/Home/MessageInput';
import useIPCConnection from 'renderer/hooks/useConnection.ipc';
import { useRecoilValue } from 'recoil';
import { MessagesAtom } from 'renderer/atoms/Messages.atom';
import HandleOutputs from 'renderer/components/Home/HandleOutputs';

function Home() {
  const Messages = useRecoilValue(MessagesAtom);

  useIPCConnection();

  return (
    <div>
      <ServerHeader />
      <ClientHeader />
      <MessageInput />
      <div className="w-full">
        {Messages.map((msg) => {
          if (msg.type === 'sent') {
            return (
              <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-primary">
                  <HandleOutputs data={msg} />
                </div>
              </div>
            );
          } else if (msg.type === 'received') {
            if (msg.messageType === 'document') {
              return (
                <div className="chat chat-start">
                  <div className="chat-bubble">
                    <HandleOutputs data={msg} />
                  </div>
                </div>
              );
            }

            return (
              <div className="chat chat-start">
                <div className="chat-bubble">
                  <HandleOutputs data={msg} />
                </div>
              </div>
            );
          }

          return <div className="text-center">{msg.message}</div>;
        })}
      </div>
    </div>
  );
}

export default Home;
