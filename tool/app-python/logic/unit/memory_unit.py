# encoding=UTF-8
from logic.json.IJsonSerial import IJsonSerial


class MemoryUnit(IJsonSerial):

    def __init__(self, id, info=None, next=None):
        self.id = id
        self.info = info
        self.next = next

        """
        (强度,阈值),会动态变化的内部状态
        """
        self.state = [0, 5]

    def __json_encode__(self):
        return {
            "i": self.id,
            "f": self.info if self.info is not None else "",
            "n": self.next if self.next is not None else []
        }

    @classmethod
    def __json_decode__(cls, json: dict):
        print("=========")
        return cls(
            id=json["i"],
            info=json["f"],
            next=json["n"]
        )

    def activate(self, signal):
        self.state[0] += signal
        """
        超过阈值,向下一级发送信息
        """
        if self.state[0] >= self.state[1]:
            self.state[0] = 0
            self.transmit()

    def transmit(self):
        for n, m in self.next:
            pass
