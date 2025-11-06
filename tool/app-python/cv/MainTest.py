# encoding=UTF-8
import cv2
import numpy as np
from matplotlib import pyplot as plt


class ImageHandler:

    @staticmethod
    def filterV(hsv):
        hsv[:, :, 0] = 0
        hsv[:, :, 1] = 0
        v = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        return v

    @staticmethod
    def reduceLevel(hsv):
        max_brightness = 255
        vLevel = 10
        interval = (max_brightness + 1) // vLevel
        level_values = np.array([i * interval + interval // 2 for i in range(vLevel)])
        level_values[-1] = min(level_values[-1], max_brightness)

        v_original = hsv[:, :, 2].copy()
        level_indices = v_original // interval
        level_indices = np.clip(level_indices, 0, vLevel - 1)
        v_reduced = level_values[level_indices]
        hsv_reduced = hsv.copy()
        hsv_reduced[:, :, 2] = v_reduced
        img_reduced = cv2.cvtColor(hsv_reduced, cv2.COLOR_HSV2BGR)
        return img_reduced


class Main:

    @staticmethod
    def main():
        plt.figure(figsize=(6, 4))
        imageList = list()

        ori = cv2.imread("./image/apple_test.jpg")
        rgb = cv2.cvtColor(ori, cv2.COLOR_BGR2RGB)
        hsv = cv2.cvtColor(ori, cv2.COLOR_BGR2HSV)

        imageList.append(rgb)

        vImage = ImageHandler.filterV(hsv)
        imageList.append(vImage)

        img_reduced = ImageHandler.reduceLevel(hsv)
        imageList.append(img_reduced)

        threshold = 255
        rImage = rgb.copy()
        rImage[rImage[..., 0] < threshold, 0] = 0
        rImage[:, :, 1] = 0
        rImage[:, :, 2] = 0

        imageList.append(rImage)

        size = len(imageList)
        for idx, item in enumerate(imageList):
            plt.subplot(1, size, idx + 1)
            plt.imshow(item)

        plt.show()


if __name__ == '__main__':
    Main.main()
