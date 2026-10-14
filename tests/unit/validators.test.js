/**
 * validators.test.js
 *
 * Testes unitários do back-end — Optimus Experience
 * Ferramenta: Jest
 *
 * Casos de teste implementados:
 *  CT01 – Validação de e-mail inválido
 *  CT02 – Validação de e-mail válido
 *  CT03 – Senha com menos de 6 caracteres deve ser rejeitada
 *  CT04 – Senha com 6 ou mais caracteres deve ser aceita
 *  CT05 – Campos obrigatórios ausentes no cadastro de usuário
 *  CT06 – Campos obrigatórios presentes no cadastro de usuário
 *  CT07 – Campos obrigatórios ausentes no cadastro de cliente
 *  CT08 – Cálculo dos valores do plano (semanal, quinzenal, mensal)
 *  CT09 – Cálculo com preço zero retorna zeros
 *  CT10 – parseJsonArray com string JSON válida
 *  CT11 – parseJsonArray com valor inválido retorna array vazio
 *  CT12 – Faixas de preço de veículos calculadas corretamente
 *  CT13 – Status válido de motorista aceito
 *  CT14 – Status inválido de motorista rejeitado
 *  CT15 – CPF com máscara considerado válido
 *  CT16 – CPF com menos de 11 dígitos considerado inválido
 */

import { describe, it, expect } from '@jest/globals';
import {
  isValidEmail,
  validatePassword,
  validateUserFields,
  validateClientFields,
  calculatePlanValues,
  parseJsonArray,
  calculateVehiclePriceBands,
  isValidDriverStatus,
  isValidCPF,
} from '../../src/utils/validators.js';

