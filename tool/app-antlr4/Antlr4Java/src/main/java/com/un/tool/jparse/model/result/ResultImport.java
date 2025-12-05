package com.un.tool.jparse.model.result;

import java.util.HashMap;
import java.util.Map;

public class ResultImport {
    private int result = ResultType.UNCHECK;

    public int getResult() {
        return result;
    }

    public void setResult(int result) {
        this.result = result;
    }

    private String getResultMsg() {
        return MAP.get(getResult());
    }

    @Override
    public String toString() {
        return String.format("检查依赖:%s", getResultMsg());
    }

    private static final Map<Integer, String> MAP = new HashMap<>();

    static {
        MAP.put(ResultType.UNCHECK, "ERR:未检查");
        MAP.put(ResultType.OK, "OK:通过");
    }

    public static class ResultType {
        public static final int UNCHECK = -1;
        public static final int OK = 0;
    }
}
