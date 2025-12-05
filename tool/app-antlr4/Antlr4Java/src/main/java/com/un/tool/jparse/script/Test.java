package com.un.tool.jparse.script;

import com.un.tool.jparse.parser.JavaModuleParser;

public class Test {
    public static void main(String[] args) {
        JavaModuleParser indexer = new JavaModuleParser(
                "C:\\Program Files\\Java\\jdk-21\\lib\\src\\java.base",
                "E:\\third\\UNToolkit\\tool\\app-antlr4\\Antlr4Java\\cache\\jdk21"
        );
        indexer.startParse();
    }
}
