// Mesmo shape devolvido por GET /charges/me (api-ibra,
// ListMyChargesUseCase) - status já vem calculado pelo backend (comparando
// due_date com a data de hoje no servidor), o app só exibe, não recalcula.
export type IMyChargeStatus = 'PAID' | 'OVERDUE' | 'PENDING';

export type IMyChargeDTO = {
  id: string;
  charge_type: string;
  description: string;
  amount: number;
  due_date: string;
  paid_at: string | null;
  status: IMyChargeStatus;
  program_name: string;
  // Link de checkout da AbacatePay - null quando a cobrança já está paga
  // (nada a pagar) ou quando ela nunca teve um link guardado no backend
  // (mensalidade, que hoje ainda não gera link algum quando atrasa, ou
  // lançamento manual da equipe). O app só mostra o botão "Pagar" quando
  // este campo vem preenchido.
  payment_url: string | null;
};
