# encoding=UTF-8
import time

from pydantic import BaseModel

from logic.container.MemoryGlobal import MemoryGlobal
from logic.unit.MemoryUnit import MemoryUnit


class MemoryNet(BaseModel):
    unitNet: list[MemoryUnit]

    # def learn(self, signal):
    #     length = len(signal)
    #     if length == 0:
    #         return
    #
    #     # 字单元
    #     lastUnit = None
    #     i = 0
    #     while i < length:
    #         c = signal[i]
    #         currentUnit = self.learnSingle(c)
    #
    #         # 语义双向连接
    #         self.connect(semanticUnit, currentUnit)
    #         self.connect(currentUnit, semanticUnit)
    #
    #         # 字单向连接
    #         if lastUnit is not None:
    #             self.connect(lastUnit, currentUnit)
    #         lastUnit = currentUnit
    #
    #         i += 1

    def learnChar(self, signal: str) -> list[str]:
        """
        学习字符
        """

        return self.__learnMulti(signal)

    def learnSemantic(self, signal: str) -> str:
        """
        学习直接映射语义
        """

        return self.__learnSingle(signal)

    def __learnSingle(self, signal: str) -> str:
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

    def __learnMulti(self, signal: str) -> list[str]:
        result = []
        for i in signal:
            result.append(self.__learnSingle(i))

        return result
