package com.un.memory.assist;

import com.un.memory.all.MemoryAll;
import com.un.memory.unit.MemoryUnit;

public class LearnUtil {

    public static void learnSimpleEntity(MemoryAll all, String entityName) {
        if (all == null) {
            return;
        }

        MemoryUnit unit = all.checkSingleType(AreaType.CODE_CHAR, entityName);
        if (unit == null) {
            MemoryUtil.addArea(all, AreaType.CODE_CHAR);
        } else {

        }
    }
}
