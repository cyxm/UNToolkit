package com.un.memory.all;

import com.un.memory.assist.MemoryUtil;
import com.un.memory.net.MemoryArea;
import com.un.memory.unit.MemoryUnit;

import java.awt.print.PrinterGraphics;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class MemoryAll {
    MemoryMeta meta = new MemoryMeta();

    /**
     * areaType->minSeq->area
     */
    Map<Integer, Map<Integer, MemoryArea>> areas = new HashMap<>();

    public void checkAllArea(Function<MemoryArea, Void> func) {
        if (areas == null) {
            return;
        }

        for (Map<Integer, MemoryArea> singleTypeAreas : areas.values()) {
            for (MemoryArea a : singleTypeAreas.values()) {
                func.apply(a);
            }
        }
    }

    public MemoryUnit checkSingleType(int areaType, String entityName) {
        if (areas == null) {
            return null;
        }

        Map<Integer, MemoryArea> singleTypeAreas = areas.get(areaType);
        if (singleTypeAreas == null) {
            return null;
        }

        for (MemoryArea a : singleTypeAreas.values()) {
            MemoryUnit unit = a.searchUnit(entityName);
            if (unit != null) {
                return unit;
            }
        }
        return null;
    }

    public void addArea(Integer areaType, Integer key, MemoryArea area) {
        if (areas == null) {
            return;
        }

        areas.computeIfAbsent(areaType, integer -> new HashMap<>())
                .put(key, area);
    }

    public MemoryMeta getMeta() {
        return meta;
    }

    public void setMeta(MemoryMeta meta) {
        this.meta = meta;
    }
}
