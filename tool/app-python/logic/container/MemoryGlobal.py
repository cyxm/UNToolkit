# encoding=UTF-8

from logic.unit.MemoryUnit import MemoryUnit


class MemoryGlobal:
    """
    全局变量
    """

    idSeq: int = 0
    """
    unit最小可用的id号
    """

    unitCache: dict[str, MemoryUnit] = {}
    """
    所有unit的缓存
    """
