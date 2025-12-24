package com.un.memory.test;

import com.un.memory.all.MemoryAll;
import com.un.memory.assist.AreaType;
import com.un.memory.assist.LearnUtil;
import com.un.memory.assist.PersistUtil;

public class TestLearnImage {

    public static void main(String[] args) {
        MemoryAll all = PersistUtil.preload(TestPath.ROOT_PATH);
        PersistUtil.loadSingleTypeArea(TestPath.ROOT_PATH, AreaType.CODE_CHAR, all);

        LearnUtil.learnSimpleEntity(all, "猫", "猫");

        PersistUtil.save(TestPath.ROOT_PATH, all);
    }
}
