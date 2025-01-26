export class Message {
    id: number;
    type: string;
    objectRef: string;
    message: string;
    methodID: string;
    args: Object;

    constructor(id: number, type: string, objectRef: string, message: string = "", methodID: string = "", args: Object = {}) {
        this.id = id;
        this.type = type;
        this.objectRef = objectRef;
        this.message = message;
        this.methodID = methodID;
        this.args = args;
    }
}