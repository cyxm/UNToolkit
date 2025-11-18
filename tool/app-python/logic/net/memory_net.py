# encoding=UTF-8

from logic.json.IJsonSerial import IJsonSerial
from logic.unit.memory_unit import MemoryUnit


class MemoryNet(IJsonSerial):

    def __init__(self, unitNet=None, emptyUnit=None):
        if unitNet is None:
            self.unitNet = [{MemoryUnit(id=i)} for i in range(10)]
        else:
            self.unitNet = unitNet

        # self.unitCache = {u.info: u for u in self.unitNet}

    def __json_encode__(self):
        return {"u": self.unitNet}

    @classmethod
    def __json_decode__(cls, json: dict):
        return cls(
            unitNet=[MemoryUnit(**i) for i in json["u"]],
        )

    def activate(self, signal):
        entry = self.unitCache.get(signal)
        if entry is None:
            entry = MemoryUnit(info=signal)

        entry.activate(signal)
