export type IPlayerDTO = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  // Opcionais desde o login via Google (que não fornece nenhum dos dois) -
  // uma conta criada assim fica sem telefone/data de nascimento até o
  // atleta completar o perfil.
  birthday?: string;
  phone?: string;
  street_name: string;
  street_number: string;
  neighborhood: string;
  postal_code: string;
  reference: string;
  city: string;
  uf: string;
  avatar: string;
  avatar_url: string;
  // Preenchido só pra contas vinculadas a um login com Google.
  google_id?: string;
};
