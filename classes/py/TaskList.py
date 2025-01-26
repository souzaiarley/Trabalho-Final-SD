from Task import Task

class TaskList:
    def __init__(self):
        self.tasks: list[Task] = []

    def to_dict(self):
        return [task.to_dict() for task in self.tasks]
        
