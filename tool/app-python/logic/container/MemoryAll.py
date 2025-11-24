# encoding=UTF-8
import time
from typing import Any

from pydantic import BaseModel

from logic.container.MemoryAreaType import MemoryAreaType
from logic.container.MemoryGlobal import MemoryGlobal
from logic.net import MemoryNet
from logic.net.MemoryNet import MemoryNet


class MemoryAll(BaseModel):
    idSeq: int
    """
    unit最小可用的id号
    """

    netArea: dict[int, MemoryNet]
    """
    多个功能网络
    """

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        MemoryGlobal.idSeq = self.idSeq
        for net in self.netArea.values():
            for unit in net.unitNet:
                MemoryGlobal.unitCache[unit.info] = unit

    def update(self):
        """
        更新id最大序号
        """
        self.idSeq = MemoryGlobal.idSeq

    def __getOrNew(self, area: int) -> MemoryNet:
        a = self.netArea.get(area)
        if a is None:
            a = MemoryNet(unitNet=[])
            self.netArea[area] = a
        return a

    def __connectUnit(self, s0: str, s1: list[str]):
        e0 = MemoryGlobal.unitCache.get(s0)
        for c in s1:
            e1 = MemoryGlobal.unitCache.get(c)
            self.__connectSingle(e0, e1)

    def __connectSingle(self, e0, e1):
        if e0 is None or e1 is None:
            return

        if e1.id not in e0.next:
            e0.next.append(e1.id)
            e0.nextStrength[e1.id] = 0x00FF
            e0.nextTime[e1.id] = int(time.time())

    def learnDirectSemantic(self, signal):
        """
        学习直接映射语义
        """

        # 语义单元
        directSemanticArea = self.__getOrNew(MemoryAreaType.AREA_SEMANTIC_DIRECT.value)
        semantic = directSemanticArea.learnSemantic(signal)

        # 字符单元
        hanCharArea = self.__getOrNew(MemoryAreaType.AREA_HAN_CHAR.value)
        chars = hanCharArea.learnChar(signal)

        # 连接
        self.__connectUnit(semantic, chars)
