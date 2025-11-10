package com.un.tool.jparse.parser;

import com.google.gson.Gson;
import com.un.tool.jparse.model.JavaFileSet;

import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

public class JdkJavaFileIndexer {
    private String javaSrcRoot;
    private String cacheOutRoot;

    private final Stack<String> NAME_STACK = new Stack<>();

    private final Gson gson = new Gson();

    private final Map<String, JavaFileSet> MAP_CLZ = new HashMap<>();

    public JdkJavaFileIndexer(String srcRoot, String outRoot) {
        javaSrcRoot = srcRoot;
        cacheOutRoot = outRoot;
    }

    public void startParse() {
        if (javaSrcRoot == null || javaSrcRoot.isEmpty()) {
            return;
        }

        File rootDir = new File(javaSrcRoot);
        if (!rootDir.exists()) {
            return;
        }

        handleDir(rootDir);
    }

    /**
     * 递归遍历目录，构建文件名→路径/类名的映射
     */
    private void handleDir(File dir) {
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

        File f = new File(cacheOutRoot + "\\jdk21_index.json");
        try {
            f.getParentFile().mkdirs();
            if (f.exists()) {
                f.delete();
            }
            f.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }

        try (FileWriter writer = new FileWriter(f)) {
            gson.toJson(MAP_CLZ, writer);
            System.out.println("索引已保存到 jdk_index.json");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void handleModuleJava(File parent) {
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

    private String buildPackageName() {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i < NAME_STACK.size(); i++) {
            sb.append(NAME_STACK.get(i));
            sb.append(".");
        }
        return sb.substring(0, sb.length() - 1);
    }
}