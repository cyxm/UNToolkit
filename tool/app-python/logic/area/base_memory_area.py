# encoding=UTF-8
from logic.unit.memory_unit import MemoryUnit


class BaseMemoryArea:
    unit_count = 100

    def __init__(self):
        self.unitNet = [MemoryUnit() for i in range(BaseMemoryArea.unit_count)]
        pass

    def activate(self):
        for
        pass