export class Task {
    id: number;
    name: string;
    description: string;
    tag: string;
    priority: number;
    deadline: Date;
    completed: boolean;

    constructor(id: number, name: string, description: string, tag: string, priority: number, deadline: Date, completed: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tag = tag;
        this.priority = priority;
        this.deadline = deadline;
        this.completed = completed;
    }
}

export class TaskList {
    tasks: Task[];

    constructor() {
        this.tasks = [];
    }
}

// Dividir entre requisição e resposta?
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
