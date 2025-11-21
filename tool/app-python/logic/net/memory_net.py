# encoding=UTF-8
from typing import Any

from pydantic import BaseModel, Field

from logic.unit.memory_unit import MemoryUnit


class MemoryNet(BaseModel):
    idSeq: int
    unitNet: list[MemoryUnit]

    unitCache: dict[str, MemoryUnit] = Field(default={}, exclude=True)

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        for m in self.unitNet:
            self.unitCache[m.info] = m

    def learnSingle(self, signal: str) -> str:
        entry = self.unitCache.get(signal)
        if entry is None:
            entry = MemoryUnit(id=self.idSeq, info=signal, next=[], nextStrength={}, state=[])
            self.idSeq += 1
            self.unitNet.append(entry)
            self.unitCache[entry.info] = entry

        return entry.info

    def learnSemantic(self, signal) -> str:
        return self.learnSingle(signal)

    def connect(self, s0: str, s1: str):
        e0 = self.unitCache.get(s0)
        e1 = self.unitCache.get(s1)
        if e0 is None or e1 is None:
            return

        if e1.id not in e0.next:
            e0.next.append(e1.id)

    def learn(self, signal):
        length = len(signal)
        if length == 0:
            return

        # 语义单元
        semanticUnit = self.learnSemantic(signal)

        # 字单元
        lastUnit = None
        i = 0
        while i < length:
            c = signal[i]
            currentUnit = self.learnSingle(c)

            # 语义双向连接
            self.connect(semanticUnit, currentUnit)
            self.connect(currentUnit, semanticUnit)

            # 字单向连接
            if lastUnit is not None:
                self.connect(lastUnit, currentUnit)
            lastUnit = currentUnit

            i += 1
