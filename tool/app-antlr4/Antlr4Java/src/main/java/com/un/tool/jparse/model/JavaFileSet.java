package com.un.tool.jparse.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JavaFileSet {
    private int count = 0;
    private Map<String, List<String>> clz = null;
    private Map<String, List<String>> inf = null;
    private Map<String, List<String>> enm = null;
    private Map<String, List<String>> ano = null;
    private Map<String, List<String>> rcd = null;

    private List<String> pureClz = null;
    private List<String> pureInf = null;
    private List<String> pureEnm = null;
    private List<String> pureAno = null;
    private List<String> pureRcd = null;

    public void addPureClz(List<String> names) {
        if (pureClz == null) {
            pureClz = new ArrayList<>();
        }
        pureClz.addAll(names);
    }

    public void addPureInf(List<String> names) {
        if (pureInf == null) {
            pureInf = new ArrayList<>();
        }
        pureInf.addAll(names);
    }

    public void addPureEnm(List<String> names) {
        if (pureEnm == null) {
            pureEnm = new ArrayList<>();
        }
        pureEnm.addAll(names);
    }

    public void addPureAno(List<String> names) {
        if (pureAno == null) {
            pureAno = new ArrayList<>();
        }
        pureAno.addAll(names);
    }

    public void addPureRcd(List<String> names) {
        if (pureRcd == null) {
            pureRcd = new ArrayList<>();
        }
        pureRcd.addAll(names);
    }

    public void putClz(String key, String name) {
        if (clz == null) {
            clz = new HashMap<>();
        }
        clz.computeIfAbsent(key, k -> new ArrayList<>()).add(name);
    }

    public void putInf(String key, String name) {
        if (inf == null) {
            inf = new HashMap<>();
        }
        inf.computeIfAbsent(key, k -> new ArrayList<>()).add(name);
    }

    public void putEnm(String key, String name) {
        if (enm == null) {
            enm = new HashMap<>();
        }
        enm.computeIfAbsent(key, k -> new ArrayList<>()).add(name);
    }

    public void putAno(String key, String name) {
        if (ano == null) {
            ano = new HashMap<>();
        }
        ano.computeIfAbsent(key, k -> new ArrayList<>()).add(name);
    }

    public void putRcd(String key, String name) {
        if (rcd == null) {
            rcd = new HashMap<>();
        }
        rcd.computeIfAbsent(key, k -> new ArrayList<>()).add(name);
    }

    public void calCount() {
        int clzSize = (pureClz != null) ? pureClz.size() : 0;
        int infSize = (pureInf != null) ? pureInf.size() : 0;
        int enmSize = (pureEnm != null) ? pureEnm.size() : 0;
        int anoSize = (pureAno != null) ? pureAno.size() : 0;
        int rcdSize = (pureRcd != null) ? pureRcd.size() : 0;
        count = clzSize + infSize + enmSize + anoSize + rcdSize;
    }

    public int getCount() {
        return count;
    }
}