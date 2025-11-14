# encoding=UTF-8

class MemoryUnit:
    id_seq = 0

    def __init__(self):
        self.id = MemoryUnit.id_seq
        MemoryUnit.id_seq += 1
        self.info = []
        self.next = []

    def activate(self, signal):


        pass

    def transmit(self):

        pass
