package com.un.tool.jparse.script;

import com.un.tool.antlr4.JavaLexer;
import com.un.tool.antlr4.JavaParser;
import com.un.tool.antlr4.JavaParserBaseVisitor;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Test2 {
    public static void main(String[] args) {
//        String javaFilePath = "C:\\Program Files\\Java\\jdk-21\\lib\\src\\java.base\\java\\math\\BigDecimal.java";
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

        JavaLexer lexer = new JavaLexer(input);
        CommonTokenStream tokens = new CommonTokenStream(lexer);

        JavaParser parser = new JavaParser(tokens);
        JavaParser.CompilationUnitContext tree = parser.compilationUnit();

        System.out.println(tree.getRuleIndex());

        handlePackage(tree);
        handleImport(tree);
        handleTopClz(tree);
    }

    private static void handleImport(JavaParser.CompilationUnitContext tree) {
        List<String> importNames = new ArrayList<>();
        tree.accept(new JavaParserBaseVisitor<>() {
            @Override
            public Object visitImportDeclaration(JavaParser.ImportDeclarationContext ctx) {
                importNames.add(ctx.qualifiedName().getText());
                return null;
            }
        });

    }

    private static void handlePackage(JavaParser.CompilationUnitContext tree) {
        List<String> packageName = new ArrayList<>();
        tree.accept(new JavaParserBaseVisitor<>() {
            @Override
            public Object visitPackageDeclaration(JavaParser.PackageDeclarationContext ctx) {
                packageName.add(ctx.qualifiedName().getText());
                return null;
            }
        });
        int size = packageName.size();
        if (size == 1) {
            System.out.println("check package:OK");
        } else if (size == 0) {
            System.err.println("check package:no package define");
        } else {
            System.err.println("check package:multi package define");
        }
    }

    private static void handleTopClz(JavaParser.CompilationUnitContext tree) {
        tree.accept(new JavaParserBaseVisitor<>() {
            @Override
            public Object visitClassDeclaration(JavaParser.ClassDeclarationContext ctx) {
                System.out.println(ctx.identifier().getText());
                handleClz(ctx);
                return null;
            }

            @Override
            public Object visitInterfaceDeclaration(JavaParser.InterfaceDeclarationContext ctx) {
                System.out.println(ctx.identifier().getText());
                return null;
            }

            @Override
            public Object visitEnumDeclaration(JavaParser.EnumDeclarationContext ctx) {
                System.out.println(ctx.identifier().getText());
                return null;
            }
        });
    }

    private static void handleClz(JavaParser.ClassDeclarationContext ctx) {
        ctx.accept(new JavaParserBaseVisitor<>() {
            @Override
            public Object visitClassBodyDeclaration(JavaParser.ClassBodyDeclarationContext ctx) {
                ctx.accept(new JavaParserBaseVisitor<>() {
                    @Override
                    public Object visitBlock(JavaParser.BlockContext ctx) {
                        System.out.println(ctx.getText());
                        return super.visitBlock(ctx);
                    }
                });
                return null;
            }
        });
    }
}
