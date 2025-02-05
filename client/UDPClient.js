import dgram from 'dgram';

export default class UDPClient {

    constructor(serverIP, serverPort, timeout = 1000, maxRetries = 3) {
        try {
            this.socket = dgram.createSocket('udp4');
            this.serverIP = serverIP;
            this.serverPort = serverPort;
            this.timeout = timeout;
            this.maxRetries = maxRetries;
            this.lastRequest = null;
        }
        catch (err) {
            console.error(`Erro ao criar socket: ${err.message}`);
        }
    }

    sendRequest(request) {
        this.lastRequest = request;
        this.socket.send(request, this.serverPort, this.serverIP, (err) => {
            if (err) {
                console.error('Erro ao enviar mensagem:', err.message);
                this.socket.close();
            }
        })
    }

    getReply() {
        let attempt = 1;
        let received = false;

        return new Promise((resolve, reject) => {
            const waitReply = () => {
                if (attempt > this.maxRetries) {
                    reject(new Error("Máximo de tentativas atingido. Servidor não respondeu."));
                    return;
                }

                attempt++;

                const timeoutHandler = setTimeout(() => {
                    console.log("Timeout expirado, reenviando requisição...");
                    // Reenvia a última requisição
                    this.sendRequest(this.lastRequest); 
                    waitReply();
                }, this.timeout);

                this.socket.on('message', (msg) => {
                    received = true;
                    clearTimeout(timeoutHandler);
                    resolve(msg);
                });
            };

            waitReply();
        });
    }

    close() {
        this.socket.close();
    }
}
