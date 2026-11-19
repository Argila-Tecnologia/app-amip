export type IChampionshipsDTO = {
  id: string;
  name: string;
  type: string;
  description: string;
  value: number;
  place: string;
  date: string;
  // Data real de início (diferente de "date", que é texto livre) - usada
  // pra decidir se o campeonato é do ano corrente (listagem) e se já
  // passou (esconder o botão de inscrição). Nullable pra campeonato
  // antigo, criado antes dessa coluna existir no backend.
  start_date: string | null;
  link: string;
  avatar_url: string;
  video_url: string;
  categories_name: string[];
};
