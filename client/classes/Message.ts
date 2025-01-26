export class Message {
    id: number;
    type: string;
    objectRef: string;
    message: string;
    methodId: string;
    args: Object;

    constructor(id: number, type: string, objectRef: string, message: string = "", methodId: string = "", args: Object = {}) {
        this.id = id;
        this.type = type;
        this.objectRef = objectRef;
        this.message = message;
        this.methodId = methodId;
        this.args = args;
    }
}