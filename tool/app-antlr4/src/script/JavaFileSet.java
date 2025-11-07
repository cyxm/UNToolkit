package script;

import java.util.ArrayList;
import java.util.List;

public class JavaFileSet {
    String moduleName = "";
    int count = 0;
    List<String> javaNames = new ArrayList<>();

    public JavaFileSet(String moduleName) {
        this.moduleName = moduleName;
    }

    public void add(String javaName) {
        javaNames.add(javaName);
    }

    public void calCount() {
        count = javaNames.size();
    }
}
