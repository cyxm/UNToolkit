# encoding=UTF-8
import time

from pydantic import BaseModel

from logic.container.MemoryGlobal import MemoryGlobal
from logic.unit.MemoryUnit import MemoryUnit


class MemoryNet(BaseModel):
    unitNet: list[MemoryUnit]

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

    def learnSingle(self, signal: str) -> str:
        entry = MemoryGlobal.unitCache.get(signal)
        if entry is None:
            entry = MemoryUnit(
                id=MemoryGlobal.idSeq,
                info=signal,
                next=[],
                nextStrength={},
                nextTime={},
                state=[]
            )
            MemoryGlobal.idSeq += 1
            self.unitNet.append(entry)
            MemoryGlobal.unitCache[entry.info] = entry

        return entry.info

    def learnSemantic(self, signal) -> str:
        return self.learnSingle(signal)

    def connect(self, s0: str, s1: str):
        e0 = MemoryGlobal.unitCache.get(s0)
        e1 = MemoryGlobal.unitCache.get(s1)
        if e0 is None or e1 is None:
            return

        if e1.id not in e0.next:
            e0.next.append(e1.id)
            e0.nextStrength[e1.id] = 0x00FF
            e0.nextTime[e1.id] = int(time.time())
