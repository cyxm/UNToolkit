# encoding=UTF-8
from typing import Any

from pydantic import BaseModel, Field

from logic.unit.memory_unit import MemoryUnit


class MemoryNet(BaseModel):
    idSeq: int
    unitNet: list[MemoryUnit]

    unitCache: dict = Field(default={}, exclude=True)

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        for m in self.unitNet:
            self.unitCache[m.info] = m

    def activate(self, signal):
        entry = self.unitCache.get(signal)
        if entry is None:
            entry = MemoryUnit(id=self.idSeq, info=signal, next=[], state=[])
            self.idSeq += 1
            self.unitNet.append(entry)
            self.unitCache[entry.info] = entry

        entry.activate(signal)
