# encoding=UTF-8
from pathlib import Path

from logic.net.memory_net import MemoryNet
from logic.sl.memory_sl import MemorySL

if __name__ == "__main__":
    path = Path.home() / f"base.json"
    file = Path(path)

    mnet = None
    if file.is_file():
        mnet = MemorySL.load(path, MemoryNet)
    else:
        mnet = MemoryNet(unitNet=[])
        MemorySL.save(mnet, path)

    mnet.