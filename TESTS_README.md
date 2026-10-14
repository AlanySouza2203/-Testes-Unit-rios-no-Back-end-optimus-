# 🧪 Testes Unitários — Optimus Experience Back-end

Este documento descreve os testes unitários automatizados implementados para o back-end do **Optimus Experience**, sistema de gestão de aluguel de veículos para motoristas de aplicativo.

---

## 🛠️ Tecnologia utilizada

| Item | Detalhe |
|------|---------|
| Runtime | Node.js v24 |
| Framework de testes | [Jest v30](https://jestjs.io/) + `@jest/globals` |
| Módulos | ES Modules (`"type": "module"`) |
| Arquivo principal testado | `src/utils/validators.js` |

---

## 📁 Estrutura dos arquivos

```
Optimus_Experience-main/
├── src/
│   └── utils/
│       └── validators.js        ← funções puras extraídas do back-end
├── tests/
│   └── unit/
│       └── validators.test.js   ← suite de testes unitários
├── jest.config.json             ← configuração do Jest (ESM)
└── package.json                 ← script "test" configurado
```

---

## ▶️ Como executar os testes

```bash
npm test
```

O comando utiliza `--experimental-vm-modules` para suporte a ES Modules nativos no Jest.

---

## 📋 Plano de Casos de Teste

### CT01 — Validar e-mail inválido (sem `@`)
- **Funcionalidade:** Validação de formato de e-mail  
- **Cenário:** Tentativa de usar um e-mail sem o caractere `@`  
- **Entrada:** `"usuarioemail.com"`  
- **Resultado esperado:** `false` — e-mail inválido rejeitado

### CT02 — Validar e-mail válido
- **Funcionalidade:** Validação de formato de e-mail  
- **Cenário:** E-mail completo com `@` e domínio correto  
- **Entrada:** `"carlos@drivefleet.com.br"`  
- **Resultado esperado:** `true`

### CT03 — Senha com menos de 6 caracteres deve ser rejeitada
- **Funcionalidade:** Regra de senha mínima no cadastro de usuário  
- **Cenário:** Senha curta demais (valor-limite)  
- **Entrada:** `"abc"` (3 caracteres)  
- **Resultado esperado:** `{ valid: false, message: "...6 caracteres..." }`

### CT04 — Senha com 6 caracteres deve ser aceita (valor-limite)
- **Funcionalidade:** Regra de senha mínima  
- **Cenário:** Senha exatamente no limite mínimo  
- **Entrada:** `"abc123"` (6 caracteres)  
- **Resultado esperado:** `{ valid: true }`

### CT05 — Campos obrigatórios ausentes no cadastro de usuário
- **Funcionalidade:** Validação de cadastro de usuário  
- **Cenário:** Tentativa de cadastrar sem nome/e-mail/senha  
- **Entrada:** `{ name: "", email: "a@b.com", password: "senha123" }`  
- **Resultado esperado:** `{ valid: false }`

### CT06 — Todos os campos obrigatórios presentes no cadastro de usuário
- **Funcionalidade:** Validação de cadastro de usuário  
- **Cenário:** Dados completos e válidos  
- **Entrada:** `{ name: "Carlos", email: "carlos@drivefleet.com.br", password: "admin123" }`  
- **Resultado esperado:** `{ valid: true }`

### CT07 — Campos obrigatórios ausentes no cadastro de cliente
- **Funcionalidade:** Validação de cadastro de cliente  
- **Cenário:** Tentativa de criar cliente sem nome  
- **Entrada:** `{ name: "", email: "contato@empresa.com" }`  
- **Resultado esperado:** `{ valid: false, message: "...obrigatórios..." }`

### CT08 — Cálculo correto dos valores dos planos
- **Funcionalidade:** Regra de negócio: cálculo de preços (quinzenal −8%, mensal −5%)  
- **Cenário:** Preço semanal de referência R$ 700  
- **Entrada:** `700`  
- **Resultado esperado:** `{ weekly: 700, fortnightly: 1380.00, monthly: 2660.00 }`

### CT09 — Preço zero retorna plano zerado
- **Funcionalidade:** Cálculo dos planos com entrada inválida  
- **Cenário:** Veículo sem preço definido  
- **Entrada:** `0` / `undefined`  
- **Resultado esperado:** `{ weekly: 0, fortnightly: 0, monthly: 0 }`

### CT10 — `parseJsonArray` com string JSON válida
- **Funcionalidade:** Leitura de campos JSON do banco de dados  
- **Cenário:** Campo `approved_platforms` salvo como string  
- **Entrada:** `'["Uber","99"]'`  
- **Resultado esperado:** `['Uber', '99']`

### CT11 — `parseJsonArray` com valor nulo retorna array vazio
- **Funcionalidade:** Tratamento de dado ausente/corrompido no banco  
- **Cenário:** Campo JSON ausente  
- **Entrada:** `null` / `undefined` / string inválida  
- **Resultado esperado:** `[]`

### CT12 — Faixas de preço da frota calculadas corretamente
- **Funcionalidade:** Seleção dos preços de referência para os planos  
- **Cenário:** Frota com 3 veículos de preços distintos  
- **Entrada:** `[{priceWeekly:499},{priceWeekly:799},{priceWeekly:899}]`  
- **Resultado esperado:** `{ lowest: 499, medium: 799, highest: 899 }`

### CT13 — Status válido de motorista aceito
- **Funcionalidade:** Controle de status do motorista  
- **Cenário:** Status `"Aprovado"` é um valor previsto pelo sistema  
- **Entrada:** `"Aprovado"`  
- **Resultado esperado:** `true`

### CT14 — Status inválido de motorista rejeitado
- **Funcionalidade:** Controle de status do motorista  
- **Cenário:** Status inexistente no domínio do sistema  
- **Entrada:** `"Suspenso"`  
- **Resultado esperado:** `false`

### CT15 — CPF com máscara aceito como válido
- **Funcionalidade:** Validação de CPF no cadastro de motorista  
- **Cenário:** CPF no formato padrão com pontuação  
- **Entrada:** `"111.222.333-01"`  
- **Resultado esperado:** `true`

### CT16 — CPF incompleto (menos de 11 dígitos) rejeitado
- **Funcionalidade:** Validação de CPF  
- **Cenário:** CPF parcialmente digitado  
- **Entrada:** `"123.456"`  
- **Resultado esperado:** `false`

---

## ✅ Resultado da Execução

```
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
    ✓ CT08b — deve calcular corretamente com o veículo mais barato do catálogo (R$ 499)

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
Time:        0.241 s
```

---

## 💡 Reflexão sobre os testes

### 1. O que os testes permitiram descobrir ou garantir?
Os testes garantiram que as regras de negócio centrais do sistema — validação de dados de entrada, cálculo de preços e controle de status — funcionam de forma previsível e isolada do banco de dados. Eles criam uma rede de segurança para futuras alterações no código.

### 2. Algum teste revelou um problema?
Sim! Durante a criação do **CT08b**, o valor esperado do cálculo quinzenal para R$ 499 foi inicialmente calculado incorretamente (R$ 983.23 × R$ 983.74). O teste falhou e identificou o erro de cálculo no comentário — demonstrando exatamente o valor do processo de testar: o teste identificou um dado incorreto antes de chegar à produção.

### 3. Quais regras de negócio foram verificadas?
- **Validação de e-mail** — formato obrigatório em todos os cadastros
- **Regra de senha mínima (6 caracteres)** — segurança de acesso ao sistema
- **Campos obrigatórios** no cadastro de usuário e cliente
- **Cálculo de preços dos planos** com desconto de 8% (quinzenal) e 5% (mensal)
- **Faixas de preço da frota** para definição dos planos exibidos no site
- **Status válidos do motorista** — controle de acesso e workflow
- **Validação de CPF** — regra de formato para cadastro de motoristas

### 4. Quais outras partes deveriam receber testes?
- **Autenticação** (POST `/api/auth/login`) — validar login correto/incorreto
- **Criação de reservas** — verificar regras de disponibilidade de veículo
- **Cálculo de pagamentos** — verificar valores gerados para contratos
- **Validação de CNH** — verificar validade da data de expiração
- **Testes de integração** com banco de dados usando banco em memória (SQLite)
