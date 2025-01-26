class Task:
    def __init__(self, id: int, name: str, description: str, tag: str, priority: int, deadline: str, completed: bool):
        self.id: int = id
        self.name: str = name
        self.description: str = description
        self.tag: str = tag
        self.priority: int = priority
        self.deadline: str = deadline
        self.completed: bool = completed

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'tag': self.tag,
            'priority': self.priority,
            'deadline': self.deadline,
            'completed': self.completed
        }


class TaskList:
    def __init__(self):
        self.tasks: list[Task] = []

    def to_dict(self):
        return [task.to_dict() for task in self.tasks]
        

class Message:
    def __init__(self, id: int, type: str, objectRef: str, message: str, methodID: str, args: dict):
        self.id: int = id
        self.type: str = type
        self.objectRef: str = objectRef
        self.message: str = message
        self.methodID: str = methodID
        self.args: dict = args

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "objectRef": self.objectRef,
            "message": self.message,
            "methodID": self.methodID,
            "args": self.args
        }