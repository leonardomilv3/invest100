package br.com.investidor100;

import static br.com.investidor100.architecture.ArchitectureRules.*;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

/** Regras de docs/09 §2 aplicadas ao código de produção. */
@AnalyzeClasses(packages = "br.com.investidor100", importOptions = ImportOption.DoNotIncludeTests.class)
class ArchitectureTest {

    @ArchTest
    static final ArchRule dominio_nao_depende_de_outras_camadas_nem_de_frameworks = DOMAIN_IS_PURE;

    @ArchTest
    static final ArchRule api_nao_acessa_infraestrutura = API_DOES_NOT_ACCESS_INFRASTRUCTURE;

    @ArchTest
    static final ArchRule contextos_se_falam_so_por_application_ou_eventos = CONTEXTS_TALK_VIA_APPLICATION_OR_EVENTS;

    @ArchTest
    static final ArchRule casos_de_uso_tem_nome_de_verbo_ou_query = APPLICATION_CLASSES_ARE_NAMED_AS_USE_CASES;
}
