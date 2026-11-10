// Mesmo shape devolvido por GET /player_programs/me (api-ibra,
// ListMyPlayerProgramsUseCase) - "Minhas matrículas", usada só pra listar
// os vínculos do próprio atleta e permitir cancelar a mensalidade (ver
// MyPlayerPrograms/index.tsx). Diferente de IMyChargeDTO, não tem relação
// nenhuma com cobranças específicas - existe mesmo que o vínculo nunca
// tenha gerado uma Charge ainda.
export type IMyPlayerProgramDTO = {
  id: string;
  program_name: string;
  // Valor líquido (monthly_fee - discount), já calculado pelo backend.
  monthly_fee: number;
  // false quando o vínculo já foi cancelado - nesse caso o app não mostra
  // o botão de cancelar (o backend rejeita cancelar de novo com 400).
  is_active: boolean;
};
