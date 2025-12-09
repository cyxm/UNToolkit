package com.un.tool.jparse.model;

import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

public class ModuleSet {

    private int count = 0;

    private transient final Stack<String> packageName = new Stack<>();
    private Map<String, ModuleSet> module = null;
    private JavaFileSet fileSet;
    private JavaSetEmptyImport emptyImport;

    public void addPackage(String node) {
        packageName.push(node);
    }

    public String getPackage() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < packageName.size(); i++) {
            sb.append(packageName.get(i));
            sb.append(".");
        }
        return sb.substring(0, sb.length() - 1);
    }

    public void addSubModule(ModuleSet module) {
        if (module == null) {
            return;
        }
        if (this.module == null) {
            this.module = new HashMap<>();
        }
        this.module.put(module.getPackage(), module);
    }

    public void updateInfo() {
        if (fileSet != null) {
            fileSet.calCount();
            count = fileSet.getCount();
        }

        if (module == null) {
            return;
        }
        for (ModuleSet s : module.values()) {
            s.updateInfo();
            count += s.getCount();
        }
    }

    public int getCount() {
        return count;
    }

    public JavaFileSet getFileSet() {
        if (fileSet == null) {
            fileSet = new JavaFileSet();
        }
        return fileSet;
    }

    public void setEmptyImport(JavaSetEmptyImport javaSet) {
        emptyImport = javaSet;
    }
}
