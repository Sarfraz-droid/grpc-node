import React from 'react';
import { useRecoilValue } from 'recoil';
import { ConnectionAtom } from 'renderer/atoms/Connection.atom';

function ClientHeader() {
  const connectionState = useRecoilValue(ConnectionAtom);

  const [clientText, setClientText] = React.useState(0);

  return (
    <div className="flex gap-3 self-center w-full bg-orange-900 text-white/70 p-2">
      <p className="self-center">CLIENT</p>
      <form
        className="flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!connectionState.server.port) return;

          window.GRPCconnection.createClient(
            clientText,
            connectionState.server.port
          );
        }}
        style={{
          display:
            connectionState.client.status === 'stopped' ? 'flex' : 'none',
        }}
      >
        <input
          className="input input-sm bg-cyan-300/40 placeholder:text-white/70"
          placeholder="Enter Client Port"
          type="text"
          value={clientText}
          onChange={(e) => {
            setClientText(parseInt(e.target.value));
          }}
        />
        <button type="submit" className="btn btn-sm btn-accent">
          Connect
        </button>
      </form>

      <div
        style={{
          display:
            connectionState.client.status === 'stopped' ? 'none' : 'flex',
        }}
        className="flex gap-3 self-center"
      >
        <p>CONNECTED</p>
        <p className="badge badge-accent font-bold self-center">
          {connectionState.client.port}
        </p>
      </div>
    </div>
  );
}

export default ClientHeader;
