package br.com.investidor100;

import static io.restassured.RestAssured.given;

import br.com.investidor100.fixtures.TestTokens;
import io.quarkus.test.junit.QuarkusTest;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/** A API valida JWT RS256 emitido por ela mesma (docs/01 · Auth). Ainda não há endpoints: autenticado ⇒ 404. */
@QuarkusTest
class JwtIT {

    private static final String ROTA_PROTEGIDA = "/api/v1/rota-inexistente";

    @Test
    void sem_token_responde_401() {
        given().when().get(ROTA_PROTEGIDA).then().statusCode(401);
    }

    @Test
    void token_assinado_com_a_chave_da_api_passa_pela_autenticacao() {
        given().auth().oauth2(TestTokens.forUser(UUID.randomUUID()))
                .when().get(ROTA_PROTEGIDA)
                .then().statusCode(404);
    }

    @Test
    void token_expirado_responde_401() {
        given().auth().oauth2(TestTokens.expiredForUser(UUID.randomUUID()))
                .when().get(ROTA_PROTEGIDA)
                .then().statusCode(401);
    }

    @Test
    void token_de_outro_emissor_responde_401() {
        given().auth().oauth2(TestTokens.withIssuer(UUID.randomUUID(), "https://outro-emissor.dev"))
                .when().get(ROTA_PROTEGIDA)
                .then().statusCode(401);
    }

    @Test
    void health_continua_publico() {
        given().when().get("/q/health/live").then().statusCode(200);
    }
}
