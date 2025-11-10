package com.un.tool.jparse.model;

import java.util.ArrayList;
import java.util.List;

public class JavaFileSet {
    String name = "";
    int count = 0;
    List<String> java = new ArrayList<>();

    public JavaFileSet(String moduleName) {
        this.name = moduleName;
    }

    public void add(String javaName) {
        java.add(javaName);
    }

    public void calCount() {
        count = java.size();
    }
}
