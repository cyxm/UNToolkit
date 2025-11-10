package com.un.tool.jparse.script;

import com.un.tool.jparse.parser.JdkJavaFileIndexer;

public class Test {
    public static void main(String[] args) {
        JdkJavaFileIndexer indexer = new JdkJavaFileIndexer(
                "C:\\Program Files\\Java\\jdk-21\\lib\\src",
                "E:\\third\\UNToolkit\\tool\\app-antlr4\\Antlr4Java\\cache\\jdk21"
        );
        indexer.startParse();
    }
}
