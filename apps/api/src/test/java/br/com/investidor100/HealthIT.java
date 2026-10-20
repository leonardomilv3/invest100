package br.com.investidor100;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

@QuarkusTest
class HealthIT {

    @Test
    void readiness_responde_200_com_banco_no_ar() {
        given().when().get("/q/health/ready")
                .then().statusCode(200)
                .body("status", equalTo("UP"));
    }
}
