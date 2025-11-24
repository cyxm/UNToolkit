# encoding=UTF-8
from pathlib import Path

from logic.container.MemoryAll import MemoryAll
from logic.sl.MemorySL import MemorySL

if __name__ == "__main__":
    path = Path.home() / f"base.json"
    file = Path(path)

    # 加载或新建
    mnet = None
    if file.is_file():
        mnet = MemorySL.load(path, MemoryAll)
    else:
        mnet = MemoryAll(idSeq=0, netArea={})
        MemorySL.save(mnet, path)

    # 学习
    mnet.learnDirectSemantic("苹果")
    mnet.learnDirectSemantic("香蕉")
    mnet.learnDirectSemantic("桔子")
    mnet.learnDirectSemantic("桃")
    mnet.learnDirectSemantic("甘蔗")
    mnet.learnDirectSemantic("西瓜")
    mnet.learnDirectSemantic("柚子")
    mnet.learnDirectSemantic("椰子")
    mnet.learnDirectSemantic("石榴")

    # 保存
    mnet.update()
    MemorySL.save(mnet, path)
