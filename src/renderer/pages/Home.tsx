import React, { useEffect, useState } from 'react';
import { IPCChannels } from 'utils/constants';

function Home() {
  const [ServerStatus, setServerStatus] = useState({
    status: 'stopped',
    port: 0,
  });

  const [ClientStatus, setClientStatus] = useState({
    status: 'stopped',
    port: 0,
  });

  const [ClientText, setClientText] = useState(0);

  const [sendText, setSendText] = useState('');

  const [Messages, setMessages] = useState([] as any[]);

  useEffect(() => {
    if (!window.electron.ipcRenderer)
      console.log('ipcRenderer is not available');
    window.electron.ipcRenderer.on(
      IPCChannels.ServerStatus,
      (event: any, arg) => {
        console.log(arg);
        console.log(event);

        if (event.status) {
          setServerStatus({
            status: event.status,
            port: event.port,
          });
        }
      }
    );

    return () => {
      window.electron.ipcRenderer.removeAllListeners(IPCChannels.ServerStatus);
    };
  }, []);

  useEffect(() => {
    if (!window.electron.ipcRenderer)
      console.log('ipcRenderer is not available');
    window.electron.ipcRenderer.on(
      IPCChannels.ClientStatus,
      (event: any, arg) => {
        console.log(arg);
        console.log(event);
        setMessages((prev) => [...prev, event]);
        setClientStatus({
          status: event.status,
          port: event.port,
        });
      }
    );

    return () => {
      window.electron.ipcRenderer.removeAllListeners(IPCChannels.ClientStatus);
    };
  }, []);

  useEffect(() => {
    if (!window.electron.ipcRenderer)
      console.log('ipcRenderer is not available');

    window.electron.ipcRenderer.on(IPCChannels.Join, (event: any, arg) => {
      console.log(arg);
      console.log(event);
      setMessages((prev) => [...prev, event]);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners(IPCChannels.Join);
    };
  }, []);

  useEffect(() => {
    if (!window.electron.ipcRenderer)
      console.log('ipcRenderer is not available');

    window.electron.ipcRenderer.on(IPCChannels.Send, (event: any, arg) => {
      console.log(arg);
      console.log(event);
      setMessages((prev) => [...prev, event]);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners(IPCChannels.Send);
    };
  }, []);

  return (
    <div>
      <div>
        <p>Server Status: {ServerStatus.status}</p>
        <p>Server Port: {ServerStatus.port}</p>
      </div>
      <button
        onClick={() => {
          window.GRPCconnection.createServer();
        }}
      >
        Start Server
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          window.GRPCconnection.createClient(ClientText, ServerStatus.port);
        }}
      >
        <input
          placeholder="Enter Client Port"
          type="text"
          onChange={(e) => {
            setClientText(parseInt(e.target.value));
          }}
        />
        <button className="btn">Connect</button>
      </form>

      <input
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
            setMessages((prev) => [...prev, { message: sendText }]);
            window.GRPCconnection.send(sendText);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        Send
      </button>
      <div>
        {Messages.map((msg) => {
          return <p>{msg.message}</p>;
        })}
      </div>
    </div>
  );
}

export default Home;
