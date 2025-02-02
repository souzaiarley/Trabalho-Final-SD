import json

class Task:
    def __init__(self, id: int, name: str, description: str, tag: str, priority: int, deadline: str, completed: bool):
        self.id: int = id
        self.name: str = name
        self.description: str = description
        self.tag: str = tag
        self.priority: int = priority
        self.deadline: str = deadline
        self.completed: bool = completed
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
