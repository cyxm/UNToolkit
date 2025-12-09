package com.un.tool.jparse.parser;

import com.un.tool.jparse.model.ModuleSet;

import java.io.File;

public interface IJavaParser {
    void parse(File file, ModuleSet set);
}
