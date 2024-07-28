package com.nctcompany.nct03.constant;

import com.nctcompany.nct03.util.Utils;

import java.nio.file.Paths;

public class ApplicationConstants {

    public static final String ROOT_FOLDER_PATH = Paths.get("").toFile().getAbsolutePath();
    public static final String SONGS_IMG_FOLDER = "songs/img/";
    public static final String SONGS_FILE_FOLDER = "songs/file/";
    public static final String USERS_FOLDER = "users/";
    public static final String ARTISTS_FOLDER = "artists/";

    public static final String DEFAULT_IMAGE = "default.jpg";

//    public static final String APP_URL = "http://localhost:8080/v1";
    public static final String APP_URL = "http://%s:8080/v1".formatted(Utils.getIpAddress());

    public static final int MIN_TOKEN_SIZE = 2;
}
