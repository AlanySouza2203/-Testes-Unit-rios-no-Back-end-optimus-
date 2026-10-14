# 🧪 Testes Unitários — Back-end Optimus Experience

> Atividade de Testes Unitários do Projeto Integrador — implementação de testes automatizados para o back-end do sistema **Optimus Experience**, uma plataforma de gestão e locação de veículos para motoristas de aplicativo (Uber, 99, inDrive).

---

## 📌 Sobre o Projeto

O **Optimus Experience** é um sistema web completo que permite:

- Cadastro e gestão de motoristas e clientes
- Controle de frota de veículos disponíveis para locação
- Geração de propostas, contratos e reservas
- Controle financeiro (pagamentos, caixa)
- Painel administrativo com controle de permissões por perfil

O back-end é desenvolvido em **Node.js + Express**, com persistência em **MySQL**, e utiliza ES Modules nativos (`"type": "module"`).

---

## 🎯 Objetivo dos Testes

Selecionar funcionalidades reais do back-end e construir um conjunto de **testes unitários automatizados** que:

- Validem regras de negócio implementadas no sistema
- Verifiquem comportamentos esperados e situações de erro
- Sejam reproduzíveis e independentes entre si
- Aumentem a confiabilidade do sistema frente a futuras alterações

---

## 🛠️ Tecnologias Utilizadas

| Ferramenta | Versão | Função |
|------------|--------|--------|
| Node.js | v24 | Runtime JavaScript |
| Jest | ^30 | Framework de testes |
| @jest/globals | ^30 | API de testes para ES Modules |
| ES Modules | nativo | Módulos do projeto |

---

## 📁 Estrutura de Arquivos

```
Optimus_Experience/
│
├── src/
│   └── utils/
│       └── validators.js         ← Funções puras extraídas do back-end
│
├── tests/
│   └── unit/
│       └── validators.test.js    ← Suite de testes unitários (29 casos)
│
├── jest.config.json              ← Configuração do Jest para ES Modules
├── package.json                  ← Script "test" configurado
├── server.js                     ← Back-end principal (Node.js + Express)
└── README.md                     ← Este arquivo
```

### Por que `src/utils/validators.js`?

As funções de validação e cálculo estavam embutidas dentro do `server.js` junto com as rotas HTTP e a conexão ao banco de dados. Para testá-las de forma **isolada** (sem precisar subir um servidor ou banco de dados), elas foram extraídas para um módulo independente — que é exatamente o que torna um teste **unitário**: testar uma unidade de código de forma isolada.

---

## ▶️ Como Executar os Testes

### 1. Instale as dependências

```bash
npm install
```

### 2. Execute a suíte de testes

```bash
npm test
```

O comando configurado no `package.json` utiliza a flag `--experimental-vm-modules` necessária para o Jest funcionar com ES Modules nativos do Node.js.

### Resultado esperado

```
PASS tests/unit/validators.test.js

Tests: 29 passed, 29 total
Time:  ~0.24s
```

---

## 📋 Plano de Casos de Teste

Abaixo estão os **16 casos de teste principais** planejados, cada um com sua funcionalidade, cenário, entrada e resultado esperado.

---

### CT01 — Validar e-mail inválido (sem `@`)

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Validação de formato de e-mail |
| **Cenário** | Tentativa de cadastrar com e-mail sem o caractere `@` |
| **Entrada** | `"usuarioemail.com"` |
| **Resultado esperado** | `false` — e-mail rejeitado |

---

### CT02 — Validar e-mail válido

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Validação de formato de e-mail |
| **Cenário** | E-mail com formato correto (`usuario@dominio.com`) |
| **Entrada** | `"carlos@drivefleet.com.br"` |
| **Resultado esperado** | `true` |

---

### CT03 — Rejeitar senha com menos de 6 caracteres

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Regra de senha mínima — `POST /api/users` |
| **Cenário** | Senha abaixo do limite mínimo |
| **Entrada** | `"abc"` (3 caracteres) |
| **Resultado esperado** | `{ valid: false, message: "...6 caracteres..." }` |

---

### CT04 — Aceitar senha com exatamente 6 caracteres (valor-limite)

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Regra de senha mínima |
| **Cenário** | Senha exatamente no limite mínimo aceito |
| **Entrada** | `"abc123"` (6 caracteres) |
| **Resultado esperado** | `{ valid: true }` |

---

### CT05 — Rejeitar cadastro de usuário sem nome

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Campos obrigatórios no cadastro de usuário — `POST /api/users` |
| **Cenário** | Tentativa de cadastrar usuário sem preencher o nome |
| **Entrada** | `{ name: "", email: "a@b.com", password: "senha123" }` |
| **Resultado esperado** | `{ valid: false }` |

