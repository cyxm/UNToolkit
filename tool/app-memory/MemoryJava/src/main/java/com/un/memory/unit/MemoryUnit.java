package com.un.memory.unit;

import java.util.List;
import java.util.Map;

public class MemoryUnit {
    int id;
    String info;
    List<Integer> next;
    List<Integer> strength;
    List<Integer> time;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}
