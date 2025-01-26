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
