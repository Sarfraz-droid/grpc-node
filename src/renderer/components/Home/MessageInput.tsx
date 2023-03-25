import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { MessagesAtom } from 'renderer/atoms/Messages.atom';

function MessageInput() {
  const [sendText, setSendText] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useRecoilState(MessagesAtom);
  const [ChosenFile, setChosenFile] = useState<File | null>(null);
  const [FileOpen, setFileOpen] = useState(false);

  return (
    <div className="flex gap-3 m-2">
      <input
        className="input flex-grow bg-gray-300/10"
        placeholder="Enter Text to Send"
        type="text"
        value={sendText}
        onChange={(e) => {
          setSendText(e.target.value);
        }}
      />
      <button
        className="btn"
        type="button"
        onClick={() => {
          try {
            // console.log(sendText);
            window.GRPCconnection.send(sendText);
            setMessages([
              {
                type: 'sent',
                message: sendText,
                messageType: 'text',
              },
              ...messages,
            ]);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        Send
      </button>

      <button
        type="button"
        className="btn btn-outline"
        onClick={() => {
          if (ref == null || ref.current === null) return;
          //   ref.current.click();
          setFileOpen(true);
        }}
      >
        Send FIle
      </button>

      <div className={`modal ${FileOpen && 'modal-open'}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Send File</h3>
          <p className="py-4">
            <input
              title="file-input"
              type="file"
              className="hidden"
              ref={ref}
              onChange={(e) => {
                console.log(e.target.files);
                const file = e.target.files?.item(0);
                console.log(file);
                if (file == null) return;
                setChosenFile(file);
              }}
            />

            <p className="py-2 text-center">
              {ChosenFile != null ? (
                <span>
                  {ChosenFile.name} - {ChosenFile.size} bytes
                </span>
              ) : (
                <div>
                  <span className="text-md opacity-70">
                    Choose a file to send
                  </span>
                </div>
              )}
            </p>
            <button
              type="button"
              className="btn btn-accent w-full"
              onClick={() => {
                if (ref == null || ref.current === null) return;
                ref.current.click();
              }}
            >
              Upload File
            </button>
          </p>
          <div className="modal-action">
            <button
              className="btn btn-outline btn-info"
              type="button"
              onClick={() => {
                if (ChosenFile == null) return;
                window.GRPCconnection.FileSend(ChosenFile);
                console.log(ChosenFile);
                setMessages([
                  {
                    type: 'sent',
                    message: `Sent File: ${ChosenFile.name}`,
                    messageType: 'document',
                    fileData: {
                      chunksLength: 0,
                      id: '',
                      len: 0,
                      name: ChosenFile.name,
                      size: ChosenFile.size,
                      type: ChosenFile.type,
                      path: ChosenFile.path,
                    },
                  },
                  ...messages,
                ]);
                setFileOpen(false);
              }}
            >
              Send
            </button>
            <a
              href="#"
              className="btn btn-ghost"
              onClick={() => {
                setFileOpen(false);
              }}
            >
              Close
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
