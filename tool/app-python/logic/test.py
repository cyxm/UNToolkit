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
        mnet = MemoryNet(idSeq=0, unitNet=[])
        MemorySL.save(mnet, path)

    mnet.learn("苹果")
    mnet.learn("桔子")
    mnet.learn("香蕉")

    MemorySL.save(mnet, path)
