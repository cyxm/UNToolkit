package com.un.tool.jparse.parser;

import com.un.tool.antlr4.JavaLexer;
import com.un.tool.antlr4.JavaParser;
import com.un.tool.antlr4.JavaParserBaseVisitor;
import com.un.tool.jparse.model.JavaFile;
import com.un.tool.jparse.model.JavaFileSet;
import com.un.tool.jparse.model.result.ResultSingleFile;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;

import java.io.File;
import java.io.IOException;

public class SingleJavaFileParser {

    public static void parse(File f, JavaFileSet javaFileSet) {
        String javaFilePath = f.getAbsolutePath();
        String javaFileName = f.getName();
        String javaFileNameWithNoSuffix = javaFileName.substring(0, javaFileName.indexOf(".java"));
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

        handleClzDefine(javaFileNameWithNoSuffix, tree, javaFileSet);
    }

    /**
     * 处理clz定义
     */
    private static void handleClzDefine(
            String javaFileName,
            JavaParser.CompilationUnitContext tree,
            JavaFileSet result
    ) {
        JavaFile file = new JavaFile();
        tree.accept(new JavaParserBaseVisitor<>() {
            @Override
            public Object visitClassDeclaration(JavaParser.ClassDeclarationContext ctx) {
                file.addClz(ctx.identifier().getText());
                return super.visitClassDeclaration(ctx);
            }

            @Override
            public Object visitInterfaceDeclaration(JavaParser.InterfaceDeclarationContext ctx) {
                file.addInf(ctx.identifier().getText());
                return super.visitInterfaceDeclaration(ctx);
            }

            @Override
            public Object visitEnumDeclaration(JavaParser.EnumDeclarationContext ctx) {
                file.addEnm(ctx.identifier().getText());
                return super.visitEnumDeclaration(ctx);
            }

            @Override
            public Object visitAnnotationTypeDeclaration(JavaParser.AnnotationTypeDeclarationContext ctx) {
                file.addAno(ctx.identifier().getText());
                return super.visitAnnotationTypeDeclaration(ctx);
            }

            @Override
            public Object visitRecordDeclaration(JavaParser.RecordDeclarationContext ctx) {
                file.addRcd(ctx.identifier().getText());
                return super.visitRecordDeclaration(ctx);
            }
        });
        if (file.isPureClz()) {
            result.addPureClz(file.getClz());
        } else if (file.isPureInf()) {
            result.addPureInf(file.getInf());
        } else if (file.isPureEnm()) {
            result.addPureEnm(file.getEnm());
        } else if (file.isPureAno()) {
            result.addPureAno(file.getAno());
        } else if (file.isPureRcd()) {
            result.addPureRcd(file.getRcd());
        }
    }
}
