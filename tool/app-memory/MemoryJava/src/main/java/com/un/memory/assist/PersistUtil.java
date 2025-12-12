package com.un.memory.assist;

import com.google.gson.Gson;
import com.un.memory.all.MemoryAll;
import com.un.memory.all.MemoryMeta;
import com.un.memory.net.MemoryArea;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

public class PersistUtil {
    public static void save(String dir, MemoryAll all) {
        if (dir == null) {
            return;
        }

        if (all == null) {
            return;
        }

        saveMeta(dir, all);
        saveArea(dir, all);
    }

    public static void saveMeta(String dir, MemoryAll all) {
        if (dir == null) {
            return;
        }

        if (all == null) {
            return;
        }

        MemoryMeta meta = all.getMeta();
        if (meta == null) {
            return;
        }

        String metaStr = new Gson().toJson(meta);
        try {
            FileUtils.write(getMetaFile(dir), metaStr, StandardCharsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void saveArea(String dir, MemoryAll all) {
        if (all == null) {
            return;
        }
        all.checkAllArea(memoryArea -> {
            if (!memoryArea.isModify()) {
                return null;
            }
            String allStr = new Gson().toJson(memoryArea);
            try {
                FileUtils.write(getMetaFile(dir), allStr, StandardCharsets.UTF_8);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        });
    }

    public static MemoryAll preload(String dir) {
        MemoryAll all = new MemoryAll();

        MemoryMeta meta = loadMeta(dir);
        all.setMeta(meta);

        return all;
    }

    private static MemoryMeta loadMeta(String dir) {
        try {
            String metaStr = FileUtils.readFileToString(getMetaFile(dir), StandardCharsets.UTF_8);
            MemoryMeta meta = new Gson().fromJson(metaStr, MemoryMeta.class);
            return meta;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void loadSingleTypeArea(String dir, int areaType, MemoryAll all) {
        if (all == null) {
            return;
        }

        File areaDir = getSingleTypeAreaFile(dir, areaType);
        File[] files = areaDir.listFiles();
        if (files == null) {
            return;
        }

        for (File f : files) {
            try {
                String areaStr = FileUtils.readFileToString(
                        f,
                        StandardCharsets.UTF_8
                );
                MemoryArea area = new Gson().fromJson(areaStr, MemoryArea.class);
                all.addArea(areaType, area.getMin(), area);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static File getMetaFile(String dir) {
        Path path = Paths.get(
                dir,
                "meta"
        );
        return path.toFile();
    }

    public static File getSingleTypeAreaFile(String dir, int areaType) {
        Path path = Paths.get(
                dir,
                areaType + ""
        );
        return path.toFile();
    }
}
