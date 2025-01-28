from classes.TaskList import TaskList
from classes.Task import Task

class TaskListServant():
    def __init__(self):
        self.taskList = TaskList()
    
    def getList(self, args) -> TaskList:
        return self.taskList
    

    def createTask(self, args) -> Task:
        task = Task(
            args['id'],
            args['name'],
            args['description'],
            args['tag'],
            args['priority'],
            args['deadline'],
            args['completed']
        )

        self.taskList.tasks.append(task)
        return task
    
    def deleteTask(self, args) -> dict:
        for task in self.taskList.tasks:
            if task.id == args['taskID']:
                self.taskList.tasks.remove(task)
                return {'deleted': True}
        
        return {'deleted': False}
