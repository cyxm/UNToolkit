package script;

import antlr4.JavaLexer;
import antlr4.JavaParser;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

import java.io.IOException;

public class Antlr4Test {
    public static void main(String[] args) {
        String javaFilePath = "test/AllInOne11.java";

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

        JavaFileVisitor visitor = new JavaFileVisitor();
        visitor.visit(tree);

        System.out.println("解析结果:");
        int checkSuq = 1;

        checkPackage(checkSuq, visitor);
        checkSuq++;

        checkImport(checkSuq, visitor);
        checkSuq++;

        checkClass(checkSuq, visitor);
        checkSuq++;
    }

    private static void checkClass(int checkSuq, JavaFileVisitor visitor) {
        System.out.print(checkSuq + ":");
        if (visitor.classInfo.validate()) {
            System.out.println("SUCCESS:类名:");
            for (String clz : visitor.classInfo.clzNames) {
                System.out.println(clz);
            }
        } else {
            System.out.println("ERROR:未定义类");
        }
    }

    public static void checkPackage(int checkSuq, JavaFileVisitor visitor) {
        System.out.print(checkSuq + ":");
        if (visitor.packageInfo.validate()) {
            System.out.println("SUCCESS:包名:");
            System.out.println(visitor.packageInfo.name);
        } else {
            System.out.println("ERROR:未定义包名");
        }
    }

    private static void checkImport(int checkSuq, JavaFileVisitor visitor) {
        System.out.print(checkSuq + ":");
        if (visitor.importInfo.validate()) {
            System.out.println("SUCCESS:导入数量:" + visitor.importInfo.importNames.size());
            for (String name : visitor.importInfo.importNames) {
                System.out.println(name);
            }
        } else {
            System.out.println("INFO:未导入外部类型");
        }
    }
}
