import * as dgram from 'dgram';

/*
client.on('error', (err: Error) => {
    console.error(`Erro no cliente: ${err.message}`);
    client.close();
});
*/

export class UdpClient {
    socket: dgram.Socket;
    serverIP: string;
    serverPort: number;

    constructor(serverIP: string, serverPort: number) {
        try {
            this.socket = dgram.createSocket('udp4');
            this.serverIP = serverIP;
            this.serverPort = serverPort;
        }
        catch (err) {
            console.error(`Erro ao criar socket: ${err.message}`);
        }
    }

    sendRequest(message: string) {
        const buffer = Buffer.from(message);

        this.socket.send(buffer, this.serverPort, this.serverIP, (err) => {
            if (err) {
                console.error('Erro ao enviar mensagem:', err.message);
                this.socket.close();
            }
        })
    }

    getReply(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.socket.on('message', (msg) => {
                this.socket.close();
                resolve(msg);
            });
        });
    }
}
