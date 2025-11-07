package script;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.*;

public class JdkJavaFileIndexer {
    // 存储：Key=文件名（如 String.java），Value=文件绝对路径
    private static final Map<String, String> FILE_NAME_TO_PATH = new HashMap<>();
    // 可选：存储文件名到完整类名的映射（如 String.java → java.lang.String）
    private static final Map<String, String> FILE_NAME_TO_FULL_CLASS = new HashMap<>();

    private static final String JDK_SRC_ROOT = "C:\\Program Files\\Java\\jdk-21\\lib\\src";

    private static final Stack<String> NAME_STACK = new Stack<>();

    private static final Gson gson = new Gson();

    private static final Map<String, JavaFileSet> MAP_CLZ = new HashMap<>();

    public static void main(String[] args) {
        File rootDir = new File(JDK_SRC_ROOT);
        handleDir(rootDir);
    }

    /**
     * 递归遍历目录，构建文件名→路径/类名的映射
     */
    private static void handleDir(File dir) {
        if (!dir.exists() || !dir.isDirectory() || !dir.canRead()) {
            return;
        }

        File[] files = dir.listFiles();
        if (files == null) {
            return;
        }

        for (File file : files) {
            if (file.isDirectory()) {
                File[] children = file.listFiles(new FilenameFilter() {
                    @Override
                    public boolean accept(File dir, String name) {
                        return "module-info.java".equals(name);
                    }
                });
                if (children == null || children.length == 0) {
                    handleDir(file);
                } else {
                    NAME_STACK.push(file.getName());
                    handleModuleJava(file);
                    NAME_STACK.pop();
                }
            }
        }

        for (JavaFileSet s : MAP_CLZ.values()) {
            s.calCount();
        }

        try (FileWriter writer = new FileWriter("jdk21_index.json")) {
            gson.toJson(MAP_CLZ, writer);
            System.out.println("索引已保存到 jdk_index.json");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleModuleJava(File parent) {
        if (!parent.exists() || !parent.isDirectory() || !parent.canRead()) {
            return;
        }

        File[] subFiles = parent.listFiles();
        if (subFiles == null) {
            return;
        }

        for (File f : subFiles) {
            if (f.isDirectory()) {
                NAME_STACK.push(f.getName());
                handleModuleJava(f);
                NAME_STACK.pop();
            } else {
                String fileName = f.getName();
                String lowercaseName = fileName.toLowerCase();
                if ("module-info.java".equals(fileName)) {
                    //ignore
                } else if ("package-info.java".equals(fileName)) {
                    //ignore
                } else if (lowercaseName.endsWith("java")) {
                    String packageName = buildPackageName();
                    JavaFileSet javaFileSet = MAP_CLZ.putIfAbsent(packageName, new JavaFileSet(packageName));
                    if (javaFileSet != null) {
                        javaFileSet.add(fileName.substring(0, fileName.indexOf(".java")));
                    }
                } else {
                    //ignore
                }
            }
        }
    }

    private static String buildPackageName() {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i < NAME_STACK.size(); i++) {
            sb.append(NAME_STACK.get(i));
            sb.append(".");
        }
        return sb.substring(0, sb.length() - 1);
    }
}