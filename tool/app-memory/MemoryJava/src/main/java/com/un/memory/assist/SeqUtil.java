package com.un.memory.assist;

import com.un.memory.all.MemoryAll;
import com.un.memory.net.MemoryArea;

/**
 * 辅助管理全局序号
 */
public class SeqUtil {

    /**
     *
     */
    public static final int GROUP_SIZE = 10000;

    public static void assignGroup(MemoryAll all) {
        if (all == null) {
            return;
        }
        int startSeq = all.getStartSeq();
        new MemoryArea(startSeq,GROUP_SIZE);
    }
}
