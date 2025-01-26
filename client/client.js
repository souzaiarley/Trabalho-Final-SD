"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpClient = void 0;
var dgram = require("dgram");
/*
client.on('error', (err: Error) => {
    console.error(`Erro no cliente: ${err.message}`);
    client.close();
});
*/
var UdpClient = /** @class */ (function () {
    function UdpClient(serverIP, serverPort) {
        try {
            this.socket = dgram.createSocket('udp4');
            this.serverIP = serverIP;
            this.serverPort = serverPort;
        }
        catch (err) {
            console.error("Erro ao criar socket: ".concat(err.message));
        }
    }
    UdpClient.prototype.sendRequest = function (message) {
        var _this = this;
        var buffer = Buffer.from(message);
        this.socket.send(buffer, this.serverPort, this.serverIP, function (err) {
            if (err) {
                console.error('Erro ao enviar mensagem:', err.message);
                _this.socket.close();
            }
        });
    };
    UdpClient.prototype.getReply = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.socket.on('message', function (msg) {
                _this.socket.close();
                resolve(msg);
            });
        });
    };
    return UdpClient;
}());
exports.UdpClient = UdpClient;
/*
const client = new UdpClient('localhost', 12000);

client.sendRequest('Hello, server!');

client.getReply().then((msg) => {
    console.log(msg);
    return msg.toString();
}).then((msg) => {
    console.log(typeof msg);
});

*/ 
