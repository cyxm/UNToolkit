# encoding=UTF-8
import json

from logic.json.AutoCallJsonEncoder import AutoCallJsonEncoder


class JsonUtil:

    @staticmethod
    def dumps(data):
        return json.dumps(data, cls=AutoCallJsonEncoder)

    @staticmethod
    def loads(data, cls):
        if hasattr(cls, "__json_decode__") and callable(cls.__json_decode__):
            return json.loads(data, object_hook=cls.__json_decode__)
        else:
            return json.loads(data)
