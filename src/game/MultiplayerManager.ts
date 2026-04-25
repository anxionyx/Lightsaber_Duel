import Peer, { DataConnection } from 'peerjs';

export class MultiplayerManager {
  private peer: Peer;
  private connection: DataConnection | null = null;
  public onData: (data: any) => void = () => {};
  public onConnected: () => void = () => {};
  public myId: string = '';

  constructor() {
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      this.myId = id;
      console.log('My peer ID is: ' + id);
    });

    this.peer.on('connection', (conn) => {
      this.setupConnection(conn);
    });
  }

  public connect(peerId: string) {
    const conn = this.peer.connect(peerId);
    this.setupConnection(conn);
  }

  private setupConnection(conn: DataConnection) {
    this.connection = conn;
    this.connection.on('open', () => {
      console.log('Connected to peer');
      this.onConnected();
    });
    this.connection.on('data', (data) => {
      this.onData(data);
    });
  }

  public send(data: any) {
    if (this.connection && this.connection.open) {
      this.connection.send(data);
    }
  }

  public getPeerId() { return this.myId; }
}
