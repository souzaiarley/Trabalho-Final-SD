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

    const lastTask = taskList.tasks.length > 0 ? taskList.tasks[taskList.tasks.length - 1] : null;
    const newId = lastTask ? lastTask.id + 1 : 1; // ID atribuído condicionalmente
    
    const newTask = new Task(newId, title, description, tag, priority, deadline, false);
        
    try {
        const response = await proxy.createTask(newTask);
        return response;
    }
    catch (error) {
        return error;
    }
}

async function getTask() {
    const id = await askQuestion('\nId da task: ')
    const res = await proxy.getTask(id);
    return res
}

async function updateTask(taskList) {
    const id = await askQuestion('\nId da task: ');
    const title = await askQuestion('Título: ');
    const description = await askQuestion('Descrição: ');
    const tag = await askQuestion('Tag: ');
    const priority = await askQuestion('Prioridade: ');
    const deadline = await askQuestion('Prazo: ');
    const completed = await askQuestion('Feita? (s/n): ');

    const newTask = new Task(taskList.tasks.length + 1, title, description, tag, priority, deadline, completed === 's' ? true : false);
    
    try {
        const response = await proxy.editTask(id,newTask);
        return response;
    }
    catch (error) {
        return error;
    }
}

async function editTaskStatus() {
    const id = await askQuestion('\nId da task: ');
    const task = await proxy.getTask(id);

    console.log('Selecione uma opcao:\n');

    const option = await askQuestion('Feita?: ');
    const completed = option === 's' ? true : false;
    const newTask = new Task(task.id, task.name, task.description, task.tag, task.priority, task.deadline, completed);

    try {
        const response = await proxy.editTask(id, newTask);
        return response;
    }
    catch (error) {
        return error;
    }
}

async function deleteTask() {
    const id = await askQuestion('\nId da task: ')
    try {
        const res = await proxy.deleteTask(id);
        return res
    }catch(e){
        return e;
    }
}
async function main() {
    let tasklist = await proxy.getList();

    while (true) {
        console.clear();

        console.log(chalk.bold('\nLista de tarefas'));

        table.length = 0; // Quero saber o pq disso aqui
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

        // C R U D
        console.log('\nSelecione uma opcao:\n');
        console.log('[1] Adicionar tarefa');
        console.log('[2] Buscar tarefa');
        console.log('[3] Atualizar tarefa');
        console.log('[4] Deletar tarefa');
        console.log('[5] Encerrar...')
        const option = await askQuestion('Escolha uma opção: ');

        if (option === '1') {
            try {
                console.clear();
                console.log(chalk.bold('\nAdicionando tarefa...'));
                
                const response = await createTask(tasklist);
                if(response.error) throw new Error(response.message);

                tasklist = await proxy.getList();
                console.log(chalk.green('\nTarefa adicionada com sucesso!'));
                await askQuestion('Pressione Enter para continuar...');
            }
            catch (error) {
                console.log(chalk.red(`\nErro ao adicionar tarefa: ${error.message}`));
                await askQuestion('Pressione Enter para continuar...');
            }
        }else if (option === '2'){
            try{
                console.clear();
                console.log(chalk.bold('\nBuscando tarefa...'));
                const task = await getTask()
                if(task.error) throw new Error(task.message)

                console.log(chalk.green('\nTarefa encontrada com sucesso!'));
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
                table.push([
                    task.id,
                    task.name,
                    task.description,
                    task.tag,
                    task.priority,
                    task.deadline,
                    task.completed ? chalk.white.bold('✅ Sim') : chalk.gray('❌ Não'),
                ]);
                console.log(table.toString())
                await askQuestion('Pressione Enter para continuar...');
            }catch(e){
                console.log(chalk.red(`\nErro ao buscar tarefa: ${e.message}`)); // Tarefa nao existe no B-E.
                await askQuestion('Pressione Enter para continuar...');
            }
        }else if(option === '3'){
            console.clear();
            console.log("Selecione uma opção:\n");
            console.log("[1] Editar somente o status da tarefa");
            console.log("[2] Editar tarefa");

            const option = await askQuestion('Escolha uma opção: ');

            if(option === '1'){
                try {
                    console.clear();
                    console.log(chalk.bold('\nAtualizando status da tarefa...'));
                    const res = await editTaskStatus(tasklist);
                    if(res.error) throw new Error(res.message)
                    tasklist = await proxy.getList();
                    console.log(chalk.green('\nStatus da tarefa atualizado com sucesso!'));
                    await askQuestion('Pressione Enter para continuar...');
                }
                catch (error) {
                    console.log(chalk.red(`\nErro ao atualizar status da tarefa: ${error.message}`));
                    await askQuestion('Pressione Enter para continuar...');
                }
            }else if(option === '2'){
                try {
                    console.clear();
                    console.log(chalk.bold('\nAtualizando tarefa...'));
                    const res = await updateTask(tasklist);
                    if(res.error) throw new Error(res.message)
                    tasklist = await proxy.getList();
                    console.log(chalk.green('\nTarefa atualizada com sucesso!'));
                    await askQuestion('Pressione Enter para continuar...');
                }
                catch (error) {
                    console.log(chalk.red(`\nErro ao atualizar tarefa: ${error.message}`));
                    await askQuestion('Pressione Enter para continuar...');
                }
            }

        }else if(option === '4'){
            try{
                console.clear();
                console.log(chalk.bold('\nApagando tarefa...'));
                const res = await deleteTask()
                if(res.error) throw new Error(res.message)
                tasklist = await proxy.getList();
                console.log(chalk.green('\nTarefa deletada com sucesso!'));
                await askQuestion('Pressione Enter para continuar...');
            }catch(e){
                console.log(chalk.red(`\nErro ao deletar tarefa: ${e.message}`)); // Tarefa nao existe no B-E
                await askQuestion('Pressione Enter para continuar...');
            }
        }else if(option === '5'){
            proxy.close();
            console.log(`Encerrando conexão... ✌`)
            break;
        }
    }
}

main();
