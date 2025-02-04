import dgram from 'dgram';

export default class UDPClient {

    constructor(serverIP, serverPort) {
        try {
            this.socket = dgram.createSocket('udp4');
            this.serverIP = serverIP;
            this.serverPort = serverPort;
        }
        catch (err) {
            console.error(`Erro ao criar socket: ${err.message}`);
        }
    }

    sendRequest(request) {
        this.socket.send(request, this.serverPort, this.serverIP, (err) => {
            if (err) {
                console.error('Erro ao enviar mensagem:', err.message);
                this.socket.close();
            }
        })
    }

    getReply() {
        return new Promise((resolve, reject) => {
            this.socket.on('message', (msg) => {
                resolve(msg);
            });
            this.socket.on('error', (err) => {
                this.socket.close();
                reject(err);
            });
        });
    }

    close() {
        this.socket.close();
    }
}
