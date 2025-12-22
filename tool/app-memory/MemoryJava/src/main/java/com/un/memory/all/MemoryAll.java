package com.un.memory.all;

import com.un.memory.net.MemoryArea;
import com.un.memory.unit.MemoryUnit;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
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
        for (Map<Integer, MemoryArea> singleTypeAreas : areas.values()) {
            for (MemoryArea a : singleTypeAreas.values()) {
                func.apply(a);
            }
        }
    }

    /**
     * 遍历某一类型区域
     * 如果func返回true,表示已处理此区域
     */
    public void checkSingleTypeArea(int areaType, Function<MemoryArea, Boolean> func) {
        Map<Integer, MemoryArea> map = areas.get(areaType);
        if (map == null) {
            return;
        }

        for (MemoryArea a : map.values()) {
            if (func.apply(a)) {
                return;
            }
        }
    }

    /**
     * 查找某一区域中的单元
     */
    public MemoryUnit findUnit(int areaType, String entityName) {
        Map<Integer, MemoryArea> singleTypeAreas = areas.get(areaType);
        if (singleTypeAreas == null) {
            return null;
        }

        for (MemoryArea a : singleTypeAreas.values()) {
            MemoryUnit unit = a.findUnit(entityName);
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
    private MemoryArea addArea(int areaType) {
        MemoryArea area = new MemoryArea(areaType, meta.getStartSeq(), meta.getGroupSize());
        addArea(areaType, meta.getStartSeq(), area);
        meta.increaseStartSeq();

        return area;
    }

    /**
     * 添加单元,不检查是否存在
     */
    public MemoryUnit addUnit(Integer areaType, String entityName) {
        AtomicReference<MemoryUnit> result = new AtomicReference<>();
        checkSingleTypeArea(areaType, memoryArea -> {
            if (memoryArea.haveEmptyPlace()) {
                result.set(memoryArea.addUnit(entityName));
                return true;
            } else {
                return false;
            }
        });

        if (result.get() == null) {
            MemoryArea area = addArea(areaType);
            result.set(area.addUnit(entityName));
        }

        return result.get();
    }

    public MemoryMeta getMeta() {
        return meta;
    }

    public void setMeta(MemoryMeta meta) {
        this.meta = meta;
    }
}
