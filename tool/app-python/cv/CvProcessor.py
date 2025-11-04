# encoding=UTF-8

import cv2
import numpy as np


class CvProcessor:
    """
    计算机视觉处理类，提供常用的图像处理功能
    """

    def __init__(self):
        """
        初始化CvProcessor类
        """
        pass

    def blur_image(self, image: np.ndarray, kernel_size: tuple = (15, 15)) -> np.ndarray:
        """
        对图像应用高斯模糊
        
        :param image: 输入图像
        :param kernel_size: 高斯核大小
        :return: 模糊后的图像
        """
        return cv2.GaussianBlur(image, kernel_size, 0)

    def edge_detection(self, image: np.ndarray) -> np.ndarray:
        """
        使用Canny算法进行边缘检测
        
        :param image: 输入图像
        :return: 边缘检测结果
        """
        # 转换为灰度图
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # 应用Canny边缘检测
        edges = cv2.Canny(gray, 100, 200)
        return edges

    def adjust_brightness_contrast(self, image: np.ndarray, brightness: int = 0, contrast: float = 1.0) -> np.ndarray:
        """
        调整图像亮度和对比度
        
        :param image: 输入图像
        :param brightness: 亮度调整值
        :param contrast: 对比度调整值
        :return: 调整后的图像
        """
        return cv2.convertScaleAbs(image, alpha=contrast, beta=brightness)
