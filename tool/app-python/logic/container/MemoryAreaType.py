# encoding=UTF-8
from enum import Enum


class MemoryAreaType(Enum):
    AREA_SEMANTIC_DIRECT = 0
    """
    物理实体直接映射语义
    """

    AREA_HAN_CHAR = 1
    """
    汉字字符
    """
