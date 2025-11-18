# encoding=UTF-8
import json


class AutoCallJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, "__json_encode__") and callable(obj.__json_encode__):
            return obj.__json_encode__()
        return super().default(obj)
