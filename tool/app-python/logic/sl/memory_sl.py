# encoding=UTF-8
from pathlib import Path

from logic.net.base_memory_net import BaseMemoryNet


class MemorySL:

    @staticmethod
    def save(net, file_path):
        if file_path is None:
            return

        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        path.write_text(
            net.to_json(ensure_ascii=False),
            encoding="utf-8"
        )

    @staticmethod
    def load(file_path):
        if file_path is None:
            return None

        path = Path(file_path)
        return BaseMemoryNet.from_json(path.read_text("utf-8"))
