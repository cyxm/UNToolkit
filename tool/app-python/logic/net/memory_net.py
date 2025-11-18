# encoding=UTF-8
from pydantic import BaseModel

from logic.unit.memory_unit import MemoryUnit


class MemoryNet(BaseModel):
    unitNet: list[MemoryUnit]

    def activate(self, signal):
        entry = self.unitCache.get(signal)
        if entry is None:
            entry = MemoryUnit(info=signal)

        entry.activate(signal)
