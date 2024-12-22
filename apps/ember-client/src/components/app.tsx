import React from "react";

export default function App() {
  const [mediaDetails, setMediaDetails] = React.useState({
    audio: {
      id: "",
      label: ""
    },
    video: {
      id: "",
      label: ""
    }
  });

  const videoPlaceholder = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    async function getMediaStream() {
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      const tracks = media.getTracks();

      const videoDetails = tracks.find(x => x.kind === "video");
      const audioDetails = tracks.find(x => x.kind === "audio");

      if (videoDetails && audioDetails)
        setMediaDetails(currentMedia => ({
          ...currentMedia,
          video: { id: videoDetails.id, label: videoDetails.label },
          audio: { id: audioDetails.id, label: audioDetails.label }
        }));

      if (videoPlaceholder.current) {
        videoPlaceholder.current.srcObject = media;
      }
    }

    getMediaStream();
  }, []);

  return (
    <div>
      <p>{JSON.stringify(mediaDetails)}</p>
      <video ref={videoPlaceholder} autoPlay playsInline controls={false} />
    </div>
  );
}
