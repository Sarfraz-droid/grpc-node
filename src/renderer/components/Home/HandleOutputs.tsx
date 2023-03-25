import React from 'react';
import { IMessageAtom } from 'renderer/atoms/Messages.atom';

function ImageHandler({ data }: { data: IMessageAtom }) {
  const [image, setImage] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        setImage(e.target.result as string);
      }
    };

    if (!data.fileData?.path) return;

    fetch(data.fileData?.path)
      .then((res) => res.blob())
      .then((blob) => {
        reader.readAsDataURL(blob);
      });
  }, [data]);

  return (
    <div>{image && <img className="w-96 " src={image} alt="image" />}</div>
  );
}

function HandleOutputs({ data }: { data: IMessageAtom }) {
  return (
    <div>
      <div className="font-semibold">{data.messageType}</div>
      <div>
        {data.messageType === 'document' &&
          data.fileData?.type.startsWith('image') && (
            <ImageHandler data={data} />
          )}
      </div>
      <div>
        <div>{data.message}</div>
      </div>
    </div>
  );
}

export default HandleOutputs;
