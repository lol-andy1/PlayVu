# PlayVu

### For issues with maven run

mvn -N io.takari:maven:wrapper

### Docker Setup Instructions

./mvnw package && java -jar target/gs-spring-boot-docker-0.1.0.jar

docker build --platform linux/amd64 -t springio/gs-spring-boot-docker .

docker tag springio/gs-spring-boot-docker playvu.azurecr.io/springio/gs-spring-boot-docker

docker login (Username and Password for Azure Cloud)

docker push playvu.azurecr.io/springio/gs-spring-boot-docker:latest

### Further Help

https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-docker-cli?tabs=azure-cli

https://github.com/spring-guides/gs-spring-boot-docker
