import { Message } from './classes/Message'
import { UDPClient } from './UDPClient'

export class TaskListProxy {
    // Contador de requisições
    requestID: number;

    // Cliente UDP
    client: UDPClient;

    constructor(serverIP: string, serverPort: number) {
        this.requestID = 0;
        this.client = new UDPClient(serverIP, serverPort);
    }

    async getList(): Promise<Object> {
        // Método sem argumentos
        const args = {};

        try {
            // Chama doOperation com os argumentos empacotados
            const response = await this.doOperation('TaskList', 'getList', JSON.stringify(args));
            
            // Desempacota o argumento da resposta
            const data = JSON.parse(response);
            
            // Retorna a resposta desempacotada
            return data['tasklist'];
        }
        catch (error) {
            return error;
        }
    }

    async doOperation(objectRef: string, method: string, args: string): Promise<string> {
        const request: string = this.packMessage(objectRef, method, args);
        
        // Envia a mensagem para o servidor
        this.client.sendRequest(request);
        
        // Recebimento
        try {
            // Obtem a resposta
            const buffer = await this.client.getReply();

            // Desempacota a resposta
            const response: Message = this.unpackMessage(buffer.toString())

            // Retorna a resposta com os argumentos empacotados
            return JSON.stringify(response.args);
        }
        catch (error) {
            return error;
        }
    }

    packMessage(objectRef: string, method: string, args: string): string {
        // Empacota a mensagem
        const message = new Message(this.requestID, 'request', objectRef, '', method, args);
        
        // Incrementa o ID da requisição
        this.requestID++;
        
        // Retorna a mensagem em formato JSON
        return JSON.stringify(message);
    }

    unpackMessage(message: string): Message {
        // Desempacota a mensagem
        return JSON.parse(message);
    }
}
