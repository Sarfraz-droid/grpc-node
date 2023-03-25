import { connect } from 'http2';
import React from 'react';
import { useRecoilState } from 'recoil';
import { ConnectionAtom } from 'renderer/atoms/Connection.atom';

function ServerHeader() {
  const [connectionState, setConnectionState] = useRecoilState(ConnectionAtom);

  return (
    <div className="flex gap-3 self-center w-full bg-green-900 text-white/70 p-2">
      <p
        className={`
          self-center
              ${
                connectionState.server.status === 'stopped'
                  ? 'text-red-500'
                  : 'text-green-300'
              }
            `}
      >
        SERVER {connectionState.server.status.toUpperCase()}
      </p>
      <p className={`badge h-full self-center font-bold badge-accent`}>
        {!connectionState.server.port
          ? 'Not Running'
          : connectionState.server.port}
      </p>
      <button
        onClick={() => {
          window.GRPCconnection.createServer();
        }}
        className="btn btn-sm btn-accent"
        style={{
          display:
            connectionState.server.status === 'stopped' ? 'block' : 'none',
        }}

        
      >
        Start Server
      </button>
    </div>
  );
}

export default ServerHeader;
