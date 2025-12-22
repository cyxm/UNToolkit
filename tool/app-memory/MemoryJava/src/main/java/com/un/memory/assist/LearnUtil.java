package com.un.memory.assist;

import com.un.memory.all.MemoryAll;
import com.un.memory.unit.MemoryUnit;

import java.util.ArrayList;
import java.util.List;

public class LearnUtil {

    /**
     * 学习简单的实体
     */
    public static void learnSimpleEntity(MemoryAll all, String entityName) {
        if (entityName == null || entityName.isEmpty()) {
            return;
        }

        List<MemoryUnit> unitChars = new ArrayList<>();
        entityName.codePoints()
                .mapToObj(Character::toString)
                .forEach(s -> {
                    MemoryUnit unitChar = all.addUnit(AreaType.CODE_CHAR, s);
                    unitChars.add(unitChar);
                });

        MemoryUnit unitSemantic = all.addUnit(AreaType.ENTITY_SEMANTIC, entityName);

        //建立字符到简单实体的联系
        long currentTime = System.currentTimeMillis();
        for (MemoryUnit unit : unitChars) {
            unit.setNext(unitSemantic.getId(), 100, currentTime);
            unitSemantic.setNext(unit.getId(), 100, currentTime);
        }
    }
}
