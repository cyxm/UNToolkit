# encoding=UTF-8
from abc import ABC, abstractmethod
from typing import List, Tuple, Optional

import cv2
import numpy as np


# --------------------------
# 1. 抽象基类：定义检测算法接口
# --------------------------
class Detector(ABC):
    """检测算法的抽象基类，所有自定义检测算法需继承此类并实现detect方法"""

    @abstractmethod
    def detect(self, image: np.ndarray) -> List[Tuple[Tuple[int, int, int, int], str]]:
        """
        检测接口：输入图像，返回检测结果
        :param image: 输入图像（BGR格式，numpy数组）
        :return: 检测结果列表，每个元素为(边界框, 标签)，边界框格式为(x1, y1, x2, y2)
        """
        pass


# --------------------------
# 2. 数据加载与预处理模块
# --------------------------
class DataProcessor:
    """数据预处理工具：统一图像格式、去噪、缩放等"""

    @staticmethod
    def load_image(image_path: str) -> Optional[np.ndarray]:
        """加载图像（BGR格式）"""
        image = cv2.imread(image_path)
        if image is None:
            print(f"错误：无法读取图像 {image_path}")
            return None
        return image

    @staticmethod
    def preprocess(image: np.ndarray, target_size: Optional[Tuple[int, int]] = None) -> np.ndarray:
        """
        预处理图像
        :param image: 原始图像
        :param target_size: 目标尺寸 (宽, 高)，None表示不缩放
        :return: 预处理后的图像
        """
        # 1. 去噪（高斯模糊）
        processed = cv2.GaussianBlur(image, (5, 5), 0)

        # 2. 缩放（可选）
        if target_size is not None:
            processed = cv2.resize(processed, target_size)

        return processed


# --------------------------
# 3. 结果可视化模块
# --------------------------
class Visualizer:
    """结果可视化工具：绘制检测框、标签等"""

    @staticmethod
    def draw_results(image: np.ndarray, results: List[Tuple[Tuple[int, int, int, int], str]]) -> np.ndarray:
        """在图像上绘制检测结果"""
        visualized = image.copy()
        for (x1, y1, x2, y2), label in results:
            # 绘制边界框（绿色，线宽2）
            cv2.rectangle(visualized, (x1, y1), (x2, y2), (0, 255, 0), 2)
            # 绘制标签（蓝色背景，白色文字）
            cv2.putText(
                visualized,
                label,
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (255, 0, 0),
                2
            )
        return visualized

    @staticmethod
    def show(image: np.ndarray, window_name: str = "Detection Result") -> None:
        """显示图像"""
        cv2.imshow(window_name, image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    @staticmethod
    def save(image: np.ndarray, save_path: str) -> None:
        """保存图像"""
        cv2.imwrite(save_path, image)
        print(f"结果已保存至 {save_path}")


# --------------------------
# 4. 检测框架主类
# --------------------------
class DetectionFramework:
    """检测框架主控制器：串联数据加载、预处理、检测、可视化流程"""

    def __init__(self, detector: Detector):
        self.detector = detector  # 注入自定义检测算法
        self.data_processor = DataProcessor()
        self.visualizer = Visualizer()

    def run(
            self,
            image_path: str,
            target_size: Optional[Tuple[int, int]] = None,
            save_path: Optional[str] = None
    ) -> None:
        """
        运行检测流程
        :param image_path: 输入图像路径
        :param target_size: 预处理目标尺寸 (宽, 高)
        :param save_path: 结果保存路径，None表示不保存
        """
        # 1. 加载图像
        image = self.data_processor.load_image(image_path)
        if image is None:
            return

        # 2. 预处理
        processed_image = self.data_processor.preprocess(image, target_size)

        # 3. 执行检测
        results = self.detector.detect(processed_image)
        print(f"检测完成：共发现 {len(results)} 个目标")

        # 4. 可视化结果
        visualized_image = self.visualizer.draw_results(processed_image, results)
        self.visualizer.show(visualized_image)

        # 5. 保存结果（可选）
        if save_path:
            self.visualizer.save(visualized_image, save_path)


# --------------------------
# 5. 示例：自定义检测算法实现
# --------------------------
class RedCircleDetector(Detector):
    """自定义红色圆形检测算法（继承Detector接口）"""

    def __init__(self, min_radius: int = 5, max_radius: int = 30, circularity_thresh: float = 0.7):
        self.min_radius = min_radius
        self.max_radius = max_radius
        self.circularity_thresh = circularity_thresh  # 圆形度阈值（越接近1越圆）

    def detect(self, image: np.ndarray) -> List[Tuple[Tuple[int, int, int, int], str]]:
        # 1. 转换为HSV颜色空间，筛选红色
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        lower_red1 = np.array([0, 120, 70])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 120, 70])
        upper_red2 = np.array([180, 255, 255])
        mask = cv2.inRange(hsv, lower_red1, upper_red1) | cv2.inRange(hsv, lower_red2, upper_red2)

        # 2. 提取轮廓
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # 3. 筛选圆形
        results = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            perimeter = cv2.arcLength(cnt, closed=True)
            if perimeter == 0:
                continue

            # 计算圆形度：4π×面积 / 周长²（理想圆形=1）
            circularity = (4 * np.pi * area) / (perimeter ** 2)
            if circularity < self.circularity_thresh:
                continue

            # 计算边界框
            (x, y), radius = cv2.minEnclosingCircle(cnt)
            x1, y1 = int(x - radius), int(y - radius)
            x2, y2 = int(x + radius), int(y + radius)

            # 筛选半径范围
            if self.min_radius < radius < self.max_radius:
                results.append(((x1, y1, x2, y2), f"RedCircle(r={int(radius)})"))

        return results


