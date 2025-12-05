package com.un.tool.jparse.model;

import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

public class ModuleSet {

    private int _c = 0;

    private transient final Stack<String> packageName = new Stack<>();
    private Map<String, ModuleSet> _m = null;
    private JavaFileSet _f;

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
        if (_m == null) {
            _m = new HashMap<>();
        }
        _m.put(module.getPackage(), module);
    }

    public void updateInfo() {
        if (_f != null) {
            _f.calCount();
            _c = _f.getCount();
        }

        if (_m == null) {
            return;
        }
        for (ModuleSet s : _m.values()) {
            s.updateInfo();
            _c += s.get_c();
        }
    }

    public int get_c() {
        return _c;
    }

    public JavaFileSet get_f() {
        if (_f == null) {
            _f = new JavaFileSet();
        }
        return _f;
    }
}
