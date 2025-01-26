import importlib
from classes.Message import Message

class Dispatcher:
    def selectSkeleton(self, message: Message) -> str:
        objectRef = None
        method = None
        response = None

        try:
            module = importlib.import_module(f'{message.objectRef}Skeleton')

            objectRef = getattr(module, f'{message.objectRef}Skeleton')
            methodName = message.methodID
            method = getattr(objectRef, methodName)

            response = method(message.args)

        except Exception as e:
            print(e)
            return 'Error'