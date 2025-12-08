package com.un.tool.jparse.parser;

import com.un.tool.jparse.model.JavaFileSet;

import java.io.File;

public interface IJavaParser {
    void parse(File file, JavaFileSet set);
}
