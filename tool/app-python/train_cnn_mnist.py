# encoding=UTF-8
# 导入PyTorch核心库（模型、张量、优化器等）
import numpy as np
import torch
from matplotlib import pyplot as plt
from torch import nn, optim
# 导入数据加载工具（批量读取数据）
from torch.utils.data import DataLoader
# 导入torchvision库（加载MNIST数据集、图像转换工具）
from torchvision import datasets, transforms

# 导入可视化库（可选，用于看训练结果）

# --------------------------
# 1. 数据准备：加载MNIST手写数字数据集
# --------------------------
# 数据转换规则：把图像转为张量 + 归一化（让数据更适合模型训练）
transform = transforms.Compose([
    transforms.ToTensor(),  # 把PIL图像（28×28）转为PyTorch张量，形状变为(1,28,28)
    # 归一化：MNIST数据集的均值是0.1307，标准差是0.3081（行业通用值，直接用）
    transforms.Normalize((0.1307,), (0.3081,))
])

# 下载并加载训练集（6万张图片，用于训练模型）
train_dataset = datasets.MNIST(
    root='D:/datasets/',  # 数据集保存路径（在工程文件夹下新建data文件夹）
    train=True,  # 表示加载训练集
    download=False,  # 第一次运行会自动下载（约10MB，需联网）
    transform=transform  # 应用上面定义的转换规则
)

# 下载并加载测试集（1万张图片，用于验证模型效果）
test_dataset = datasets.MNIST(
    root='D:/datasets/',
    train=False,  # 表示加载测试集
    download=False,
    transform=transform
)

# 数据加载器：批量读取数据（避免一次性加载占用太多内存）
train_loader = DataLoader(
    train_dataset,
    batch_size=64,  # 每次读64张图片（批量大小，可调整）
    shuffle=True  # 训练时打乱数据顺序，让模型学得更全面
)

test_loader = DataLoader(
    test_dataset,
    batch_size=1000,  # 测试时一次读1000张，速度更快
    shuffle=False  # 测试时不需要打乱顺序
)

# （可选）查看数据格式，确认是否正确（第一次写可以加，后续可删除）
print("训练集图片数量：", len(train_dataset))  # 应该输出60000
print("测试集图片数量：", len(test_dataset))  # 应该输出10000
print("单张图片形状：", train_dataset[0][0].shape)  # 应该输出torch.Size([1,28,28])


# --------------------------
# 2. 定义CNN模型（核心部分）
# --------------------------
class SimpleCNN(nn.Module):
    # 初始化模型结构（定义各层组件）
    def __init__(self):
        super(SimpleCNN, self).__init__()  # 固定写法，继承nn.Module的属性

        # 第1层：卷积层（提取图像的边缘、拐角等基础特征）
        self.conv1 = nn.Conv2d(
            in_channels=1,  # 输入通道数：1（MNIST是灰度图，只有1个通道）
            out_channels=15,  # 输出通道数：10（用10个卷积核，提取10种特征）
            kernel_size=5  # 卷积核大小：5×5（每次看5×5的像素区域）
        )

        # 第2层：池化层（减少特征图尺寸，降低计算量，增强鲁棒性）
        self.pool = nn.MaxPool2d(
            kernel_size=2  # 池化核大小：2×2（把2×2区域的最大值作为结果）
        )

        # 第3层：全连接层（把卷积提取的特征映射到10个数字类别）
        self.fc1 = nn.Linear(
            # 输入特征数：10（通道数）×12（池化后高度）×12（池化后宽度）
            # 计算逻辑：28（原图高）-5（卷积核高）+1=24 → 池化后24/2=12
            in_features=15 * 12 * 12,
            out_features=10  # 输出特征数：10（对应0-9十个数字）
        )

    # 前向传播（定义数据在模型中的流动路径）
    def forward(self, x):
        # 路径：卷积层 → 激活函数（ReLU） → 池化层
        x = self.pool(torch.relu(self.conv1(x)))
        # 把特征图展平成一维向量（全连接层只能处理一维数据）
        # -1表示自动计算批量大小对应的维度，避免手动算错
        x = x.view(-1, 15 * 12 * 12)
        # 路径：全连接层（输出10个类别的得分）
        x = self.fc1(x)
        return x


# --------------------------
# 3. 初始化模型、损失函数、优化器
# --------------------------
# 选择设备：有GPU用GPU（训练更快），没有用CPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print("使用的设备：", device)  # 输出cuda或cpu

# 初始化模型，并移动到指定设备
model = SimpleCNN().to(device)

