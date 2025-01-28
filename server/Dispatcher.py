import importlib
from classes.Message import Message

class Dispatcher:
    def __init__(self):
        self.skeletons = {}

    def selectSkeleton(self, message: Message) -> str:
        objectRef = None
        method = None
        response = None

        try:
            module = importlib.import_module(f'{message.objectRef}Skeleton')

            objectRef = getattr(module, f'{message.objectRef}Skeleton')

            if objectRef not in self.skeletons:
                self.skeletons[objectRef] = objectRef()

            objectRef = self.skeletons[objectRef]

            method = getattr(objectRef, message.methodID)
            response = method(message.args)

            return response

        except Exception as e:
            print(e)
            return 'Error'