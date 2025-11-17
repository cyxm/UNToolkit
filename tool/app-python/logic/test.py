# encoding=UTF-8
from pathlib import Path

from logic.net.base_memory_net import BaseMemoryNet
from logic.sl.memory_sl import MemorySL

if __name__ == "__main__":
    baseTest = BaseMemoryNet()

    path = Path.home() / f"base.json"
    MemorySL.save(baseTest, path)
    baseTest = MemorySL.load(path)
