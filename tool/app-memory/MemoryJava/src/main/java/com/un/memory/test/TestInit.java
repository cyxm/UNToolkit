package com.un.memory.test;

import com.un.memory.all.MemoryAll;
import com.un.memory.assist.PersistUtil;

public class TestInit {
    public static void main(String[] args) {
        MemoryAll all = new MemoryAll();
        PersistUtil.save(TestPath.ROOT_PATH, all);
    }
}
