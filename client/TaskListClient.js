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

async function getTask() {
    const id = await askQuestion('\nId da task: ')
    try {
        const res = await proxy.getTask(id);
        return res
    }catch(e){
        return e;
    }
}

async function updateTask(taskList) {
    const id = await askQuestion('\nId da task: ');
    const title = await askQuestion('Título: ');
    const description = await askQuestion('Descrição: ');
    const tag = await askQuestion('Tag: ');
    const priority = await askQuestion('Prioridade: ');
    const deadline = await askQuestion('Prazo: ');

    const newTask = new Task(taskList.tasks.length + 1, title, description, tag, priority, deadline, false);
    
    try {
        const response = await proxy.editTask(id,newTask);
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
        console.log('[3] Atualizar tarefa'); // Não implementada...
        console.log('[4] Deletar tarefa');
        console.log('[5] Encerrar...')
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
        }else if (option === '2'){
            try{
                console.clear();
                console.log(chalk.bold('\nBuscando tarefa...'));
                const task = await getTask()

                if(!(task instanceof Error)){ // Isso tá retornando um erro quando vc pede algo q nao existe mas nao ta indo para o catch
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
                    console.log(chalk.green('\nTarefa encontrada com sucesso!'));
                    console.log(table.toString())
                    await askQuestion('Pressione Enter para continuar...');
                } else {
                    console.log(chalk.red('\nErro ao buscar tarefa: tarefa nao existe.'));
                    await askQuestion('Pressione Enter para continuar...');
                }
            }catch(e){
                console.log(chalk.red('\nErro ao buscar tarefa!')); // Tarefa nao existe no B-E.
                console.log(chalk.red(e.message));
                await askQuestion('Pressione Enter para continuar...');
            }
        }else if(option === '3'){
            try {
                console.clear();
                console.log(chalk.bold('\nAtualizando tarefa...'));
                
                const res = await updateTask(tasklist);
                if(res.edited){
                    tasklist = await proxy.getList();
                    console.log(chalk.green('\nTarefa atualizada com sucesso!'));
                }else{
                    console.log(chalk.red('\nErro ao atualizar tarefa: tarefa nao existe.'));
                } 
                
                // console.log(chalk.green('\nTarefa adicionada com sucesso!'));
                await askQuestion('Pressione Enter para continuar...');
            }
            catch (error) {
                console.log(chalk.red('\nErro ao adicionar tarefa!'));
                console.log(chalk.red(error.message));
                await askQuestion('Pressione Enter para continuar...');
            }

        }else if(option === '4'){
            try{
                console.clear();
                console.log(chalk.bold('\nApagando tarefa...'));
                const res = await deleteTask()
                if(res.deleted) {
                    tasklist = await proxy.getList();
                    console.log(chalk.green('\nTarefa deletada com sucesso!'));
                }else {
                    console.log(chalk.red('\nErro ao deletar tarefa: tarefa nao existe.'));
                }
                await askQuestion('Pressione Enter para continuar...');
            }catch(e){
                console.log(chalk.red('\nErro ao deletar tarefa!')); // Tarefa nao existe no B-E?
                console.log(chalk.red(e));
                await askQuestion('Pressione Enter para continuar...');
            }
        }else if(option === '5'){
            proxy.close();
            break;
        }
    }
}

main();
