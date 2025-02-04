import json
from socket import *
from Dispatcher import Dispatcher
from classes.Message import Message

class UDPServer:
    def __init__(self):
        self.serverPort = 12000
        self.serverSocket = socket(AF_INET, SOCK_DGRAM)
        self.serverSocket.bind(('', self.serverPort))
        print(f'Server running on port {self.serverPort}')
    
    def getRequest(self):
        request, clientAddr = self.serverSocket.recvfrom(1024)
        return request, clientAddr
    
    def sendReply(self, reply, clientAddr):
        self.serverSocket.sendto(reply, clientAddr)

    def close(self):    
        self.serverSocket.close()


class ProcessRequests:
    def __init__(self):
        self.server = UDPServer()
        self.dispatcher = Dispatcher()
        self.responseHistory = {}
    
    def unpackMessage(self, request: bytes) -> Message:
        request = json.loads(request.decode())

        args = bytes(request['args']['data'])

        message = Message(
            request['id'],
            request['type'],
            request['objectRef'],
            request['message'],
            request['methodID'],
            args
        )

        return message
    
    def packMessage(self, response: bytes, requestID: int) -> bytes:
        message = Message(
            requestID,
            'reply',
            '',
            '',
            '',
            response
        )

        jsonMessage = message.toJson()
        return jsonMessage.encode()


    def run(self):
        while True:
            # Recebe a requisição
            request, clientAddr = self.server.getRequest()
            # Desempacota a mensagem
            message = self.unpackMessage(request)

            # Verifica se a mensagem recebida é duplicada
            if message.id in self.responseHistory:
                # Reenvia a resposta armazenada
                print(f'Mensagem duplicada: {message.id}, reenviando resposta armazenada.')
                reply = self.responseHistory[message.id]
            else:
                # Chama o despachante e recebe a resposta da requisição
                response = self.dispatcher.selectSkeleton(message)
                # Empacota a resposta
                reply = self.packMessage(response, message.id)
                # Armazena a resposta no histórico para futuras duplicações
                self.responseHistory[message.id] = reply

            # Envia a resposta
            self.server.sendReply(reply, clientAddr)


if __name__ == '__main__':
    pr = ProcessRequests()
    pr.run()
