package com.nctcompany.nct03;

import java.nio.file.Paths;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Test {

    public static void main(String[] args) {
        String input1 = "cApItAlIzE this string after WHITE SPACES";
        String input2 = "capitalize this string ONLY before'and''after'''APEX";
        String input3 = "hAHa huHu";

//        System.out.println(convertToTitleCase(input1));
//        System.out.println(convertToTitleCase(input2));
//        System.out.println(convertToTitleCase(input3));
        System.out.println(Paths.get("").toFile().getAbsolutePath());
    }

    public static String convertToTitleCase(String input) {
        Pattern pattern = Pattern.compile("\\b\\w");
        Matcher matcher = pattern.matcher(input.toLowerCase());

        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            matcher.appendReplacement(result, matcher.group().toUpperCase());
        }
        matcher.appendTail(result);

        return result.toString();
    }
}
