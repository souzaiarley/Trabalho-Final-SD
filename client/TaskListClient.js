import readline from 'readline';
import chalk from 'chalk';
import Table from 'cli-table3';

import TaskListProxy from './TaskListProxy.js'
import Task from './classes/Task.js';

const proxy = new TaskListProxy('localhost', 12000);

const table = new Table({
    head: [
        chalk.blue('#'),
        chalk.blue('Título'),
        chalk.blue('Descrição'),
        chalk.blue('Tag'),
        chalk.blue('Prioridade'),
        chalk.blue('Prazo'),
        chalk.blue('Feita?')
    ],
    colWidths: [3, 25, 50, 15, 12, 15, 10],
});

function askQuestion(query) {
    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => r1.question(query, answer => {
        r1.close();
        resolve(answer);
    }));
}

async function createTask(taskList) {
    const title = await askQuestion('\nTítulo: ');
    const description = await askQuestion('Descrição: ');
    const tag = await askQuestion('Tag: ');
    const priority = await askQuestion('Prioridade: ');
    const deadline = await askQuestion('Prazo: ');

    const newTask = new Task(taskList.tasks.length + 1, title, description, tag, priority, deadline, false);
    
    try {
        const response = await proxy.createTask(newTask);
        return response;
    }
    catch (error) {
        return error;
    }
}

async function main() {
    const tasklist = await proxy.getList();

    while (true) {
        console.clear();

        console.log(chalk.bold('\nLista de tarefas'));

        table.length = 0;
        tasklist.tasks.forEach(task => {
            table.push([
                task.id,
                task.name,
                task.description,
                task.tag,
                task.priority,
                task.deadline,
                task.completed ? chalk.white.bold('✅ Sim') : chalk.gray('❌ Não'),
            ]);
        });
        console.log(table.toString());

        console.log('\nO que deseja fazer?\n');
        console.log('[1] Adicionar tarefa');

        const option = await askQuestion('Escolha uma opção: ');

        if (option === '1') {
            try {
                console.clear();
                console.log(chalk.bold('\nAdicionando tarefa...'));
                
                const reponse = await createTask(tasklist);
                const newTask = new Task(reponse.id, reponse.name, reponse.description, reponse.tag, reponse.priority, reponse.deadline, reponse.completed);
                tasklist.tasks.push(newTask);
                
                console.log(chalk.green('\nTarefa adicionada com sucesso!'));
                await askQuestion('Pressione Enter para continuar...');
            }
            catch (error) {
                console.log(chalk.red('\nErro ao adicionar tarefa!'));
                console.log(chalk.red(error.message));
                await askQuestion('Pressione Enter para continuar...');
            }
        }
    }
}

main();
