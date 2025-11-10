package com.un.tool.jparse.script;

import com.un.tool.antlr4.JavaLexer;
import com.un.tool.antlr4.JavaParser;
import com.un.tool.antlr4.JavaParserBaseVisitor;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

import java.io.IOException;

public class Test2 {
    public static void main(String[] args) {
        String javaFilePath = "C:\\Program Files\\Java\\jdk-21\\lib\\src\\java.base\\java\\math\\BigDecimal.java";

        CharStream input = null;
        try {
            input = CharStreams.fromFileName(javaFilePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (input == null) {
            return;
        }

        JavaLexer lexer = new JavaLexer(input);
        CommonTokenStream tokens = new CommonTokenStream(lexer);

        JavaParser parser = new JavaParser(tokens);
        ParseTree tree = parser.compilationUnit();
        tree.accept(new JavaParserBaseVisitor<>() {
            @Override
            public Object visitClassDeclaration(JavaParser.ClassDeclarationContext ctx) {
                System.out.println(ctx.identifier().getText());
                return super.visitClassDeclaration(ctx);
            }
        });
    }
}
