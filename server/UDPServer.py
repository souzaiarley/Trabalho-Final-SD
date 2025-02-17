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
        self.requestCounter = 0

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
            request, clientAddr = self.server.getRequest()
            message = self.unpackMessage(request)

            # Apenas operações não idempotentes
            if message.methodID in ["createTask", "editTask", "deleteTask"]:
                # Verifica se a mensagem já foi processada
                if message.id in self.responseHistory:
                    print(f"Requisição duplicada (ID: {message.id}). Retornando resposta armazenada.")
                    reply = self.responseHistory[message.id]
                else:
                    # Processa a requisição normalmente e armazena a resposta
                    response = self.dispatcher.selectSkeleton(message)
                    reply = self.packMessage(response, message.id)
                    self.responseHistory.clear()
                    self.responseHistory[message.id] = reply
            else:
                # Processa normalmente operações idempotentes (getList, getTask)
                response = self.dispatcher.selectSkeleton(message)
                reply = self.packMessage(response, message.id)
                self.server.sendReply(reply, clientAddr)

            if self.requestCounter % 3 == 0 and self.requestCounter != 0:
                print(f"Simulating packet loss for request {self.requestCounter + 1}")
            else:
                self.server.sendReply(reply, clientAddr)

            self.requestCounter += 1
            # print("Request ", self.requestCounter, ", method: ", message.methodID)

if __name__ == '__main__':
    pr = ProcessRequests()
    pr.run()
