# encoding=UTF-8
from dataclasses import dataclass, field

from dataclasses_json import dataclass_json, Exclude, Undefined, config


@dataclass_json(undefined=Undefined.EXCLUDE)
@dataclass(init=False)
class MemoryUnit:
    id: int
    info: list | None
    next: list | None

    id_seq: int = field(default=0, init=False, repr=False,
                        metadata=config(exclude=Exclude.ALWAYS))

    def __init__(self, id=None, info=None, next=None):
        if id is None:
            self.id = MemoryUnit.id_seq
        else:
            self.id = id
        MemoryUnit.id_seq += 1

        self.info = info
        self.next = next

    def activate(self, signal):
        pass

    def transmit(self):
        pass
