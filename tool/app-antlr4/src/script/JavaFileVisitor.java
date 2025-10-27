package script;

import antlr4.JavaParser;
import antlr4.JavaParserBaseVisitor;

import java.util.ArrayList;
import java.util.List;

public class JavaFileVisitor extends JavaParserBaseVisitor<Void> {
    public PackageInfo packageInfo = new PackageInfo();
    public ImportInfo importInfo = new ImportInfo();
    public ClassInfo classInfo = new ClassInfo();
    private List<MethodInfo> methods = new ArrayList<>();

    public static class PackageInfo {
        public String name = "";

        public boolean validate() {
            return name != null && !name.isEmpty();
        }
    }

    public static class ImportInfo {
        public List<String> importNames = new ArrayList<>();

        public boolean validate() {
            return importNames != null && !importNames.isEmpty();
        }
    }

    public static class ClassInfo {
        public List<String> clzNames = new ArrayList<>();

        public boolean validate() {
            return clzNames != null && !clzNames.isEmpty();
        }
    }

    // 方法信息封装类
    public static class MethodInfo {
        public String name;
        public String returnType;
        public List<String> params;

        public MethodInfo(String name, String returnType, List<String> params) {
            this.name = name;
            this.returnType = returnType;
            this.params = params;
        }
    }

    @Override
    public Void visitPackageDeclaration(JavaParser.PackageDeclarationContext ctx) {
        packageInfo.name = ctx.qualifiedName().getText();
        return super.visitPackageDeclaration(ctx);
    }

    @Override
    public Void visitImportDeclaration(JavaParser.ImportDeclarationContext ctx) {
        importInfo.importNames.add(ctx.qualifiedName().getText());
        return super.visitImportDeclaration(ctx);
    }

    @Override
    public Void visitClassDeclaration(JavaParser.ClassDeclarationContext ctx) {
        String clzName=ctx.identifier().getText();
        classInfo.clzNames.add(clzName);
        return super.visitClassDeclaration(ctx);
    }

    @Override
    public Void visitMethodDeclaration(JavaParser.MethodDeclarationContext ctx) {
        return super.visitMethodDeclaration(ctx);
    }
}
