package com.un.tool.jparse.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JavaFile {
    String name = "";
    int count = 0;
    List<String> clz = null;
    List<String> inf = null;
    List<String> enm = null;
    List<String> ano = null;
    List<String> rcd = null;

    public boolean isPureClz() {
        int checkCount = getClzSize();
        int count = getInfSize() + getEnmSize() + getAnoSize() + getRcdSize();
        return checkCount > 0 && count == 0;
    }

    public boolean isPureInf() {
        int checkCount = getInfSize();
        int count = getClzSize() + getEnmSize() + getAnoSize() + getRcdSize();
        return checkCount > 0 && count == 0;
    }

    public boolean isPureEnm() {
        int checkCount = getEnmSize();
        int count = getInfSize() + getClzSize() + getAnoSize() + getRcdSize();
        return checkCount > 0 && count == 0;
    }

    public boolean isPureAno() {
        int checkCount = getAnoSize();
        int count = getInfSize() + getEnmSize() + getClzSize() + getRcdSize();
        return checkCount > 0 && count == 0;
    }

    public boolean isPureRcd() {
        int checkCount = getRcdSize();
        int count = getInfSize() + getEnmSize() + getAnoSize() + getClzSize();
        return checkCount > 0 && count == 0;
    }

    public int getClzSize() {
        return clz == null ? 0 : clz.size();
    }

    public int getInfSize() {
        return inf == null ? 0 : inf.size();
    }

    public int getEnmSize() {
        return enm == null ? 0 : enm.size();
    }

    public int getAnoSize() {
        return ano == null ? 0 : ano.size();
    }

    public int getRcdSize() {
        return rcd == null ? 0 : rcd.size();
    }

    public List<String> getClz() {
        return clz;
    }

    public List<String> getInf() {
        return inf;
    }

    public List<String> getEnm() {
        return enm;
    }

    public List<String> getAno() {
        return ano;
    }

    public List<String> getRcd() {
        return rcd;
    }

    public void addClz(String name) {
        if (clz == null) {
            clz = new ArrayList<>();
        }
        clz.add(name);
    }

    public void addInf(String name) {
        if (inf == null) {
            inf = new ArrayList<>();
        }
        inf.add(name);
    }

    public void addEnm(String name) {
        if (enm == null) {
            enm = new ArrayList<>();
        }
        enm.add(name);
    }

    public void addAno(String name) {
        if (ano == null) {
            ano = new ArrayList<>();
        }
        ano.add(name);
    }

    public void addRcd(String name) {
        if (rcd == null) {
            rcd = new ArrayList<>();
        }
        rcd.add(name);
    }
}
