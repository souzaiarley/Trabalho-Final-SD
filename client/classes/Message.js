export default class Message {
    
    constructor(id, type, objectRef, message, methodID, args) {
        this.id = id;
        this.type = type;
        this.objectRef = objectRef;
        this.message = message;
        this.methodID = methodID;
        this.args = args;
    }
}