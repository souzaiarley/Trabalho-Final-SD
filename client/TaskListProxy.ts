import { UDPClient } from './UDPClient'

import { Message } from './classes/Message'
import { TaskList } from './classes/TaskList'

export class TaskListProxy {
    // Contador de requisições
    requestID: number;

    // Cliente UDP
    client: UDPClient;

    constructor(serverIP: string, serverPort: number) {
        this.requestID = 0;
        this.client = new UDPClient(serverIP, serverPort);
    }

    async getList(): Promise<TaskList> {
        // Método sem argumentos
        const args = {};

        // Empacota os argumentos
        const jsonArgs = JSON.stringify(args);
        const encodedArgs = Buffer.from(jsonArgs);

        try {
            // Chama doOperation com os argumentos empacotados
            const response = await this.doOperation('TaskList', 'getList', encodedArgs);
            
            // Desempacota o argumento da resposta
            const data = JSON.parse(response.toString());
            
            // Retorna a lista de tarefas
            return new TaskList(data['tasks']);
        }
        catch (error) {
            return error;
        }
    }

    async doOperation(objectRef: string, method: string, args: Buffer): Promise<Buffer> {
        // Empacota a mensagem
        const request: Buffer = this.packMessage(objectRef, method, args);
        
        // Envia a mensagem para o servidor
        this.client.sendRequest(request);
        
        // Recebimento
        try {
            // Obtem a resposta
            const buffer = await this.client.getReply();

            // Desempacota a mensagem da resposta
            const responseMessage: Message = this.unpackMessage(buffer)

            // Retorna a resposta com os argumentos empacotados
            return responseMessage.args;
        }
        catch (error) {
            return error;
        }
    }

    packMessage(objectRef: string, method: string, args: Buffer): Buffer {
        // Forma a mensagem
        const message = new Message(this.requestID, 'request', objectRef, '', method, args);
        
        // Incrementa o ID da requisição
        this.requestID++;
        
        // Empacota a mensagem
        const jsonMessage = JSON.stringify(message);
        return Buffer.from(jsonMessage);
    }

    unpackMessage(reply: Buffer): Message {
        // Desempacota a mensagem
        const jsonMessage = reply.toString();
        const obj = JSON.parse(jsonMessage);
        const message = new Message(obj.id, obj.type, obj.objectRef, obj.status, obj.method, Buffer.from(obj.args));

        // Retorna a mensagem desempacotada
        return message;
    }
}