class RectangleDetector(Detector):
    """自定义矩形检测算法（继承Detector接口）"""

    def __init__(self, min_area: int = 100, angle_thresh: float = 10):
        self.min_area = min_area  # 最小面积阈值
        self.angle_thresh = angle_thresh  # 角度阈值（与直角的偏差）

    def detect(self, image: np.ndarray) -> List[Tuple[Tuple[int, int, int, int], str]]:
        # 1. 转为灰度图并提取边缘
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)

        # 2. 提取轮廓
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # 3. 筛选矩形（边数=4，且内角接近90°）
        results = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < self.min_area:
                continue

            # 多边形逼近（近似轮廓为多边形）
            perimeter = cv2.arcLength(cnt, closed=True)
            approx = cv2.approxPolyDP(cnt, epsilon=0.04 * perimeter, closed=True)
            if len(approx) != 4:  # 不是四边形
                continue

            # 计算边界框
            x, y, w, h = cv2.boundingRect(approx)
            x1, y1, x2, y2 = x, y, x + w, y + h

            results.append(((x1, y1, x2, y2), f"Rectangle(area={int(area)})"))

        return results


# --------------------------
# 6. 运行示例
# --------------------------
if __name__ == "__main__":
    # 示例1：使用红色圆形检测器
    # red_circle_detector = RedCircleDetector(min_radius=10, max_radius=50)
    # framework = DetectionFramework(red_circle_detector)
    # framework.run(
    #     image_path="1.jpg",  # 替换为你的测试图像
    #     target_size=(600, 860),  # 缩放至640×480
    #     save_path="red_circle_results.jpg"
    # )

    # 示例2：使用矩形检测器（取消注释即可运行）
    # rectangle_detector = RectangleDetector(min_area=200)
    # framework = DetectionFramework(rectangle_detector)
    # framework.run(
    #     image_path="test_rectangles.jpg",
    #     save_path="rectangle_results.jpg"
    # )
    image = cv2.imread("1.jpg")
    if image is None:
        print(f"错误：无法读取图像")
        pass

    imagehsv = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
