# encoding=UTF-8
import cv2


class CvImageEntity:

    def __init__(self):
        self.image: cv2.typing.MatLike | None = None

    def read(self, path: str):
        if self.image is None:
            self.image = cv2.imread(path)

        return self.image

    def clear(self):
        self.image = None
