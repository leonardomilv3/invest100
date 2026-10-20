# Prompt mestre — cole no Claude Code na raiz do repositório

> Copie tudo abaixo da linha para a primeira sessão. Pré-requisitos: pasta deste pacote copiada para a raiz do repositório vazio (`docs/`, `design/`, `screenshots/`, `backend/`, `infra/`, `CLAUDE.md`), Node 20+, Java 25 , Maven, Docker e Supabase CLI (Supabase em ambiente PRD, em DEV usar Postgres do Docker) instalados.

---

Você é o engenheiro responsável por implementar o **Investidor100**, um gerenciador pessoal de investimentos + finanças (pt-BR, BRL), do zero até produção.

## Stack e hospedagem (fixas)
- Frontend: React 18 + Vite + TypeScript → **Vercel** (`apps/web`)
- Backend: Java 25  + Quarkus 3 LTS (REST/JSON) → **Render** via Docker (`apps/api`)
- Banco + Auth: **Supabase** (Postgres, schema privado `app`; Supabase Auth com JWT validado na API)

## Fontes da verdade (leia antes de qualquer código)
1. `CLAUDE.md` — regras invioláveis e comandos.
2. `docs/09-ddd-e-testes.md` — arquitetura **DDD leve** (contextos, camadas, regras ArchUnit) e estratégia **TDD** (pirâmide, ciclo, infra de teste).
3. `docs/08-plano-de-implementacao.md` — passos 0–13 com testes a escrever primeiro e critérios de pronto.
4. Specs: `docs/01` arquitetura · `docs/02` banco (+ `backend/db/migration/*.sql`) · `docs/03` contrato da API · `docs/04` regras de negócio · `docs/05` frontend · `docs/06` telas · `docs/07` deploy.
5. Visual: `screenshots/*.png` (referência hi-fi desktop 1440 e mobile 390) e `design/` (tokens, componentes e telas de referência — **não** é código de produção; recrie em TSX).
Se houver conflito: regra de negócio → `docs/04`; contrato → `docs/03`; visual → `screenshots/` + `design/reference/finance`.

## Como trabalhar
- **Um passo do docs/08 por vez.** Comece agora pelo **Passo 0**. Ao terminar um passo, pare e aguarde meu "ok" antes do próximo.
- Para cada passo: (1) leia os docs indicados; (2) apresente um plano curto com a lista de testes que vai escrever; (3) execute; (4) entregue o relatório de fim de passo.
- **TDD estrito** (docs/09 §6): escreva o teste → rode → **mostre a saída vermelha** → implemente o mínimo → rode → verde → refatore. Ordem: domínio (unit) → aplicação (fakes em memória) → API (`@QuarkusTest` + Dev Services + RestAssured + JWT de teste) → frontend (Vitest + Testing Library + MSW). Nunca escreva código de produção sem um teste vermelho que o exija.
- **DDD leve**: regras dentro de agregados/value objects/serviços de domínio; casos de uso finos em `application`; portas no domínio, adaptadores em `infrastructure`; resources em `api`. Contextos se falam por casos de uso públicos ou eventos CDI síncronos. Mantenha `ArchitectureTest` verde.
- Dinheiro sempre `BigDecimal`/`Money` (nunca `double`). Toda query filtra por `user_id` do JWT; recurso de outro usuário = 404. Mensagens de erro em pt-BR iguais às do design.
- Frontend: só tokens CSS, componentes do `design-system/`, copy pt-BR sem emoji, mobile com paridade total. Compare cada tela com a captura correspondente e liste diferenças antes de finalizar.
- Mudou contrato? Atualize `docs/03` e os tipos do web no mesmo commit. Migrations aplicadas são imutáveis.
- Commits pequenos, Conventional Commits, um por ciclo verde relevante. Não faça push sem eu pedir.
- Se uma regra estiver ambígua, **pergunte** em vez de inventar; registre a decisão no doc correspondente.

## Relatório de fim de passo (formato)
```
Passo N — <nome>
Testes criados: <lista por nível, com contagem>
Resultado: ./mvnw verify ✅/❌ · npm test ✅/❌ · cobertura domínio X% · total Y%
Arquivos principais: <lista curta>
Diferenças visuais vs screenshots: <nenhuma | lista>
Decisões/pendências: <lista>
Próximo passo sugerido: N+1
```

Comece pelo **Passo 0**: leia os arquivos acima, mostre o plano e aguarde minha aprovação antes de criar arquivos.
