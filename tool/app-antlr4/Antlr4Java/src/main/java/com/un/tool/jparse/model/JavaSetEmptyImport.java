package com.un.tool.jparse.model;

import java.util.ArrayList;
import java.util.List;

public class JavaSetEmptyImport {
    private int count = 0;

    private List<String> emptyImport = null;

    public void add(String file) {
        if (emptyImport == null) {
            emptyImport = new ArrayList<>();
        }
        emptyImport.add(file);
    }
}