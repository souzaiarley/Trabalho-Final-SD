import { UDPClient } from './UDPClient'

import { Message } from './classes/Message'
import { TaskList } from './classes/TaskList'
import { Task } from './classes/Task'

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

    async createTask(task: Task): Promise<Object> {
        // Empacota os argumentos
        const args = task;
        const jsonArgs = JSON.stringify(args);
        const encodedArgs = Buffer.from(jsonArgs);

        try {
            // Chama doOperation com os argumentos empacotados
            const response = await this.doOperation('TaskList', 'createTask', encodedArgs);

            // Desempacota o argumento da resposta
            const data = JSON.parse(response.toString());

            // Retorna a resposta
            return data;
        }
        catch (error) {
            return error;
        }
    }

    async deleteTask(taskID: number): Promise<Object> {
        const args = { 'taskID': taskID };
        const jsonArgs = JSON.stringify(args);
        const encodedArgs = Buffer.from(jsonArgs);

        try {
            const response = await this.doOperation('TaskList', 'deleteTask', encodedArgs);
            const data = JSON.parse(response.toString());
            return data;
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

/* CODIGO ADICIONAL PARA TESTES. DEVE SER REMOVIDO POSTERIORMENTE.

const proxy = new TaskListProxy('localhost', 12000);

const task1 = new Task(1, 'task1', 'description1', 'tag1', 1, '2021-01-08', false);
const task2 = new Task(2, 'task2', 'description2', 'tag2', 2, '2021-01-09', false);
const task3 = new Task(3, 'task3', 'description3', 'tag3', 3, '2021-01-10', false);

async function main() {
    const list = await proxy.getList();
    console.log(list.tasks);

    const response = await proxy.createTask(task1);
    console.log(response);

    const response2 = await proxy.createTask(task2);
    console.log(response2);

    const response3 = await proxy.createTask(task3);
    console.log(response3);

    const list2 = await proxy.getList();
    console.log(list2.tasks);

    const response4 = await proxy.deleteTask(2);
    console.log(response4);

    const list3 = await proxy.getList();
    console.log(list3.tasks);
}

main();

*/
