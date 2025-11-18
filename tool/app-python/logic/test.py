# encoding=UTF-8
from pathlib import Path

from logic.net.memory_net import MemoryNet
from logic.sl.memory_sl import MemorySL

if __name__ == "__main__":
    baseTest = MemoryNet()

    path = Path.home() / f"base.json"
    MemorySL.save(baseTest, path)
    baseTest = MemorySL.load(MemoryNet, path)
    print(baseTest)
