# encoding=UTF-8
import cv2
import numpy as np
from matplotlib import pyplot as plt

if __name__ == '__main__':
    # 原始图片
    imageData = cv2.imread("./image/apple_test.jpg")
    origImage = cv2.cvtColor(imageData, cv2.COLOR_BGR2RGB)

    # 提取v分量的图片
    hsv = cv2.cvtColor(imageData, cv2.COLOR_BGR2HSV)
    hsv[:, :, 0] = 0
    hsv[:, :, 1] = 0
    # hsv[:, :, 2] = 0
    vImage = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    # 增加亮度对比,
    max_brightness = 255
    vLevel = 5
    interval = (max_brightness + 1) // vLevel
    level_values = np.array([i * interval + interval // 2 for i in range(vLevel)])
    level_values[-1] = min(level_values[-1], max_brightness)
    v_min = hsv[:, :, 2].min()
    v_max = hsv[:, :, 2].max()
    rate = (v_max - v_min) / float(256)
    v_original = hsv[:, :, 2].copy()
    level_indices = v_original // interval  # 原始索引（可能出现 20）
    level_indices = np.clip(level_indices, 0, vLevel - 1)  # 限制索引范围 0-19
    v_reduced = level_values[level_indices]
    hsv_reduced = hsv.copy()
    hsv_reduced[:, :, 2] = v_reduced
    img_reduced = cv2.cvtColor(hsv_reduced, cv2.COLOR_HSV2BGR)


    plt.figure(figsize=(6, 4))

    plt.subplot(1, 3, 1)
    plt.imshow(origImage)

    plt.subplot(1, 3, 2)
    plt.imshow(vImage)

    plt.subplot(1, 3, 3)
    plt.imshow(img_reduced)

    plt.show()
