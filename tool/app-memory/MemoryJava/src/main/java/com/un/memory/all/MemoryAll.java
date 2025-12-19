package com.un.memory.all;

import com.un.memory.net.MemoryArea;
import com.un.memory.unit.MemoryUnit;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * 包含所有数据
 */
public class MemoryAll {

    /**
     * 数据描述
     */
    MemoryMeta meta = new MemoryMeta();

    /**
     * 区域索引
     * areaType->minSeq->area
     */
    Map<Integer, Map<Integer, MemoryArea>> areas = new HashMap<>();

    /**
     * 遍历所有区域
     */
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

    /**
     *
     */
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

    /**
     * 添加区域
     */
    public void addArea(Integer areaType, Integer key, MemoryArea area) {
        areas.computeIfAbsent(areaType, integer -> new HashMap<>())
                .put(key, area);
    }

    /**
     * 添加某一类型的区域
     */
    private void addArea(int areaType) {
        MemoryArea area = new MemoryArea(areaType, meta.getStartSeq(), meta.getGroupSize());
        addArea(areaType, meta.getStartSeq(), area);

        meta.increaseStartSeq();
    }

    public MemoryMeta getMeta() {
        return meta;
    }

    public void setMeta(MemoryMeta meta) {
        this.meta = meta;
    }
}
