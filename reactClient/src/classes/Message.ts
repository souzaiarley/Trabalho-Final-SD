export default class Message {
    id: number;
    type: string;
    objectRef: string;
    message: string;
    methodID: string;
    args: Buffer;

    constructor(id: number, type: string, objectRef: string, message: string, methodID: string, args: Buffer) {
        this.id = id;
        this.type = type;
        this.objectRef = objectRef;
        this.message = message;
        this.methodID = methodID;
        this.args = args;
    }
}