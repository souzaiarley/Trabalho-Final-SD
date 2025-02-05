import UDPClient from './UDPClient.js';

import Message from './classes/Message.js';
import TaskList from './classes/TaskList.js'

export default class TaskListProxy {
    // Identificador de requisição
    requestID;

    // Cliente UDP
    client;

    constructor(serverIP, serverPort) {
        this.requestID = 0;
        this.client = new UDPClient(serverIP, serverPort);
    }

    async getList() {
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

    async createTask(task) {
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

    async getTask(taskID) {
        const args = { 'taskID': taskID };
        const jsonArgs = JSON.stringify(args);
        const encodedArgs = Buffer.from(jsonArgs);
        const response = await this.doOperation('TaskList', 'getTask', encodedArgs);
        const data = JSON.parse(response.toString());
        return data;
    }

    async editTask(taskID, newTask) {
        const args = { 'taskID': taskID, 'newTask': newTask };
        const jsonArgs = JSON.stringify(args);
        const encodedArgs = Buffer.from(jsonArgs);

        try {
            const response = await this.doOperation('TaskList', 'editTask', encodedArgs);
            const data = JSON.parse(response.toString());
            return data;
        }
        catch (error) {
            return error;
        }
    }

    async deleteTask(taskID) {
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

    async doOperation(objectRef, method, args) {
        // Empacota a mensagem
        const request = this.packMessage(objectRef, method, args);
        
        // Envia a mensagem para o servidor
        this.client.sendRequest(request);
        
        // Recebimento
        try {
            // Obtem a resposta
            const buffer = await this.client.getReply();

            // Desempacota a mensagem da resposta
            const responseMessage = this.unpackMessage(buffer)

            // Retorna a resposta com os argumentos empacotados
            return responseMessage.args;
        }
        catch (error) {
            return error;
        }
    }

    packMessage(objectRef, method, args) {
        // Gera um identificador único (timestamp + contador)
        this.requestID = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Forma a mensagem
        const message = new Message(this.requestID, 'request', objectRef, '', method, args);
        
        // Empacota a mensagem
        const jsonMessage = JSON.stringify(message);
        return Buffer.from(jsonMessage);
    }

    unpackMessage(reply) {
        // Desempacota a mensagem
        const jsonMessage = reply.toString();
        const obj = JSON.parse(jsonMessage);
        const message = new Message(obj.id, obj.type, obj.objectRef, obj.status, obj.method, Buffer.from(obj.args));

        // Retorna a mensagem desempacotada
        return message;
    }

    close() {
        this.client.close();
    }
}
