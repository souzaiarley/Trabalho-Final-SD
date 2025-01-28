// CODIGO PARA TESTES. DEVE SER REMOVIDO POSTERIORMENTE

import { TaskListProxy } from "./TaskListProxy";
import { Task } from "./classes/Task";

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

    const response5 = await proxy.getTask(1);
    console.log(response5);

    proxy.close();
}

main();
