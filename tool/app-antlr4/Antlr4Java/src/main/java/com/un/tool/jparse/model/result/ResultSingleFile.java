package com.un.tool.jparse.model.result;

public class ResultSingleFile {
    public ResultPackage resultPackage = new ResultPackage();
    public ResultImport resultImport = new ResultImport();

    public String getString() {
        return resultPackage.toString() + "\n"
                + resultImport.toString() + "\n"
                ;
    }
}
