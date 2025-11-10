package com.un.tool.jparse.model;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class ModuleSet {

    private String name;
    private int count = 0;
    private final Map<String, JavaFileSet> map = new HashMap<>();

    public ModuleSet(String moduleName) {
        this.name = moduleName;
    }

    public JavaFileSet computeIfAbsent(String key, Function<String, JavaFileSet> mappingFunction) {
        return map.computeIfAbsent(key, mappingFunction);
    }

    public void calCount() {
        for (JavaFileSet s : map.values()) {
            s.calCount();
        }
        count = map.size();
    }
}
