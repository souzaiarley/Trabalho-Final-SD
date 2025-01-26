import json

class Message:
    def __init__(self, id: int, type: str, objectRef: str, message: str, methodID: str, args: dict):
        self.id: int = id
        self.type: str = type
        self.objectRef: str = objectRef
        self.message: str = message
        self.methodID: str = methodID
        self.args: dict = args

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
