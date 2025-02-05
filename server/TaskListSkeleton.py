import json
from TaskListServant import TaskListServant

class TaskListSkeleton:
    def __init__(self):
        self.taskListServant = TaskListServant()

    def getList(self, args: bytes) -> bytes:
        try:
            # Desempacota os argumentos de entrada
            args = json.loads(args.decode())

            # Chama o metodo do servente e obtem a resposta
            response = self.taskListServant.getList(args)

            # Empacota a resposta e a retorna
            jsonResponse = response.toJson()
            return jsonResponse.encode()
        except Exception as e:
            return self.__createError(str(e))

    def createTask(self, args: bytes) -> bytes:
        try:
            # Desempacota os argumentos de entrada
            args = json.loads(args.decode())

            # Verifica se o ID está presente nos argumentos
            if 'id' not in args:
                raise Exception("O campo 'id' é obrigatório para criar uma tarefa.")

            # Chama o metodo do servente e obtem a resposta
            response = self.taskListServant.createTask(args)

            # Empacota a resposta e a retorna
            jsonResponse = response.toJson()
            return jsonResponse.encode()
        except Exception as e:
            return self.__createError(e)

    def getTask(self, args: bytes) -> bytes:
        try:
            args = json.loads(args.decode())
            response = self.taskListServant.getTask(args)
            jsonResponse = response.toJson()
            return jsonResponse.encode()
        except Exception as e:
            return self.__createError(e)
        
    
    def editTask(self, args: bytes) -> bytes:
        try:
            args = json.loads(args.decode())
            response = self.taskListServant.editTask(args)
            jsonResponse = json.dumps(response)
            return jsonResponse.encode()
        except Exception as e:
            return self.__createError(e)

    def deleteTask(self, args: bytes) -> bytes:
        try:
            args = json.loads(args.decode())
            response = self.taskListServant.deleteTask(args)
            jsonResponse = json.dumps(response)
            return jsonResponse.encode()
        except Exception as e:
            return self.__createError(e)
    
    def __createError(self,message):
        return json.dumps({"error": "true", "message": str(message)})
