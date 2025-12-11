package com.un.memory.assist;

import com.google.gson.Gson;
import com.un.memory.all.MemoryAll;
import com.un.memory.net.MemoryArea;
import org.apache.commons.io.Charsets;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

public class PersistUtil {
    public static void save(File dir, MemoryAll all) {
        if (dir == null) {
            return;
        }

        if (all == null) {
            return;
        }

        Map<String, MemoryArea> areas = all.getAreas();
        if (areas == null) {
            return;
        }

        try {
            for (Map.Entry<String, MemoryArea> entry : areas.entrySet()) {
                String key = entry.getKey();
                MemoryArea area = entry.getValue();
                if (!area.isModify()) {
                    continue;
                }

//                String path = Paths.get(dir, area.getAreaType()+"");
//                String allStr = new Gson().toJson(all);
//                FileUtils.write(dir +, allStr, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void load() {

    }
}
