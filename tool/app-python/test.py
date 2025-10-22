# encoding=UTF-8
import ast
from pathlib import Path

if __name__ == "__main__":
    package_dir = Path(__file__).parent
    file_path = package_dir / "to_parse.py"
    
    try:
        # 以只读模式打开，指定编码为 utf-8（避免中文乱码）
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()  # 读取全部内容
            print(ast.dump(ast.parse(content)))
    except FileNotFoundError:
        print(f"错误：未找到文件 {file_path}")
    except UnicodeDecodeError:
        print(f"错误：文件 {file_path} 编码不是 utf-8，无法解析")
    except Exception as e:
        print(f"打开文件失败：{e}")