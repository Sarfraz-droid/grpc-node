import { useEffect } from 'react';
import { IPCChannels } from 'utils/constants';
import { useRecoilState } from 'recoil';
import { ConnectionAtom } from 'renderer/atoms/Connection.atom';
import { MessagesAtom } from 'renderer/atoms/Messages.atom';

function useIPCConnection() {
  const [connectionState, setConnectionState] = useRecoilState(ConnectionAtom);
  const [messagesState, setMessages] = useRecoilState(MessagesAtom);

  useEffect(() => {
    if (!window.electron.ipcRenderer)
      console.log('ipcRenderer is not available');
    window.electron.ipcRenderer.on(
      IPCChannels.ServerStatus,
      (event: any, arg) => {
        console.log(arg);
        console.log(event);

        if (event.status) {
          //   setServerStatus({
          //     status: event.status,
          //     port: event.port,
          //   });
          setConnectionState((prev) => {
            return {
              ...prev,
              server: {
                status: event.status,
                port: event.port,
              },
            };
          });
        }
      }
    );

    return () => {
      window.electron.ipcRenderer.removeAllListeners(IPCChannels.ServerStatus);
    };
  }, [connectionState]);

  useEffect(() => {
    if (!window.electron.ipcRenderer)
      console.log('ipcRenderer is not available');
    window.electron.ipcRenderer.on(
      IPCChannels.ClientStatus,
      (event: any, arg) => {
        console.log(arg);
        console.log(event);
        setMessages((prev) => {
          return [
            {
              type: 'info',
              message: event.message,
              messageType: 'text',
            },
            ...prev,
          ];
        });
        // setClientStatus({
        //   status: event.status,
        //   port: event.port,
        // });

        setConnectionState((prev) => {
          return {
            ...prev,
            client: {
              status: event.status,
              port: event.port,
            },
          };
        });
      }
    );

    return () => {
      window.electron.ipcRenderer.removeAllListeners(IPCChannels.ClientStatus);
    };
  }, [connectionState]);

  useEffect(() => {
    if (!window.electron.ipcRenderer)
      console.log('ipcRenderer is not available');

    window.electron.ipcRenderer.on(IPCChannels.Join, (event: any, arg) => {
      console.log(arg);
      console.log(event);
      setMessages((prev) => [
        {
          type: 'info',
          message: event.message,
          messageType: 'text',
        },
        ...prev,
      ]);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners(IPCChannels.Join);
    };
  }, [connectionState]);

  useEffect(() => {
    if (!window.electron.ipcRenderer)
      console.log('ipcRenderer is not available');

    window.electron.ipcRenderer.on(IPCChannels.Send, (event: any, arg) => {
      console.log(arg);
      console.log(event);
      setMessages((prev) => [
        {
          type: 'received',
          message: event.message,
          messageType: 'text',
        },
        ...prev,
      ]);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners(IPCChannels.Send);
    };
  }, [connectionState]);

  useEffect(() => {
    if (!window.electron.ipcRenderer)
      console.log('ipcRenderer is not available');

    window.electron.ipcRenderer.on(IPCChannels.Documents, (event: any, arg) => {
      console.log(arg);
      console.log(event);
      const { id, fileData, name } = event;
      setMessages((prev) => [
        {
          type: 'received',
          messageType: 'document',
          message: name,
          fileData,
          id,
        },
        ...prev,
      ]);
    });
  }, []);
}

export default useIPCConnection;
