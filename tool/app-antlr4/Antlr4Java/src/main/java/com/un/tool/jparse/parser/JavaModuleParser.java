package com.un.tool.jparse.parser;

import com.google.gson.Gson;
import com.un.tool.jparse.model.JavaFileSet;
import com.un.tool.jparse.model.ModuleSet;

import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.Paths;

public class JavaModuleParser {
    private String javaSrcRoot;
    private String cacheOutRoot;

    private final Gson gson = new Gson();

    public JavaModuleParser(String srcRoot, String outRoot) {
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
     * 递归遍历目录,处理java模块
     */
    private void handleDir(File dir) {
        if (!dir.exists() || !dir.isDirectory() || !dir.canRead()) {
            return;
        }

        boolean isModule = isModule(dir);
        if (isModule) {
            ModuleSet moduleSet = new ModuleSet();
            handleModule(dir, moduleSet);
            saveModule(moduleSet);
        } else {
            File[] files = dir.listFiles();
            if (files == null) {
                return;
            }
            for (File file : files) {
                handleDir(file);
            }
        }
    }

    /**
     * 判断文件夹是否是模块,根据是否包含module-info.java判断
     */
    private boolean isModule(File dir) {
        File[] children = dir.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return "module-info.java".equals(name);
            }
        });
        return children != null && children.length > 0;
    }

    private void saveModule(ModuleSet module) {
        module.updateInfo();

        String path = Paths.get(cacheOutRoot, module.getPackage() + ".json").toString();
        File f = new File(path);
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
            gson.toJson(module, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 此文件包含module-info.java,判断为模块
     */
    private void handleModule(File parent, ModuleSet moduleSet) {
        if (!parent.exists() || !parent.isDirectory() || !parent.canRead()) {
            return;
        }

        File[] subFiles = parent.listFiles();
        if (subFiles == null) {
            return;
        }

        moduleSet.addPackage(parent.getName());

        for (File f : subFiles) {
            if (f.isDirectory()) {
                ModuleSet subPackage = new ModuleSet();
                handlePackage(f, subPackage);
                moduleSet.addSubModule(subPackage);
            }
        }
    }

    public void handlePackage(File parent, ModuleSet moduleSet) {
        handlePackage(parent, moduleSet, new IJavaParser() {
            @Override
            public void parse(File file, JavaFileSet set) {
                SingleJavaFileParser.parse(file, set);
            }
        });
    }

    private void handlePackage(File parent, ModuleSet moduleSet, IJavaParser parser) {
        File[] subFiles = parent.listFiles();
        if (subFiles == null) {
            return;
        }

        moduleSet.addPackage(parent.getName());

        if (isSingleLinePackage(parent)) {
            handlePackage(subFiles[0], moduleSet);
        } else {
            for (File f : subFiles) {
                if (f.isDirectory()) {
                    ModuleSet subModule = new ModuleSet();
                    handlePackage(f, subModule);
                    moduleSet.addSubModule(subModule);
                } else {
                    String fileName = f.getName();
                    String lowercaseName = fileName.toLowerCase();
                    if ("module-info.java".equals(fileName)) {
                        //ignore
                    } else if ("package-info.java".equals(fileName)) {
                        //ignore
                    } else if (lowercaseName.endsWith("java")) {
                        parser.parse(f, moduleSet.getFileSet());
                    } else {
                        //ignore
                    }
                }
            }
        }
    }

    /**
     * 判断包只包含一个文件夹,即单一路径
     */
    private boolean isSingleLinePackage(File dir) {
        File[] subFiles = dir.listFiles();
        if (subFiles == null) {
            return true;
        }

        return subFiles.length == 1 && subFiles[0].isDirectory();
    }
}