# 损失函数：交叉熵损失（分类任务的常用损失函数）
criterion = nn.CrossEntropyLoss()

# 优化器：Adam（常用的优化器，比SGD收敛更快）
optimizer = optim.Adam(
    model.parameters(),  # 优化模型的所有参数
    lr=0.001  # 学习率：0.001（控制参数更新的步长，太大容易震荡，太小收敛慢）
)


# --------------------------
# 4. 训练模型（让模型学习）
# --------------------------
def train_model(epochs=3):  # epochs：训练轮次，3轮足够看到效果
    model.train()  # 把模型设为训练模式（启用 dropout 等训练特有的操作，这里没有但习惯加上）
    for epoch in range(epochs):  # 循环训练多轮
        running_loss = 0.0  # 记录每轮的总损失
        # 遍历训练集的每个批次
        for batch_idx, (data, target) in enumerate(train_loader):
            # 把数据和标签移动到指定设备（GPU/CPU）
            data, target = data.to(device), target.to(device)

            # 重要：每次训练前清空梯度（避免上一轮的梯度影响当前轮）
            optimizer.zero_grad()
            # 前向传播：用当前模型预测结果
            outputs = model(data)
            # 计算损失（预测结果和真实标签的差距）
            loss = criterion(outputs, target)
            # 反向传播：计算参数的梯度（指导参数如何调整）
            loss.backward()
            # 优化器更新参数（根据梯度调整参数，让损失变小）
            optimizer.step()

            # 累加损失值
            running_loss += loss.item()

            # 每100个批次打印一次进度（避免输出太多，影响查看）
            if batch_idx % 100 == 99:
                # 计算平均损失：总损失 / 100（因为每100个批次打印一次）
                avg_loss = running_loss / 100
                print(f'轮次：{epoch + 1}/{epochs} | 批次：{batch_idx + 1} | 平均损失：{avg_loss:.4f}')
                running_loss = 0.0  # 重置损失计数器


# --------------------------
# 5. 测试模型（验证模型效果）
# --------------------------
def test_model():
    model.eval()  # 把模型设为测试模式（关闭 dropout 等，确保结果稳定）
    correct = 0  # 记录正确预测的数量
    total = 0  # 记录总测试数量

    # 测试时不计算梯度（节省内存，加快速度）
    with torch.no_grad():
        # 遍历测试集的每个批次
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            # 用训练好的模型预测
            outputs = model(data)
            # 取预测得分最高的类别（outputs.argmax(1)：按第1维度找最大值的索引）
            _, predicted = torch.max(outputs.data, 1)
            # 累加总测试数量
            total += target.size(0)
            # 累加正确预测的数量（预测类别 == 真实类别）
            correct += (predicted == target).sum().item()

    # 计算测试准确率
    accuracy = 100 * correct / total
    print(f'\n测试集准确率：{accuracy:.2f}%')  # 正常情况下能达到97%以上


# --------------------------
# （可选）可视化模型预测结果
# --------------------------
def visualize_prediction():
    model.eval()
    # 取测试集中的前5张图片
    data_iter = iter(test_loader)
    images, labels = next(data_iter)
    images, labels = images.to(device), labels.to(device)

    # 模型预测
    outputs = model(images)
    _, predicted = torch.max(outputs, 1)

    # 显示图片和预测结果
    plt.figure(figsize=(10, 4))
    for i in range(5):
        # 把张量转回图片格式（调整维度：(1,28,28) → (28,28)）
        img = images[i].cpu().numpy().squeeze()
        # 绘制图片
        plt.subplot(1, 5, i + 1)
        plt.imshow(img, cmap='gray')
        # 标注真实标签和预测标签
        plt.title(f'真实：{labels[i].item()}\n预测：{predicted[i].item()}')
        plt.axis('off')  # 隐藏坐标轴
    plt.show()


# --------------------------
# 执行训练和测试（入口代码）
# --------------------------
if __name__ == '__main__':
    # print("开始训练模型...")
    # train_model(epochs=3)  # 训练3轮
    # print("训练结束，开始测试模型...")
    # test_model()  # 测试模型
    #
    # # （可选）保存训练好的模型（后续想用不用再训练）
    # torch.save(model.state_dict(), './simple_cnn_model.pth')
    # print("模型已保存到：./simple_cnn_model.pth")
    #
    # # 执行可视化
    # visualize_prediction()

    conv_kernal = np.random.rand(3, 3)

    plt.imshow(conv_kernal, cmap='gray')
    plt.title('df')
    plt.show()
