import Task from './Task';

export default class TaskList {
    tasks: Task[];

    constructor(tasks: Task[] = []) {
        this.tasks = tasks;
    }
}
