package com.un.memory.unit;

import java.util.ArrayList;
import java.util.List;

public class MemoryUnit {
    int id;
    String info;
    List<Integer> next = new ArrayList<>();
    List<Integer> strength = new ArrayList<>();
    List<Long> time = new ArrayList<>();

    public void setNextStrong(MemoryUnit nextUnit) {
        setNext(nextUnit, 100);
    }

    public void setNextWeak(MemoryUnit nextUnit) {
        setNext(nextUnit, 10);
    }

    public void setNext(MemoryUnit nextUnit, int strength) {
        if (nextUnit == null) {
            return;
        }
        setNext(nextUnit.getId(), strength, System.currentTimeMillis());
    }

    public void setNext(int nextId, int connectStrength, long updateTime) {
        next.add(nextId);
        strength.add(connectStrength);
        time.add(updateTime);
    }

    public MemoryUnit(int id, String info) {
        this.id = id;
        this.info = info;
    }

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
