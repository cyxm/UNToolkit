package com.un.memory.all;

import com.un.memory.net.MemoryArea;

import java.util.HashMap;
import java.util.Map;

public class MemoryMeta {

    /**
     * 区域大小
     */
    public final int GROUP_SIZE = 10000;

    /**
     * 可用的开始序列号
     */
    int startSeq = 0;

    public int getStartSeq() {
        return startSeq;
    }

    public void increaseStartSeq() {
        this.startSeq += GROUP_SIZE;
    }

    public int getGroupSize() {
        return GROUP_SIZE;
    }
}
