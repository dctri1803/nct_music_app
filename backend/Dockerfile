FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY /target/*.jar .
ENTRYPOINT ["java", "-jar", "nct03-0.0.1-SNAPSHOT.jar"]
