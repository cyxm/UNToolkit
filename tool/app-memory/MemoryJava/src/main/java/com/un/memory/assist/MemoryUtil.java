package com.un.memory.assist;

import com.sun.tools.javac.util.StringUtils;
import com.un.memory.all.MemoryAll;
import com.un.memory.all.MemoryMeta;
import com.un.memory.net.MemoryArea;
import com.un.memory.unit.MemoryUnit;

import java.util.function.Function;

public class MemoryUtil {

    public static void addArea(MemoryAll all, int areaType) {
        if (all == null) {
            return;
        }

        MemoryMeta meta = all.getMeta();
        if (meta == null) {
            return;
        }

        MemoryArea area = new MemoryArea(areaType, meta.getStartSeq(), meta.getGroupSize());
        all.addArea(areaType, meta.getStartSeq(), area);

        meta.increaseStartSeq();
    }

    public static void searchUnit(
            MemoryAll all,
            int areaType,
            String info
    ) {
        if (all == null) {
            return;
        }

        if (info == null || info.isEmpty()) {
            return;
        }

        MemoryUnit unit = all.checkSingleType(areaType, memoryArea -> memoryArea.searchUnit(info));
        if(unit==null){
            return;
        }
    }
}
