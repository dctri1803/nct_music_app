package com.nctcompany.nct03.util;

import com.nctcompany.nct03.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@Slf4j
public class FileUploadUtil {

    public static void saveFile(String uploadDir, String fileName,
                                MultipartFile multipartFile) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        try(InputStream inputStream = multipartFile.getInputStream()){
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }catch (IOException ex){
            throw new IOException("Could not save file: " + fileName, ex);
        }
    }

    public static void deleteImage(String dir, String imageName) {
        Path dirPath = Paths.get(dir);

        try (Stream<Path> paths = Files.list(dirPath)) {
            paths.filter(file -> !Files.isDirectory(file))
                    .filter(file -> file.getFileName().toString().equals(imageName))
                    .forEach(file -> {
                        try {
                            Files.delete(file);
                        } catch (IOException ex) {
                            throw new RuntimeException("Could not delete file: " + file, ex);
                        }
                    });
        } catch (IOException ex) {
            throw new RuntimeException("Could not list directory: " + dirPath, ex);
        }
    }

    public static UrlResource getUrlResource(String fileName, String folder) throws MalformedURLException {
        Path imagePath = Paths.get(folder + fileName);
        UrlResource resource = new UrlResource(imagePath.toUri());
        if (!resource.exists()) {
            throw new ResourceNotFoundException("Can not found file name: " + fileName);
        }
        return resource;
    }

    public static MediaType determineMediaType(String fileName) {
        String fileExtension = getFileExtension(fileName);
        switch (fileExtension) {
            case ".png":
                return MediaType.IMAGE_PNG;
            case ".jpg":
            case ".jpeg":
                return MediaType.IMAGE_JPEG;
            case ".mp3":
                return MediaType.APPLICATION_OCTET_STREAM;
            default:
                return MediaType.ALL;
        }
    }

    public static String generateImageName(MultipartFile file){
        String fileExtension = getFileExtension(file);

        String imageName = UUID.randomUUID().toString().substring(0,10);
        return imageName + fileExtension;
    }

    public static String getFileExtension(MultipartFile file){
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        return fileExtension;
    }


    // Chuẩn hoá tiếng việt có dấu về không dấu
    public static String removeAccent(String s) {
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(temp).replaceAll("");
    }

    public static String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
            return fileName.substring(dotIndex);
        }
        return "";
    }

    public static boolean checkUploadImageTypeFile(MultipartFile file){
        String contentType = file.getContentType();
        return contentType != null && (contentType.equals(MediaType.IMAGE_JPEG_VALUE) || contentType.equals(MediaType.IMAGE_PNG_VALUE));
    }

    public static boolean checkUploadAudioTypeFile(MultipartFile file) {
        if (file.isEmpty()) {
            return false;
        }
        String contentType = file.getContentType();
        return contentType != null && contentType.equals("audio/mpeg");
    }
}
