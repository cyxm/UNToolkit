# encoding=UTF-8
from enum import Enum


class MemoryAreaType(Enum):
    AREA_DIRECT = 0x0100_0000
    """
    物理实体直接映射语义
    """
