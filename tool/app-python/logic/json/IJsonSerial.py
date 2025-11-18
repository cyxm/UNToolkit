# encoding=UTF-8
from abc import abstractmethod, ABC


class IJsonSerial(ABC):

    @abstractmethod
    def __json_encode__(self):
        pass

    @classmethod
    @abstractmethod
    def __json_decode__(cls, json: dict):
        pass
