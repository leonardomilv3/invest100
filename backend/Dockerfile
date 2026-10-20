# apps/api/Dockerfile — build multi-stage (modo JVM) para Render
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd -r -u 1001 app
COPY --from=build --chown=1001 /app/target/quarkus-app/lib/ ./lib/
COPY --from=build --chown=1001 /app/target/quarkus-app/*.jar ./
COPY --from=build --chown=1001 /app/target/quarkus-app/app/ ./app/
COPY --from=build --chown=1001 /app/target/quarkus-app/quarkus/ ./quarkus/
USER 1001
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar quarkus-run.jar"]
