# encoding=UTF-8
import json
from pathlib import Path


class MemorySL:

    @staticmethod
    def save(net, file_path):
        if file_path is None:
            return

        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        net.update()
        path.write_text(
            json.dumps(net.model_dump(), ensure_ascii=False, separators=(',', ':')),
            encoding="utf-8"
        )

    @staticmethod
    def load(file_path, cls):
        if file_path is None:
            return None

        path = Path(file_path)
        return cls.model_validate(json.loads(path.read_text("utf-8")))
