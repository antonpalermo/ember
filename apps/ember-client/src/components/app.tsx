import React from "react";

const stunServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" }
];

export default function App() {
  const wsClient = new WebSocket("ws://localhost:8080");
  const peerConnection = new RTCPeerConnection({ iceServers: stunServers });

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
        audio: {
          echoCancellation: true
        }
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

    if (wsClient.OPEN) {
      wsClient.onmessage = async e => {
        const message = JSON.parse(e.data);
        if (message.event === "offer:response") {
          peerConnection.setRemoteDescription(
            new RTCSessionDescription(message.offer)
          );

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          wsClient.send(JSON.stringify({ event: "answer:request", answer }));
        }
      };
    }
    
    getMediaStream();

    // return () => {
    //   wsClient.close();
    // };
  }, []);

  async function makeCall() {
    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    wsClient.send(JSON.stringify({ event: "offer:request", offer }));
  }

  return (
    <div>
      <p>{JSON.stringify(mediaDetails)}</p>
      <button onClick={makeCall}>Make Call</button>
      <video ref={videoPlaceholder} autoPlay playsInline controls={false} />
    </div>
  );
}
