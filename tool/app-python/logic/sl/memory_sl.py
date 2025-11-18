# encoding=UTF-8
from pathlib import Path

from logic.json.JsonUtil import JsonUtil


class MemorySL:

    @staticmethod
    def save(net, file_path):
        if file_path is None:
            return

        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        path.write_text(
            JsonUtil.dumps(net),
            encoding="utf-8"
        )

    @staticmethod
    def load(cls, file_path):
        if file_path is None:
            return None

        path = Path(file_path)
        return JsonUtil.loads(path.read_text("utf-8"), cls)
