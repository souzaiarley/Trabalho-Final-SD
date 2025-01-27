import json

class Message:
    def __init__(self, id: int, type: str, objectRef: str, message: str, methodID: str, args: bytes):
        self.id: int = id
        self.type: str = type
        self.objectRef: str = objectRef
        self.message: str = message
        self.methodID: str = methodID
        self.args: bytes = args

    def toJson(self):
        return json.dumps(self, default=self._json_default)

    def _json_default(self, obj):
        if isinstance(obj, bytes):
            return obj.decode('utf-8')  # or use another encoding if needed
        return obj.__dict__