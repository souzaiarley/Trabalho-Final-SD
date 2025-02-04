import dgram from 'dgram';

export default class UDPClient {

    constructor(serverIP, serverPort) {
        try {
            this.socket = dgram.createSocket('udp4');
            this.serverIP = serverIP;
            this.serverPort = serverPort;
            this.timeout = 5000;
            this.maxRetransmissions = 3;
            this.pendingRequests = new Map();
        }
        catch (err) {
            console.error(`Erro ao criar socket: ${err.message}`);
        }
    }

    sendRequest(request, requestID) {
        this.pendingRequests.set(requestID, request);

        this._send(request, requestID);

        setTimeout(() => {
            if (this.pendingRequests.has(requestID)) {
                console.log(`Retransmitindo mensagem ${requestID}`);
                this._send(request, requestID);
            }
        }, this.timeout);
    }

    _send(request, requestID) {
        this.socket.send(request, this.serverPort, this.serverIP, (err) => {
            if (err) {
                console.error(`Erro ao enviar mensagem: ${err.message}`);
                this.socket.close();
            }
        });
    }

    getReply() {
        return new Promise((resolve, reject) => {
            this.socket.on('message', (msg) => {
                const response = JSON.parse(msg.toString());
                this.pendingRequests.delete(response.requestID);
                resolve(msg);
            });
            this.socket.on('error', (err) => {
                console.error('Erro ao enviar mensagem:', err.message);
                this.socket.close();
                reject(err);
            });
        });
    }

    close() {
        this.socket.close();
    }
}
