/**
 * validators.js
 * Funções puras de validação e cálculo extraídas do back-end.
 * Testáveis de forma isolada (sem banco de dados ou framework HTTP).
 */

/**
 * Valida formato de e-mail.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valida se a senha atende ao mínimo de 6 caracteres.
 * Regra idêntica à usada no POST /api/users e PUT /api/users/:id.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string' || password.trim() === '') {
    return { valid: false, message: 'A senha é obrigatória.' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'A senha deve ter pelo menos 6 caracteres.' };
  }
  return { valid: true, message: 'Senha válida.' };
}

/**
 * Valida campos obrigatórios do cadastro de usuário.
 * Regra idêntica ao POST /api/users no server.js.
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ valid: boolean, message: string }}
 */
export function validateUserFields(data) {
  const { name, email, password } = data || {};
  if (!name || !email || !password) {
    return { valid: false, message: 'Nome, e-mail e senha são obrigatórios.' };
  }
  return { valid: true, message: 'Campos válidos.' };
}

/**
 * Valida campos obrigatórios do cadastro de cliente.
 * Regra idêntica ao POST /api/clients no server.js.
 * @param {{ name: string, email: string }} data
 * @returns {{ valid: boolean, message: string }}
 */
export function validateClientFields(data) {
  const { name, email } = data || {};
  if (!name || !email) {
    return { valid: false, message: 'Nome e e-mail são obrigatórios.' };
  }
  return { valid: true, message: 'Campos válidos.' };
}

/**
 * Calcula os valores dos planos de locação a partir do preço semanal do veículo.
 * Lógica idêntica à função calculatePlanValues do server.js.
 *
 * Fórmulas:
 *   quinzenal = (semanal * 15/7) * 0.92   → desconto de 8%
 *   mensal    = (semanal * 4) * 0.95       → desconto de 5%
 *
 * @param {number} vehiclePrice - Preço semanal do veículo (R$)
 * @returns {{ weekly: number, fortnightly: number, monthly: number }}
 */
export function calculatePlanValues(vehiclePrice) {
  const weekly = Number(vehiclePrice || 0);
  const fortnightly = Number(((weekly * (15 / 7)) * 0.92).toFixed(2));
  const monthly = Number(((weekly * 4) * 0.95).toFixed(2));
  return { weekly, fortnightly, monthly };
}

/**
 * Analisa e retorna um array a partir de um valor JSON ou array.
 * Lógica idêntica à função parseJsonArray do server.js.
 * @param {*} value
 * @returns {Array}
 */
export function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Calcula as faixas de preço (menor, médio, maior) a partir de uma lista de veículos.
 * Lógica idêntica à função calculateVehiclePriceBands do server.js.
 * @param {Array<{priceWeekly: number}>} vehicles
 * @returns {{ lowest: number, medium: number, highest: number }}
 */
export function calculateVehiclePriceBands(vehicles) {
  const vehiclePrices = (vehicles || [])
    .map((v) => Number(v.priceWeekly || 0))
    .filter((p) => Number.isFinite(p) && p > 0)
    .sort((a, b) => a - b);

  if (vehiclePrices.length === 0) {
    return { lowest: 0, medium: 0, highest: 0 };
  }

  const lowest = vehiclePrices[0];
  const medium = vehiclePrices[Math.floor(vehiclePrices.length / 2)] ?? lowest;
  const highest = vehiclePrices[vehiclePrices.length - 1];

  return { lowest, medium, highest };
}

/**
 * Valida se o status do motorista é um dos valores aceitos pelo sistema.
 * @param {string} status
 * @returns {boolean}
 */
export function isValidDriverStatus(status) {
  const validStatuses = ['Aprovado', 'Em análise', 'Bloqueado', 'pendente', 'Reprovado'];
  return validStatuses.includes(status);
}

/**
 * Valida CPF — formato simples (11 dígitos numéricos, pode ter máscara).
 * @param {string} cpf
 * @returns {boolean}
 */
export function isValidCPF(cpf) {
  if (!cpf || typeof cpf !== 'string') return false;
  const digits = cpf.replace(/\D/g, '');
  return digits.length === 11;
}
