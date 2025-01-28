export default class Task {
    
    constructor(id, name, description, tag, priority, deadline, completed) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tag = tag;
        this.priority = priority;
        this.deadline = deadline;
        this.completed = completed;
    }
}
