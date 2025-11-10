package script;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Antlr4G4Parser {
    public static void main(String[] args) {
        try {
            // 拆分命令：第一个元素是 "java"，后续是参数
            String[] command = {
                    "java",  // 可执行程序（java 命令）
                    "-jar", "libs/antlr-4.13.2-complete.jar",  // ANTLR4 工具包路径
                    "-visitor",  // 生成 Visitor
                    "g4/java/JavaLexer.g4",  // 词法规则文件
                    "g4/java/JavaParser.g4",  // 语法规则文件
                    "-package", "antlr4",
                    "-o", "src/antlr4/"  // 输出目录
            };

            // 启动进程执行命令
            Process process = new ProcessBuilder(Arrays.asList(command))
                    .inheritIO()  // 输出重定向到当前控制台（方便查看日志）
                    .start();

            // 等待命令执行完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("ANTLR4 生成代码成功！");
            } else {
                System.err.println("ANTLR4 生成代码失败，退出码：" + exitCode);
            }

        } catch (IOException e) {
            System.err.println("命令执行失败：" + e.getMessage());
            e.printStackTrace();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            e.printStackTrace();
        }
    }
}