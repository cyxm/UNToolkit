package com.un.tool.jparse.script;

import com.google.gson.Gson;
import com.un.tool.antlr4.JavaLexer;
import com.un.tool.antlr4.JavaParser;
import com.un.tool.antlr4.JavaParserBaseVisitor;
import com.un.tool.jparse.model.JavaFileSet;
import com.un.tool.jparse.model.result.ResultImport;
import com.un.tool.jparse.model.result.ResultPackage;
import com.un.tool.jparse.model.result.ResultSingleFile;
import com.un.tool.jparse.parser.SingleJavaFileParser;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Test2 {
    public static void main(String[] args) {
//        String javaFilePath = "C:\\Program Files\\Java\\jdk-21\\lib\\src\\java.base\\java\\math\\BigDecimal.java";
//        String javaFilePath = "C:\\Program Files\\Java\\jdk-21\\lib\\src\\java.base\\java\\lang\\String.java";
        String javaFilePath = "E:\\third\\UNToolkit\\tool\\app-antlr4\\Antlr4Java\\src\\main\\java\\com\\un\\tool\\jparse\\test\\Test.java";

        CharStream input = null;
        try {
            input = CharStreams.fromFileName(javaFilePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (input == null) {
            return;
        }

        ResultSingleFile resultSingleFile = new ResultSingleFile();

        JavaLexer lexer = new JavaLexer(input);
        CommonTokenStream tokens = new CommonTokenStream(lexer);

        JavaParser parser = new JavaParser(tokens);
        JavaParser.CompilationUnitContext tree = parser.compilationUnit();

        JavaFileSet javaFileSet = new JavaFileSet();
        SingleJavaFileParser.parse(new File(javaFilePath), javaFileSet);

        System.out.println(new Gson().toJson(javaFileSet));
    }
}
