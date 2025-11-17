# encoding=UTF-8
from dataclasses import dataclass

from dataclasses_json import dataclass_json

from logic.unit.memory_unit import MemoryUnit


@dataclass_json
@dataclass(init=False)
class BaseMemoryNet:
    unitNet: list[MemoryUnit] | None

    def __init__(self, unitNet=None):
        if unitNet is None:
            self.unitNet = None
        else:
            self.unitNet = unitNet

        # if unitNet is not None:
        #     self.id_index=
        #     self.info_index=map

    # def input(self, signal):
    #     self.unitNet[0]
