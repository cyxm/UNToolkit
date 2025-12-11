package com.un.memory.all;

import com.un.memory.assist.SeqUtil;
import com.un.memory.net.MemoryArea;

import java.util.HashMap;
import java.util.Map;

public class MemoryAll {
    /**
     * 可用的开始序列号
     */
    int startSeq;

    Map<String, MemoryArea> areas = new HashMap<>();

    public int getStartSeq() {
        return startSeq;
    }

    public void setStartSeq(int startSeq) {
        this.startSeq = startSeq;
    }

    public Map<String, MemoryArea> getAreas() {
        return areas;
    }
}
