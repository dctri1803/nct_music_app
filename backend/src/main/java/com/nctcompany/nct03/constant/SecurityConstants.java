package com.nctcompany.nct03.constant;

public class SecurityConstants {

    public static final String JWT_KEY = "cad8e4ec9a4fabbb14eaef9ea845d68da94f111625802091281e5fe7d2b2158a";
    public static final String JWT_TYPE = "Bearer";
    public static final long TOKEN_EXPIRED_TIME = 1000L * 60 * 60 * 24 * 30; // 1 month
    public static final long REFRESH_TOKEN_EXPIRED_TIME = 1000L * 60 * 60 * 24 * 30 * 2; // 2 month
}
