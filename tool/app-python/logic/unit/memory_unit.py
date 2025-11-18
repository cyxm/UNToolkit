# encoding=UTF-8
from pydantic import BaseModel


class MemoryUnit(BaseModel):
    id: int
    info: object
    next: list
    """
    (强度,阈值),会动态变化的内部状态
    """
    state: list

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
