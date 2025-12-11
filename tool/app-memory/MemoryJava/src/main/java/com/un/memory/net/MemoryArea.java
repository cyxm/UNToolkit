package com.un.memory.net;

import com.un.memory.unit.MemoryUnit;

import java.util.List;

public class MemoryArea {
    /**
     * 最小序号
     */
    int min;
    /**
     * 可包含的单元总数
     */
    int maxCount;
    /**
     * 当前包含单元数
     */
    int count;
    /**
     * 区域类型
     */
    int areaType;

    List<MemoryUnit> unitNet;

    /**
     * 此区域是否有更改
     */
    transient boolean modifyFlag = false;

    public MemoryArea(int min, int maxCount, int areaType) {
        this.min = min;
        this.maxCount = maxCount;
        this.areaType = areaType;
        this.count = 0;
        this.modifyFlag = true;
    }

    public int getMin() {
        return min;
    }

    public void setMin(int min) {
        this.min = min;
        this.modifyFlag = true;
    }

    public int getMaxCount() {
        return maxCount;
    }

    public void setMaxCount(int maxCount) {
        this.maxCount = maxCount;
        this.modifyFlag = true;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
        this.modifyFlag = true;
    }

    public int getAreaType() {
        return areaType;
    }

    public void setAreaType(int areaType) {
        this.areaType = areaType;
    }

    public boolean isModify() {
        return this.modifyFlag;
    }
}
