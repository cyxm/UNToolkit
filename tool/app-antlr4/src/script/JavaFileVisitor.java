package script;

import antlr4.JavaParser;
import antlr4.JavaParserBaseVisitor;

import java.util.ArrayList;
import java.util.List;

public class JavaFileVisitor extends JavaParserBaseVisitor<Void> {
    public PackageInfo packageInfo = new PackageInfo();
    public ImportInfo importInfo = new ImportInfo();
    // 存储解析结果
    private String className;
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
        return super.visitClassDeclaration(ctx);
    }

    @Override
    public Void visitMethodDeclaration(JavaParser.MethodDeclarationContext ctx) {
        return super.visitMethodDeclaration(ctx);
    }
}