// ─────────────────────────────────────────────────────────
// CT01 & CT02 — Validação de e-mail
// ─────────────────────────────────────────────────────────
describe('isValidEmail — validação de formato de e-mail', () => {
  it('CT01 — deve retornar false para e-mail sem @', () => {
    // Entrada: string sem "@"
    // Resultado esperado: false
    expect(isValidEmail('usuarioemail.com')).toBe(false);
  });

  it('CT02 — deve retornar true para e-mail no formato correto', () => {
    // Entrada: e-mail válido
    // Resultado esperado: true
    expect(isValidEmail('carlos@drivefleet.com.br')).toBe(true);
  });

  it('CT02b — deve rejeitar e-mail sem domínio após o @', () => {
    expect(isValidEmail('usuario@')).toBe(false);
  });

  it('CT02c — deve rejeitar valor não-string', () => {
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(123)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// CT03 & CT04 — Validação de senha
// ─────────────────────────────────────────────────────────
describe('validatePassword — regra de tamanho mínimo de senha', () => {
  it('CT03 — deve rejeitar senha com menos de 6 caracteres', () => {
    // Entrada: "abc" (3 caracteres)
    // Resultado esperado: { valid: false }
    const result = validatePassword('abc');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/6 caracteres/);
  });

  it('CT04 — deve aceitar senha com exatamente 6 caracteres', () => {
    // Entrada: "abc123" (6 caracteres — valor-limite)
    // Resultado esperado: { valid: true }
    const result = validatePassword('abc123');
    expect(result.valid).toBe(true);
  });

  it('CT04b — deve rejeitar senha vazia ou ausente', () => {
    expect(validatePassword('').valid).toBe(false);
    expect(validatePassword(null).valid).toBe(false);
    expect(validatePassword(undefined).valid).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// CT05 & CT06 — Campos obrigatórios no cadastro de usuário
// ─────────────────────────────────────────────────────────
describe('validateUserFields — campos obrigatórios do usuário', () => {
  it('CT05 — deve rejeitar quando nome está ausente', () => {
    // Entrada: objeto sem nome
    // Resultado esperado: { valid: false }
    const result = validateUserFields({ name: '', email: 'a@b.com', password: 'senha123' });
    expect(result.valid).toBe(false);
  });

  it('CT05b — deve rejeitar quando e-mail está ausente', () => {
    const result = validateUserFields({ name: 'João', email: '', password: 'senha123' });
    expect(result.valid).toBe(false);
  });

  it('CT05c — deve rejeitar quando senha está ausente', () => {
    const result = validateUserFields({ name: 'João', email: 'j@j.com', password: '' });
    expect(result.valid).toBe(false);
  });

  it('CT06 — deve aceitar quando todos os campos obrigatórios estão presentes', () => {
    // Entrada: todos os campos preenchidos
    // Resultado esperado: { valid: true }
    const result = validateUserFields({ name: 'Carlos', email: 'carlos@drivefleet.com.br', password: 'admin123' });
    expect(result.valid).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// CT07 — Campos obrigatórios no cadastro de cliente
// ─────────────────────────────────────────────────────────
describe('validateClientFields — campos obrigatórios do cliente', () => {
  it('CT07 — deve rejeitar quando nome está ausente', () => {
    const result = validateClientFields({ name: '', email: 'contato@empresa.com' });
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/obrigatórios/i);
  });

  it('CT07b — deve aceitar quando nome e e-mail estão presentes', () => {
    const result = validateClientFields({ name: 'Empresa XYZ', email: 'contato@xyz.com.br' });
    expect(result.valid).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// CT08 & CT09 — Cálculo dos valores dos planos
// ─────────────────────────────────────────────────────────
describe('calculatePlanValues — cálculo de preços dos planos de locação', () => {
  it('CT08 — deve calcular quinzenal com desconto de 8% e mensal com 5%', () => {
    // Entrada: preço semanal = R$ 700
    // Quinzenal esperado: (700 * 15/7) * 0.92 = 1380.00
    // Mensal esperado:    (700 * 4) * 0.95   = 2660.00
    const result = calculatePlanValues(700);
    expect(result.weekly).toBe(700);
    expect(result.fortnightly).toBe(1380.00);
    expect(result.monthly).toBe(2660.00);
  });

  it('CT09 — deve retornar zeros quando preço é zero ou inválido', () => {
    // Entrada: 0 / undefined
    // Resultado esperado: { weekly: 0, fortnightly: 0, monthly: 0 }
    expect(calculatePlanValues(0)).toEqual({ weekly: 0, fortnightly: 0, monthly: 0 });
    expect(calculatePlanValues(undefined)).toEqual({ weekly: 0, fortnightly: 0, monthly: 0 });
  });

  it('CT08b — deve calcular corretamente com o veículo mais barato do catálogo (R$ 499)', () => {
    const result = calculatePlanValues(499);
    // Quinzenal: (499 * 15/7) * 0.92 = 983.74
    // Mensal:   (499 * 4) * 0.95     = 1896.20
    expect(result.weekly).toBe(499);
    expect(result.fortnightly).toBe(983.74);
    expect(result.monthly).toBe(1896.2);
  });
});

// ─────────────────────────────────────────────────────────
// CT10 & CT11 — parseJsonArray (utilitário do back-end)
// ─────────────────────────────────────────────────────────
describe('parseJsonArray — conversão de JSON armazenado no banco', () => {
  it('CT10 — deve retornar array quando receber string JSON válida', () => {
    // Dado salvo no banco como string: '["Uber","99"]'
    // Resultado esperado: ['Uber', '99']
    const result = parseJsonArray('["Uber","99"]');
    expect(result).toEqual(['Uber', '99']);
  });

  it('CT11 — deve retornar array vazio para valor nulo ou inválido', () => {
    // Entrada inválida / null
    // Resultado esperado: []
    expect(parseJsonArray(null)).toEqual([]);
    expect(parseJsonArray(undefined)).toEqual([]);
    expect(parseJsonArray('invalido{[')).toEqual([]);
  });

  it('CT10b — deve retornar o próprio array se já for um array', () => {
    const arr = ['Manutenção', 'Assistência 24h'];
    expect(parseJsonArray(arr)).toBe(arr);
  });
});

// ─────────────────────────────────────────────────────────
// CT12 — Faixas de preço dos veículos
// ─────────────────────────────────────────────────────────
describe('calculateVehiclePriceBands — faixas de preço da frota', () => {
  it('CT12 — deve identificar corretamente menor, médio e maior preço', () => {
    const vehicles = [
      { priceWeekly: 499 },
      { priceWeekly: 799 },
      { priceWeekly: 899 },
    ];
    const { lowest, medium, highest } = calculateVehiclePriceBands(vehicles);
    expect(lowest).toBe(499);
    expect(medium).toBe(799);
    expect(highest).toBe(899);
  });

  it('CT12b — deve retornar zeros quando não há veículos', () => {
    expect(calculateVehiclePriceBands([])).toEqual({ lowest: 0, medium: 0, highest: 0 });
    expect(calculateVehiclePriceBands(null)).toEqual({ lowest: 0, medium: 0, highest: 0 });
  });

  it('CT12c — deve ignorar veículos com preço zero ou inválido', () => {
    const vehicles = [{ priceWeekly: 0 }, { priceWeekly: -50 }, { priceWeekly: 600 }];
    const { lowest } = calculateVehiclePriceBands(vehicles);
    expect(lowest).toBe(600);
  });
});

// ─────────────────────────────────────────────────────────
// CT13 & CT14 — Status do motorista
// ─────────────────────────────────────────────────────────
describe('isValidDriverStatus — status permitidos para motoristas', () => {
  it('CT13 — deve aceitar status válido "Aprovado"', () => {
    expect(isValidDriverStatus('Aprovado')).toBe(true);
  });

  it('CT13b — deve aceitar todos os status válidos do sistema', () => {
    ['Aprovado', 'Em análise', 'Bloqueado', 'pendente', 'Reprovado'].forEach(s => {
      expect(isValidDriverStatus(s)).toBe(true);
    });
  });

  it('CT14 — deve rejeitar status inexistente', () => {
    // Entrada: status não previsto no sistema
    // Resultado esperado: false
    expect(isValidDriverStatus('Suspenso')).toBe(false);
    expect(isValidDriverStatus('')).toBe(false);
    expect(isValidDriverStatus(null)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// CT15 & CT16 — Validação de CPF
// ─────────────────────────────────────────────────────────
describe('isValidCPF — validação de formato de CPF', () => {
  it('CT15 — deve aceitar CPF com máscara (formato 000.000.000-00)', () => {
    // CPF do motorista demo cadastrado no sistema
    expect(isValidCPF('111.222.333-01')).toBe(true);
  });

  it('CT15b — deve aceitar CPF sem máscara com 11 dígitos', () => {
    expect(isValidCPF('12345678909')).toBe(true);
  });

  it('CT16 — deve rejeitar CPF com menos de 11 dígitos', () => {
    // Entrada: CPF incompleto
    // Resultado esperado: false
    expect(isValidCPF('123.456')).toBe(false);
  });

  it('CT16b — deve rejeitar valor nulo ou não-string', () => {
    expect(isValidCPF(null)).toBe(false);
    expect(isValidCPF(undefined)).toBe(false);
    expect(isValidCPF(12345678909)).toBe(false);
  });
});
