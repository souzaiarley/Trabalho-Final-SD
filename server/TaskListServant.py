from classes.TaskList import TaskList
from classes.Task import Task

class TaskListServant():
    def __init__(self):
        self.taskList = TaskList()
    
    def getList(self, args) -> TaskList:
        return self.taskList