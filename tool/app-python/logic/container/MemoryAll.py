# encoding=UTF-8
from typing import Any

from pydantic import BaseModel

from logic.container.MemoryAreaType import MemoryAreaType
from logic.container.MemoryGlobal import MemoryGlobal
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
        self.idSeq = MemoryGlobal.idSeq

    def learnDirectSemantic(self, signal):
        a = self.netArea.get(MemoryAreaType.AREA_DIRECT.value)
        if a is None:
            a = MemoryNet(unitNet=[])
            self.netArea[MemoryAreaType.AREA_DIRECT.value] = a

        a.learn(signal)
