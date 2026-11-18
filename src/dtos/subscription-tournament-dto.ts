// Mesmo shape devolvido por GET /subscriptions/me (api-ibra,
// ListMySubscriptionsUseCase) - "Inscrições em torneios", usada só pra
// listar as inscrições do próprio atleta em campeonato e permitir
// cancelar (ver MyTournamentSubscriptions/index.tsx). Ver CLAUDE.md,
// "Cancelamento de inscrição em torneio pelo próprio atleta".
export type IMySubscriptionDTO = {
  id: string;
  championship_id: string;
  championship_name: string;
  // Texto livre de exibição (ex: "17/11 a 20/11") - o mesmo campo que já
  // existe pra campeonato, não confundir com championship_start_date.
  championship_date: string;
  // null quando o campeonato ainda não tem a data real de início
  // preenchida pelo staff - nesse caso o backend bloqueia o cancelamento
  // self-service (ver CancelSubscriptionUseCase), então o app evita
  // oferecer a ação.
  championship_start_date: string | null;
  value: number;
  // false quando a inscrição já foi cancelada - nesse caso o app não
  // mostra o botão de cancelar (o backend rejeita cancelar de novo com
  // 400).
  enabled: boolean;
};
