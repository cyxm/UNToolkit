package com.un.memory.assist;

import com.un.memory.all.MemoryAll;
import com.un.memory.unit.MemoryUnit;

import java.util.ArrayList;
import java.util.List;

public class LearnUtil {

    /**
     * 学习简单的实体
     */
    public static void learnSimpleEntity(MemoryAll all, String entityCode, String entityName) {
        if (entityCode == null || entityCode.isEmpty()
                || entityName == null || entityName.isEmpty()) {
            return;
        }

        List<MemoryUnit> unitChars = new ArrayList<>();
        entityName.codePoints()
                .mapToObj(Character::toString)
                .forEach(s -> {
                    MemoryUnit unitChar = all.addUnit(AreaType.CODE_CHAR, s);
                    unitChars.add(unitChar);
                });

        MemoryUnit unitSemantic = all.addUnit(AreaType.ENTITY_SEMANTIC, entityCode);

        //建立字符到简单实体的联系
        MemoryUnit lastUnit = null;
        for (int i = 0; i < unitChars.size(); i++) {
            MemoryUnit unit = unitChars.get(i);
            //按顺序建立上下字符间的联系
            if (lastUnit != null) {
                lastUnit.setNextWeak(unit);
            }

            //实体语义到字符的联系
            if (lastUnit == null) {
                unitSemantic.setNextStrong(unit);
                unit.setNextStrong(unitSemantic);
            } else {
                unitSemantic.setNextWeak(unit);
                unit.setNextWeak(unitSemantic);
            }

            lastUnit = unit;
        }
    }
}