---

### CT06 — Aceitar cadastro de usuário com todos os campos

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Campos obrigatórios no cadastro de usuário |
| **Cenário** | Todos os campos obrigatórios preenchidos |
| **Entrada** | `{ name: "Carlos", email: "carlos@drivefleet.com.br", password: "admin123" }` |
| **Resultado esperado** | `{ valid: true }` |

---

### CT07 — Rejeitar cadastro de cliente sem nome ou e-mail

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Campos obrigatórios no cadastro de cliente — `POST /api/clients` |
| **Cenário** | Tentativa de cadastrar cliente sem nome |
| **Entrada** | `{ name: "", email: "contato@empresa.com" }` |
| **Resultado esperado** | `{ valid: false, message: "...obrigatórios..." }` |

---

### CT08 — Calcular corretamente os preços dos planos

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Regra de cálculo dos planos de locação (`calculatePlanValues`) |
| **Cenário** | Veículo com preço semanal de R$ 700 |
| **Entrada** | `700` |
| **Resultado esperado** | `{ weekly: 700, fortnightly: 1380.00, monthly: 2660.00 }` |

> 💡 **Regra de negócio:**  
> - Quinzenal = (semanal × 15/7) × **0,92** → desconto de **8%**  
> - Mensal = (semanal × 4) × **0,95** → desconto de **5%**

---

### CT09 — Plano com preço zero retorna valores zerados

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Cálculo dos planos com entrada inválida |
| **Cenário** | Veículo sem preço cadastrado |
| **Entrada** | `0` ou `undefined` |
| **Resultado esperado** | `{ weekly: 0, fortnightly: 0, monthly: 0 }` |

---

### CT10 — `parseJsonArray` converte string JSON em array

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Leitura de campos JSON salvos no banco de dados |
| **Cenário** | Campo `approved_platforms` salvo como texto no MySQL |
| **Entrada** | `'["Uber","99"]'` |
| **Resultado esperado** | `['Uber', '99']` |

---

### CT11 — `parseJsonArray` retorna array vazio para dado inválido

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Tratamento de dado ausente ou corrompido no banco |
| **Cenário** | Campo JSON vazio, nulo ou com valor inválido |
| **Entrada** | `null` / `undefined` / `"invalido{["` |
| **Resultado esperado** | `[]` |

---

### CT12 — Calcular faixas de preço da frota

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Seleção dos preços de referência para os 3 planos exibidos no site |
| **Cenário** | Frota com 3 veículos de preços distintos |
| **Entrada** | `[{priceWeekly:499},{priceWeekly:799},{priceWeekly:899}]` |
| **Resultado esperado** | `{ lowest: 499, medium: 799, highest: 899 }` |

---

### CT13 — Aceitar status válido de motorista

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Controle de status do motorista no sistema |
| **Cenário** | Status previsto no domínio do sistema |
| **Entrada** | `"Aprovado"` |
| **Resultado esperado** | `true` |

---

### CT14 — Rejeitar status inválido de motorista

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Controle de status do motorista |
| **Cenário** | Status não previsto no sistema |
| **Entrada** | `"Suspenso"` |
| **Resultado esperado** | `false` |

---

### CT15 — Aceitar CPF com máscara

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Validação de CPF no cadastro de motorista |
| **Cenário** | CPF no formato padrão com pontuação |
| **Entrada** | `"111.222.333-01"` |
| **Resultado esperado** | `true` |

---

### CT16 — Rejeitar CPF incompleto

| Campo | Detalhe |
|-------|---------|
| **Funcionalidade** | Validação de CPF |
| **Cenário** | CPF parcialmente digitado (menos de 11 dígitos) |
| **Entrada** | `"123.456"` |
| **Resultado esperado** | `false` |

---

## ✅ Resultado da Execução

