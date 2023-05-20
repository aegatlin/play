// This is from a previous attempt at a poc-webrtc-local app
// //
// import { uuid } from './uuid'

export class Wrtc {
  id: string;
  rtcPeerConnection: RTCPeerConnection;
  iceCandidates: RTCIceCandidate[];
  offer: RTCSessionDescriptionInit;
  dataChannel: RTCDataChannel;

  constructor(id: string) {
    if (!window) throw "no window";

    this.id = id;
    this.rtcPeerConnection = new window.RTCPeerConnection();

    this.iceCandidates = [];
    this.initIceCandidateEventListeners();

    this.dataChannel = this.rtcPeerConnection.createDataChannel(this.id);
    this.initLocalDataChannelListeners();
    this.initRemoteDataChannelListeners();
  }

  async createOffer() {
    const offer = await this.rtcPeerConnection.createOffer();
    await this.rtcPeerConnection.setLocalDescription(offer);
  }

  private initIceCandidateEventListeners() {
    if (!this.rtcPeerConnection) throw "no rtcPeerConnection";

    this.rtcPeerConnection.addEventListener("icecandidate", (e) => {
      console.log('ice candidate event: ", e');
      if (e.candidate) {
        this.iceCandidates.push(e.candidate);
      }
    });
  }

  /**
   * I think these listeners are listening to local message
   * events. Aka, they are not actually useful, but are
   * for logging/debugging.
   */
  private initLocalDataChannelListeners() {
    if (!this.dataChannel) throw "no data channel";

    this.dataChannel.addEventListener("open", (e) => {
      console.log("local datachannel open", e);
      this.dataChannel.send("hello from local");
    });

    this.dataChannel.addEventListener("message", (e) => {
      console.log("local message received", e, e.data);
    });
  }

  /**
   * I believe that once a 'datachannel' event is received,
   * it means that a remote connection has been established,
   * and therefore you:
   *
   * 1. have a data channel.
   * 2. Can add listeners to said channel
   * 3. Respond to 'message' events on said channel
   *
   * This function will need to get more sophisticated over time to
   * handle chats.
   */
  private initRemoteDataChannelListeners() {
    this.rtcPeerConnection.addEventListener("datachannel", (e) => {
      console.log("remote datachannel event: ", e);
      const dataChannel = e.channel;

      dataChannel.addEventListener("open", (e) => {
        console.log("remote datachannel open", e);
        dataChannel.send("hello from remote");
      });

      dataChannel.addEventListener("message", (e) => {
        console.log("remote message received", e, e.data);
      });
    });
  }
}

// interface Wurtsy {
//   id: string
//   pc: RTCPeerConnection
//   dataChannel: RTCDataChannel | null
//   offer: RTCSessionDescriptionInit | null
//   iceCandidates: RTCIceCandidate[]
// }

// export const Wurtsy = {
//   async new(window): Promise<Wurtsy> {
//     const wurtsy: Wurtsy = {
//       id: uuid(),
//       pc: new window.RTCPeerConnection(),
//       dataChannel: null,
//       offer: null,
//       iceCandidates: [],
//     }

//     // wurtsy.dataChannel = wurtsy.pc.createDataChannel(wurtsy.id)

//     // Internal.prepareRTCPeerConnectionListeners(wurtsy)
//     // Internal.prepareDataChannelListeners(wurtsy)

//     // wurtsy.offer = await wurtsy.pc.createOffer()
//     // await wurtsy.pc.setLocalDescription(wurtsy.offer)
//     return wurtsy
//   },
//   getShareable(wurtsy: Wurtsy): string {
//     return wurtsy.id
//   },
// }

// const Internal = {
//   prepareRTCPeerConnectionListeners(wurtsy: Wurtsy) {
//     wurtsy.pc.addEventListener('icecandidate', (e) => {
//       if (e.candidate) {
//         wurtsy.iceCandidates.push(e.candidate)
//       }
//     })

//     wurtsy.pc.addEventListener('datachannel', (e) => {
//       console.log('remote datachannel event', e)
//       const dataChannel = e.channel

//       dataChannel.addEventListener('open', (e) => {
//         console.log('remote datachannel open', e)
//         dataChannel.send('hello from remote')
//       })

//       dataChannel.addEventListener('message', (e) => {
//         console.log('remote message received', e, e.data)
//       })
//     })
//   },
//   prepareDataChannelListeners(wurtsy: Wurtsy) {
//     if (!wurtsy.dataChannel) throw 'No wurtsy data channel, but is required.'

//     wurtsy.dataChannel.addEventListener('open', (e) => {
//       if (!wurtsy.dataChannel) throw 'No wurtsy data channel, but is required.'
//       console.log('local datachannel open', e)
//       wurtsy.dataChannel.send('hello from local')
//     })

//     wurtsy.dataChannel.addEventListener('message', (e) => {
//       console.log('local message received', e, e.data)
//     })
//   },
// }
