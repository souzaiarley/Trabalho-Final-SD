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
