from socket import *

class UdpServer:
    def __init__(self):
        self.serverPort = 12000
        self.serverSocket = socket(AF_INET, SOCK_DGRAM)
        self.serverSocket.bind(('', self.serverPort))
        print(f'Server running on port {self.serverPort}')
    
    def getRequest(self):
        request, clientAddr = self.serverSocket.recvfrom(1024)
        return request, clientAddr
    
    def sendResponse(self, response, clientAddr):
        self.serverSocket.sendto(response, clientAddr)

    def close(self):
        self.serverSocket.close()


if __name__ == '__main__':
    server = UdpServer()
    
    while True:
        request, clientAddr = server.getRequest()
        print(f'Request from {clientAddr}: {request}')
        response = request.upper()
        server.sendResponse(response, clientAddr)