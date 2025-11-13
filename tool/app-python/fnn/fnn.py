# encoding=UTF-8
import tensorflow as tf
# 1. 构建模型（输入2维→隐藏层5个神经元→输出1维回归）
model = tf.keras.Sequential([
    tf.keras.layers.Dense(5, activation='relu', input_shape=(2,)),  # 隐藏层
    tf.keras.layers.Dense(1)  # 输出层（回归）
])
# 2. 编译+训练（用随机数据演示）
model.compile(optimizer='sgd', loss='mse')
model.fit(tf.random.normal((100,2)), tf.random.normal((100,1)), epochs=5)
