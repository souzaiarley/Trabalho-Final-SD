import json
import time
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
        self.historyTimeout = 60

    def cleanHistory(self):
        currentTime = time.time()

        self.responseHistory = {
            requestID: reply
            for requestID, reply in self.responseHistory.items()
            if currentTime - requestID <= self.historyTimeout
        }

    def unpackMessage(self, request: bytes) -> Message:
        request = json.loads(request.decode())
        args = request['args']
        message = Message(
            request['id'],
            request['type'],
            request['objectRef'],
            request['message'],
            request['methodID'],
            json.dumps(args).encode()  # Convert args to bytes
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
        jsonMessage = json.loads(message.toJson())  # Convert to dictionary
        jsonMessage['requestID'] = requestID  # Add requestID to the response
        return json.dumps(jsonMessage).encode()  # Convert back to string

    def run(self):
        while True:
            self.cleanHistory()
            request, clientAddr = self.server.getRequest()
            print(f'Received request from {clientAddr}')

            message = self.unpackMessage(request)
            print(f'Unpacked message: {message}')

            if message.id in self.responseHistory:
                print(f'Requisição duplicada {message.id}. Reenviando resposta...')
                reply = self.responseHistory[message.id]
            else:
                response = self.dispatcher.selectSkeleton(message)
                reply = self.packMessage(response, message.id)

                if message.methodID in ['createTask', 'editTask', 'deleteTask']:
                    self.responseHistory[message.id] = reply
                    print(f'Resposta armazenada no histórico para requisição {message.id}')

            self.server.sendReply(reply, clientAddr)
            print(f'Sent reply to {clientAddr}')


if __name__ == '__main__':
    pr = ProcessRequests()
    pr.run()
