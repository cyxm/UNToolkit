# encoding=UTF-8

from logic.net.memory_net import MemoryNet


class SimMemoryContainer:
    """
    最小可用的id号
    """
    id_seq: int

    """
    多个分隔网络
    """
    netArea: list[MemoryNet]

    """
    按组分配,每组最大数量为65536
    """
    group_size: int = 0x1_0000

    def __init__(self, netArea: list[MemoryNet] = None):
        self.netArea = netArea
        self.cache = None
        if self.netArea is not None:
            self.cacheUnit()

    def cacheUnit(self):
        pass