```
> node --experimental-vm-modules node_modules/jest/bin/jest.js tests/unit

PASS tests/unit/validators.test.js

  isValidEmail — validação de formato de e-mail
    ✓ CT01 — deve retornar false para e-mail sem @
    ✓ CT02 — deve retornar true para e-mail no formato correto
    ✓ CT02b — deve rejeitar e-mail sem domínio após o @
    ✓ CT02c — deve rejeitar valor não-string

  validatePassword — regra de tamanho mínimo de senha
    ✓ CT03 — deve rejeitar senha com menos de 6 caracteres
    ✓ CT04 — deve aceitar senha com exatamente 6 caracteres
    ✓ CT04b — deve rejeitar senha vazia ou ausente

  validateUserFields — campos obrigatórios do usuário
    ✓ CT05 — deve rejeitar quando nome está ausente
    ✓ CT05b — deve rejeitar quando e-mail está ausente
    ✓ CT05c — deve rejeitar quando senha está ausente
    ✓ CT06 — deve aceitar quando todos os campos obrigatórios estão presentes

  validateClientFields — campos obrigatórios do cliente
    ✓ CT07 — deve rejeitar quando nome está ausente
    ✓ CT07b — deve aceitar quando nome e e-mail estão presentes

  calculatePlanValues — cálculo de preços dos planos de locação
    ✓ CT08 — deve calcular quinzenal com desconto de 8% e mensal com 5%
    ✓ CT09 — deve retornar zeros quando preço é zero ou inválido
    ✓ CT08b — deve calcular corretamente com o veículo mais barato (R$ 499)

  parseJsonArray — conversão de JSON armazenado no banco
    ✓ CT10 — deve retornar array quando receber string JSON válida
    ✓ CT11 — deve retornar array vazio para valor nulo ou inválido
    ✓ CT10b — deve retornar o próprio array se já for um array

  calculateVehiclePriceBands — faixas de preço da frota
    ✓ CT12 — deve identificar corretamente menor, médio e maior preço
    ✓ CT12b — deve retornar zeros quando não há veículos
    ✓ CT12c — deve ignorar veículos com preço zero ou inválido

  isValidDriverStatus — status permitidos para motoristas
    ✓ CT13 — deve aceitar status válido "Aprovado"
    ✓ CT13b — deve aceitar todos os status válidos do sistema
    ✓ CT14 — deve rejeitar status inexistente

  isValidCPF — validação de formato de CPF
    ✓ CT15 — deve aceitar CPF com máscara (formato 000.000.000-00)
    ✓ CT15b — deve aceitar CPF sem máscara com 11 dígitos
    ✓ CT16 — deve rejeitar CPF com menos de 11 dígitos
    ✓ CT16b — deve rejeitar valor nulo ou não-string

Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        0.241 s
```

---

## 💡 Reflexão sobre os Testes

### 1. O que os testes permitiram descobrir ou garantir?

Os testes garantiram que as regras de negócio mais críticas do sistema — validação de dados de entrada, cálculo automático de preços e controle de status — funcionam de forma correta e previsível, **sem depender do banco de dados ou do servidor HTTP**. Isso significa que qualquer alteração futura no `server.js` pode ser verificada rapidamente rodando `npm test`.

### 2. Algum teste revelou um problema?

Sim! Durante a implementação do **CT08b**, o valor esperado do cálculo quinzenal para R$ 499 foi documentado incorretamente no comentário como `R$ 983,23`. O teste falhou e apontou que o valor real calculado pela fórmula é `R$ 983,74`. Isso demonstra o valor prático dos testes: **identificar inconsistências antes que cheguem à produção**.

### 3. Quais regras de negócio foram verificadas?

| Regra | CT |
|-------|----|
| E-mail deve ter formato válido (`@` e domínio) | CT01, CT02 |
| Senha deve ter no mínimo 6 caracteres | CT03, CT04 |
| Nome, e-mail e senha são obrigatórios no cadastro de usuário | CT05, CT06 |
| Nome e e-mail são obrigatórios no cadastro de cliente | CT07 |
| Plano quinzenal tem desconto de 8% sobre o semanal | CT08 |
| Plano mensal tem desconto de 5% sobre o semanal × 4 | CT08 |
| Preço inválido/zero gera plano zerado | CT09 |
| Campos JSON do banco devem ser convertidos para array | CT10, CT11 |
| Faixa de preço determina qual plano é exibido no site | CT12 |
| Status do motorista deve estar dentro do domínio aceito | CT13, CT14 |
| CPF deve ter 11 dígitos numéricos | CT15, CT16 |

### 4. Quais outras partes deveriam receber testes?

| Área | Motivo |
|------|--------|
| `POST /api/auth/login` | Verificar autenticação com credenciais válidas e inválidas |
| Criação de reservas | Verificar regras de disponibilidade de veículo |
| Geração de contratos | Validar cálculo de valores e datas |
| Validação de CNH | Verificar se data de vencimento está vencida |
| Testes de integração | Usar banco em memória (SQLite) para testar rotas completas |

---

## 👩‍💻 Autora

**Alany Souza**  
Projeto Integrador — Desenvolvimento de Sistemas  
GitHub: [@AlanySouza2203](https://github.com/AlanySouza2203)