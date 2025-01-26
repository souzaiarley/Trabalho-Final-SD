import json
from Task import Task

class TaskList:
    def __init__(self):
        self.tasks: list[Task] = []

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
