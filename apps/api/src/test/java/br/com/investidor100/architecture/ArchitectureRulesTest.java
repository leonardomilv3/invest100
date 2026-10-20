package br.com.investidor100.architecture;

import static br.com.investidor100.architecture.ArchitectureRules.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import java.util.List;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/** Garante que as regras de {@link ArchitectureRules} detectam violações (fixtures em {@code .fixtures}). */
class ArchitectureRulesTest {

    private static JavaClasses fixtures;

    @BeforeAll
    static void importa_fixtures() {
        fixtures = new ClassFileImporter().importPackages("br.com.investidor100.architecture.fixtures");
    }

    @Test
    void dominio_que_usa_jax_rs_ou_application_viola_a_regra() {
        assertThat(violators(DOMAIN_IS_PURE))
                .anyMatch(v -> v.contains("DomainUsingJaxRs"))
                .anyMatch(v -> v.contains("DomainUsingApplication"))
                .noneMatch(v -> v.contains("ledger.domain.Transaction."));
    }

    @Test
    void api_que_usa_infraestrutura_viola_a_regra() {
        assertThat(violators(API_DOES_NOT_ACCESS_INFRASTRUCTURE))
                .anyMatch(v -> v.contains("TransactionResource"));
    }

    @Test
    void contexto_que_acessa_dominio_ou_infraestrutura_de_outro_viola_a_regra() {
        List<String> violations = violators(CONTEXTS_TALK_VIA_APPLICATION_OR_EVENTS);

        // when/then: repositório (domain) e infraestrutura de outro contexto são proibidos
        assertThat(violations)
                .anyMatch(v -> v.contains("UsingCardsRepository") && v.contains("CardRepository"))
                .anyMatch(v -> v.contains("PanacheTransactionRepository") && v.contains("PanacheCardRepository"));
        // application e eventos de outro contexto, e o kernel shared, são permitidos
        assertThat(violations)
                .noneMatch(v -> v.contains("ResolveInvoice"))
                .noneMatch(v -> v.contains("InvoicePaid"))
                .noneMatch(v -> v.contains("Money"));
    }

    @Test
    void classe_de_application_sem_nome_de_caso_de_uso_viola_a_regra() {
        assertThat(violators(APPLICATION_CLASSES_ARE_NAMED_AS_USE_CASES))
                .anyMatch(v -> v.contains("TransactionService"))
                .noneMatch(v -> v.contains("application.RegisterExpense>"))
                .noneMatch(v -> v.contains("RegisterExpense$Command"))
                .noneMatch(v -> v.contains("RegisterExpenseCommand"))
                .noneMatch(v -> v.contains("MonthStatsQuery"));
    }

    private static List<String> violators(ArchRule rule) {
        return rule.evaluate(fixtures).getFailureReport().getDetails();
    }
}
