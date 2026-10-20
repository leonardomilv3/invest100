package br.com.investidor100.fixtures;

import io.smallrye.jwt.build.Jwt;
import java.util.UUID;

/** JWTs de teste assinados com {@code privateKey.pem}. Cada teste usa um usuário aleatório ⇒ isolamento sem limpar o banco. */
public final class TestTokens {

    private TestTokens() {}

    /** Token válido; issuer, audience e validade vêm de {@code smallrye.jwt.new-token.*}, como os tokens emitidos pela API. */
    public static String forUser(UUID id) {
        return Jwt.subject(id.toString()).claim("email", id + "@test.dev").sign();
    }

    public static String expiredForUser(UUID id) {
        long now = System.currentTimeMillis() / 1000;
        return Jwt.subject(id.toString()).issuedAt(now - 7200).expiresAt(now - 3600).sign();
    }

    public static String withIssuer(UUID id, String issuer) {
        return Jwt.issuer(issuer).subject(id.toString()).sign();
    }
}
