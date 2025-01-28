import json
from TaskListServant import TaskListServant

class TaskListSkeleton:
    def __init__(self):
        self.taskListServant = TaskListServant()

    def getList(self, args: bytes) -> bytes:
        # Desempacota os argumentos de entrada
        args = json.loads(args.decode())

        # Chama o metodo do servente e obtem a resposta
        response = self.taskListServant.getList(args)

        # Empacota a resposta e a retorna
        jsonResponse = response.toJson()
        return jsonResponse.encode()

    def createTask(self, args: bytes) -> bytes:
        # Desempacota os argumentos de entrada
        args = json.loads(args.decode())

        # Chama o metodo do servente e obtem a resposta
        response = self.taskListServant.createTask(args)

        # Empacota a resposta e a retorna
        jsonResponse = response.toJson()
        return jsonResponse.encode()

    def getTask(self, args: bytes) -> bytes:
        args = json.loads(args.decode())

        response = self.taskListServant.getTask(args)

        jsonResponse = response.toJson()
        return jsonResponse.encode()

    def deleteTask(self, args: bytes) -> bytes:
        args = json.loads(args.decode())

        response = self.taskListServant.deleteTask(args)

        jsonResponse = json.dumps(response)
        return jsonResponse.encode()
