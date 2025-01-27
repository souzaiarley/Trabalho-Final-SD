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
            objectRef = objectRef()

            method = getattr(objectRef, message.methodID)
            response = method(message.args)

            return response

        except Exception as e:
            print(e)
            return 'Error'