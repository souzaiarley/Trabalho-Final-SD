import * as dgram from 'dgram';

/*
client.on('error', (err: Error) => {
    console.error(`Erro no cliente: ${err.message}`);
    client.close();
});
*/

export default class UDPClient {
    socket: dgram.Socket | undefined;
    serverIP: string | undefined;
    serverPort: number | undefined;

    constructor(serverIP: string, serverPort: number) {
        try {
            this.socket = dgram.createSocket('udp4');
            this.serverIP = serverIP;
            this.serverPort = serverPort;
        }
        catch (err) {
            console.error(`Erro ao criar socket!`);
        }
    }

    sendRequest(request: Buffer) {
        this.socket?.send(request, this.serverPort, this.serverIP, (err) => {
            if (err) {
                console.error('Erro ao enviar mensagem:', err.message);
                this.socket?.close();
            }
        })
    }

    getReply(): Promise<Buffer> {
        return new Promise((resolve, _) => {
            this.socket?.on('message', (msg) => {
                this.socket?.close();
                resolve(msg);
            });
        });
    }
}
