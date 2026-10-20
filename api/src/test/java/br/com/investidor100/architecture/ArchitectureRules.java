package br.com.investidor100.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.base.DescribedPredicate;
import com.tngtech.archunit.core.domain.Dependency;
import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Regras de camadas e contextos de docs/09 §2. Escritas sobre padrões de pacote ({@code <contexto>.<camada>}) para
 * valerem tanto no código de produção quanto nas fixtures de {@link ArchitectureRulesTest}.
 */
public final class ArchitectureRules {

    private static final Pattern CONTEXT_LAYER =
            Pattern.compile("^.*\\.(\\w+)\\.(domain|application|infrastructure|api)(\\..*)?$");
    private static final String SHARED = "shared";

    /** Prefixos aceitos para casos de uso (nome de verbo). Amplie quando surgir um verbo novo. */
    static final Set<String> USE_CASE_VERBS = Set.of(
            "Add", "Archive", "Calculate", "Change", "Close", "Compute", "Create", "Delete", "Get", "Import", "List",
            "On", "Pay", "Preview", "Record", "Refresh", "Register", "Remove", "Resolve", "Set", "Take", "Update",
            "Upsert");
    static final Set<String> ALLOWED_SUFFIXES = Set.of("Query", "Command", "Result");

    public static final ArchRule DOMAIN_IS_PURE = noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAnyPackage(
                    "..application..", "..infrastructure..", "..api..",
                    "io.quarkus..", "jakarta.ws.rs..", "com.fasterxml..", "jakarta.enterprise..", "jakarta.inject..")
            .as("domínio não depende de application/infrastructure/api nem de Quarkus, JAX-RS, Jackson ou CDI");

    public static final ArchRule API_DOES_NOT_ACCESS_INFRASTRUCTURE = noClasses()
            .that().resideInAPackage("..api..")
            .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
            .as("api não acessa infrastructure");

    public static final ArchRule CONTEXTS_TALK_VIA_APPLICATION_OR_EVENTS = classes()
            .that().resideInAnyPackage("..domain..", "..application..", "..infrastructure..", "..api..")
            .should(onlyAccessOtherContextsViaApplicationOrEvents())
            .as("contexto só acessa outro via <contexto>.application ou <contexto>.domain.event (exceto shared)");

    public static final ArchRule APPLICATION_CLASSES_ARE_NAMED_AS_USE_CASES = classes()
            .that().resideInAPackage("..application..")
            .and(topLevel())
            .should(beNamedAsUseCase())
            .as("classes de application têm nome de verbo (RegisterExpense) ou terminam em Query/Command/Result");

    private ArchitectureRules() {}

    private static ArchCondition<JavaClass> onlyAccessOtherContextsViaApplicationOrEvents() {
        return new ArchCondition<>("acessar outros contextos só via application ou eventos") {
            @Override
            public void check(JavaClass origin, ConditionEvents events) {
                Optional<String> originContext = contextOf(origin.getPackageName());
                if (originContext.isEmpty()) {
                    return;
                }
                for (Dependency dependency : origin.getDirectDependenciesFromSelf()) {
                    String targetPackage = dependency.getTargetClass().getPackageName();
                    Optional<String> targetContext = contextOf(targetPackage);
                    if (targetContext.isEmpty()
                            || targetContext.get().equals(originContext.get())
                            || targetContext.get().equals(SHARED)
                            || isPublicSurface(targetPackage, targetContext.get())) {
                        continue;
                    }
                    events.add(SimpleConditionEvent.violated(dependency, dependency.getDescription()));
                }
            }
        };
    }

    private static boolean isPublicSurface(String pkg, String context) {
        return pkg.contains("." + context + ".application") || pkg.contains("." + context + ".domain.event");
    }

    private static Optional<String> contextOf(String pkg) {
        Matcher m = CONTEXT_LAYER.matcher(pkg);
        return m.matches() ? Optional.of(m.group(1)) : Optional.empty();
    }

    private static DescribedPredicate<JavaClass> topLevel() {
        return DescribedPredicate.describe("são de topo", JavaClass::isTopLevelClass);
    }

    private static ArchCondition<JavaClass> beNamedAsUseCase() {
        return new ArchCondition<>("ter nome de caso de uso") {
            @Override
            public void check(JavaClass clazz, ConditionEvents events) {
                String name = clazz.getSimpleName();
                boolean ok = USE_CASE_VERBS.stream().anyMatch(v -> startsWithWord(name, v))
                        || ALLOWED_SUFFIXES.stream().anyMatch(name::endsWith);
                if (!ok) {
                    events.add(SimpleConditionEvent.violated(clazz,
                            clazz.getName() + " não tem nome de verbo nem termina em Query/Command/Result"));
                }
            }
        };
    }

    /** "RegisterExpense" começa com a palavra "Register"; "Settings" não começa com a palavra "Set". */
    private static boolean startsWithWord(String name, String word) {
        return name.startsWith(word)
                && (name.length() == word.length() || Character.isUpperCase(name.charAt(word.length())));
    }
}
