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
    
    def unpackMessage(self, request) -> Message:
        request = json.loads(request.decode())

        requestMessage = Message(
            request['id'],
            request['type'],
            request['objectRef'],
            request['message'],
            request['methodID'],
            request['args']
        )

        return requestMessage
    
    def packMessage(self, message: Message):
        return message.toJson()

    def run(self):
        while True:
            # Recebe a requisição
            request, clientAddr = self.server.getRequest()

            # Desempacota a mensagem
            message = self.unpackMessage(request)
            
            # Chama o despachante e recebe a resposta da requisição
            response = self.dispatcher.selectSkeleton(message)
            
            # Empacota a resposta
            reply = self.packMessage(response)
            
            # Envia a resposta
            self.server.sendReply(reply, clientAddr)


if __name__ == '__main__':
    pr = ProcessRequests()
    pr.run()