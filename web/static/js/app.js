// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

let channel = socket.channel("call", {})
channel.join()
  .receive("ok", () => { console.log("Successfully joined call channel!")})
  .receive("ok", () => { console.log("Unable to join...")})

let localStream, peerConnection;
let localAudio = document.getElementById("localAudio");
let remoteAudio = document.getElementById("remoteAudio");
let connectButton = document.getElementById("connect");
let callButton = document.getElementById("call");
let hangupButton = document.getElementById("hangup");

hangupButton.disabled = false;
callButton.disable = true;
connectButton.onclick = connect;
callButton.onclick = call;
hangupButton.onclick = hangup;

channel.on("message", () => {
  let message = JSON.parse(payload.body);
  if (message.sdp) {
    gotRemoteDescription(message);
  } else {
    gotRemoteIceCandidate(message);
  }
})

function hangup() {
  console.log("Ending call");
  peerConnection.close();
  localAudio.src = null;
  peerConnection = null;
  hangupButton.disabled = true;
  connectButton.disable = false;
  callButton.disabled = true;
}

function handleError(error) {
  console.log(error.name + ": " + error.message);
}

function connect() {
  console.log("Requesting local stream");
  navigator.getUserMedia({audio: true}, gotStream, error => {
    console.log("getUserMedia error: ", error);
  });
}

function gotStream(stream) {
  console.log("Recieved local stream");
  localAudio.src = URL.createObjectURL(stream);
  localStream = stream;
  setupPeerConnection();
}

function setupPeerConnection() {
  connectButton.disabled = true;
  callButton.disabled = false;
  hangupButton.disabled = false;
  console.log("Waiting for call");

  let servers = {
    "iceServers": [{
      "url": "stun:stun.example.org"
    }]
  }

  peerConnection = new RTCPeerConnection(servers)
  console.log("Created local peer connection");
  peerConnection.onicecandidate = gotLocalIceCandidate;
  peerConnection.onaddstream = gotRemoteStream;
  peerConnection.addStream(localStream);
  console.log("Added local Stream to localPeerConnection");
}

function call() {
  callButton.disable = true;
  console.log("Starting call");
  peerConnection.createOffer(gotLocalDescription, handleError);
}

function gotLocalDescription(description) {
  peerConnection.setLocalDescription(description, () => {
    channel.push("message", {body: JSON.stringify({
      "sdp": peerConnection.localDesciption
    })});
  }, handleError);
  console.log("Offer from localPeerConnection: \n" + description.sdp);
}

function gotRemoteDescription(description){
  console.log("Answer from remotePeerConnection: \n" + description.sdp);
  peerConnection.setRemoteDescription(new RTCSessionDescription(description.sdp));
  peerConnection.createAnswer(gotLocalDescription, handleError);
}

function gotRemoteStream(event) {
  remoteAudio.src = URL.createObjectURL(event.stream);
  console.log("Received remote stream");
}

function gotLocalIceCandidate(event) {
  if (event.candidate) {
    console.log("Local ICE candidate: \n" + event.candidate.candidate);
    channel.push("message", {body: JSON.stringify({
      "candidate": event.candidate
    })})
  }
}

function gotRemoteIceCandidate(event) {
  callButton.disabled = true;
  if (event.candidate) {
    peerConnection.addIceComponent(new RTCIceCandidate(event.candidate));
    console.log("Remote ICE candidate: \n", event.candidate);
  }
}