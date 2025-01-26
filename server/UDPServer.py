from socket import *

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


if __name__ == '__main__':
    server = UDPServer()
    
    while True:
        request, clientAddr = server.getRequest()
        print(f'Request from {clientAddr}: {request}')
        reply = request.upper()
        server.sendReply(reply, clientAddr)
