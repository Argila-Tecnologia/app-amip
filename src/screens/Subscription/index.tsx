import { useCallback, useRef, useState } from 'react';

import { Linking, ScrollView, TextInput } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import { Controller, useForm } from 'react-hook-form';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { useQuery } from '@tanstack/react-query';

import { api } from '@services/api';

import Toast from 'react-native-toast-message';

import { useTheme } from 'styled-components/native';

import { AxiosError } from 'axios';

import { useAuth } from '@hooks/auth';

import { IChampionshipsDTO } from '@dtos/championship-dto';
import { IClubDTO } from '@dtos/clubs-dto';

import { Header } from '@components/Header';
import { Loading } from '@components/Loading';
import { Input } from '@components/Form/Input';
import { InputMask } from '@components/Form/InputMask';
import { SelectPicker } from '@components/Form/SelectPicker';
import { Button } from '@components/Form/Button';

import {
  SubscriptionCategoriesContainer,
  SubscriptionCategoriesTitle,
  SubscriptionCategoryActionButton,
  SubscriptionCategoryActionButtonText,
  SubscriptionCategoryContent,
  SubscriptionContainer,
  SubscriptionContent,
  SubscriptionForm,
  SubscriptionIconContainer,
  SubscriptionPlaceDateChampionshipContainer,
  SubscriptionPlaceDateChampionshipContent,
  SubscriptionPlaceDateChampionshipText,
} from './styles';

type ICategory = {
  id: string;
  name: string;
};

type IResponseCategoriesAndChampionship = {
  categories: ICategory[];
  championship: IChampionshipsDTO;
  clubs: {
    label: string;
    value: string;
  }[];
};

type ISubscriptionRouteParams = {
  championshipId: string;
};

const subscriptionValidationSchema = zod.object({
  name: zod
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório'),
  // Opcional aqui de propósito - só é exigido de verdade (checado na mão
  // em handleSubscription, não aqui no schema) quando o atleta não está
  // logado, já que quem tem conta não precisa digitar de novo o e-mail
  // que já está cadastrado. A API também exige isso (ver CreateSubscriptionUseCase,
  // "email" obrigatório só sem player_id).
  email: zod.string().email('E-mail inválido').optional().or(zod.literal('')),
  whatsapp: zod
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório'),
  club: zod
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório'),
});

type ISubscriptionFormSubmitData = zod.infer<
  typeof subscriptionValidationSchema
>;

export function SubscriptionScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingSendSubscription, setIsLoadingSendSubscription] =
    useState(false);

  const { player } = useAuth();
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { championshipId } = route.params as ISubscriptionRouteParams;

  // Sem isso, o botão "Realizar inscrição" (último item do formulário)
  // ficava colado na barra de navegação de 3 botões do Android, às vezes
  // parcialmente coberto por ela - mesmo padrão já usado em
  // DetailsChampionshipScreen.
  const paddingBottom = insets.bottom;

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const whatsappRef = useRef<TextInput>(null);
  const clubRef = useRef<TextInput>(null);
  // const valueRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ISubscriptionFormSubmitData>({
    resolver: zodResolver(subscriptionValidationSchema),
  });

  // FUNCTIONS
  const handleSelectedCategories = useCallback(
    (categoryValue: string) => {
      const selectCategoriesIndex = selectedCategories.findIndex(
        (selectedCategoriesToChampionship) =>
          selectedCategoriesToChampionship === categoryValue,
      );

      if (selectCategoriesIndex < 0) {
        setSelectedCategories((oldState) => [...oldState, categoryValue]);
      } else {
        const removeSelectedCategory = selectedCategories.filter(
          (selectedCategoriesToChampionship) =>
            selectedCategoriesToChampionship !== categoryValue,
        );

        setSelectedCategories(removeSelectedCategory);
      }
    },
    [selectedCategories],
  );

  const handleSubscription = useCallback(
    async ({ name, email, whatsapp, club }: ISubscriptionFormSubmitData) => {
      try {
        setIsLoadingSendSubscription(true);

        if (selectedCategories.length === 0) {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Informe a(s) categoria(s) que vai participar.',
          });

          return;
        }

        // A API exige e-mail quando não há player_id (inscrito sem conta
        // no app) - ver CreateSubscriptionUseCase. Checado aqui (igual à
        // checagem de categoria acima) em vez de no schema do zod, porque
        // a obrigatoriedade depende de "player.id" (login), não só do
        // valor do próprio campo.
        if (!player.id && !email) {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Informe seu e-mail.',
          });

          return;
        }

        const data = {
          name,
          // Quem já tem conta usa sempre o e-mail cadastrado no próprio
          // Player (a API nem olha pra esse campo nesse caso - ver
          // CreateSubscriptionUseCase) - não manda o do formulário pra
          // evitar confusão, mesmo que o campo nem apareça pra esse atleta.
          email: player.id ? undefined : email,
          whatsapp,
          club,
          championship_id: championshipId,
          category_name: selectedCategories,
          player_id: player.id ? player.id : null,
        };

        const response = await api.post('/subscriptions', data);

        // console.log('Dados', data);

        if (response.status === 201) {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Inscrição realizada com sucesso!',
          });

          // A API devolve { subscription, payment_url } desde que a
          // inscrição em campeonato passou a gerar cobrança automática
          // via AbacatePay - payment_url vem null quando o campeonato é
          // gratuito (nada a pagar), e preenchido quando tem valor. Igual
          // ao padrão já usado pro link de vídeo em DetailsChampionship:
          // confere se o dispositivo consegue abrir antes de tentar.
          const { payment_url: paymentUrl } = response.data as {
            payment_url: string | null;
          };

          if (paymentUrl) {
            const canOpenPaymentUrl = await Linking.canOpenURL(paymentUrl);

            if (canOpenPaymentUrl) {
              await Linking.openURL(paymentUrl);
            }
          }

          setSelectedCategories([]);

          navigation.navigate('appBottomTabs', {
            screen: 'championshipsScreen',
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          // console.log('Erro axios', error.response);
          if (error.response) {
            if (error.response.status === 401) {
              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Equipe AMIP',
                text2: 'Já identificamos uma inscrição com esse dados.',
              });

              return;
            }
          }
        }

        // console.log('Erro fora do axios', error);

        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Equipe AMIP',
          text2: 'Ops! Não foi possível realizar sua inscrição!',
        });
      } finally {
        // Antes o loading só era resetado no caminho de "sem categoria
        // selecionada" e no catch - faltava resetar depois de um envio
        // bem-sucedido. Como a tela navega pra outro lugar logo em
        // seguida, o efeito não aparecia na hora, mas o botão ficava
        // travado em "carregando" se o usuário voltasse pra essa tela
        // pela navegação (o React Navigation mantém a tela viva na
        // pilha). Centralizado num único finally, como nas outras telas.
        setIsLoadingSendSubscription(false);
      }
    },
    [selectedCategories, championshipId, player.id, navigation],
  );
  // END FUNCTIONS

  // USE QUERY
  const {
    data: categoriesClubsAndChampionship,
    isLoading: isLoadingCategoriesClubsAndChampionship,
  } = useQuery<IResponseCategoriesAndChampionship | undefined>({
    queryKey: ['subscriptionChampionship', championshipId],
    queryFn: async () => {
      const responseChampionship = await api.get(
        `/championships/show/${championshipId}`,
      );

      const responseClubs = await api.get('clubs');

      const responseCategory = await api.get('/categories');

      if (
        responseChampionship.status === 200 &&
        responseCategory.status === 200
      ) {
        const championshipData = responseChampionship.data as IChampionshipsDTO;

        const clubsData = responseClubs.data as IClubDTO[];

        const allCategories = responseCategory.data as ICategory[];

        // GET /categories retorna todas as categorias do sistema - o
        // campeonato só deve oferecer as que o admin selecionou na
        // criação (championshipData.categories_name), senão o atleta
        // vê e consegue escolher categorias fora do que foi definido
        // pra esse campeonato.
        const categoryData = allCategories.filter((category) =>
          championshipData.categories_name.includes(category.name),
        );

        const clubsSelectPicker = clubsData.map((club) => {
          return {
            label: club.name,
            value: club.name,
          };
        });

        if (player.id) {
          setValue('name', player.name);
          // "?? ''" só por causa do tipo (phone virou opcional por causa
          // do login via Google) - deixa o campo vazio pro atleta
          // preencher, em vez de pré-preencher com um telefone que não
          // existe ainda.
          setValue('whatsapp', player.phone ?? '');
        }

        return {
          categories: categoryData,
          clubs: clubsSelectPicker,
          championship: championshipData,
        };
      }
    },
  });

  // END USE QUERY

  return (
    <SubscriptionContainer>
      <Header title="Faça sua inscrição" />

      {isLoadingCategoriesClubsAndChampionship ? (
        <Loading />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom }}
          style={{ flexGrow: 1 }}
        >
          <SubscriptionContent>
            {categoriesClubsAndChampionship && (
              <SubscriptionForm>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={nameRef}
                      autoCorrect={false}
                      value={value}
                      placeholder="Informe o nome"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      error={errors.name?.message}
                      returnKeyType="next"
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      onSubmitEditing={() => {
                        if (!player.id) {
                          emailRef.current?.focus();
                        } else {
                          whatsappRef.current?.focus();
                        }
                      }}
                    />
                  )}
                />

                {/* Só pra quem não tem conta no app - quem está logado usa
                    o e-mail já cadastrado (ver handleSubscription), não
                    precisa digitar de novo. A API passou a exigir esse
                    campo desde que a inscrição em campeonato virou uma
                    cobrança automática via AbacatePay (ver
                    CreateSubscriptionUseCase). */}
                {!player.id && (
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        ref={emailRef}
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={value}
                        placeholder="Informe o e-mail"
                        placeholderTextColor={theme.COLORS['text-secondary']}
                        error={errors.email?.message}
                        returnKeyType="next"
                        onChangeText={(text) => {
                          onChange(text);
                        }}
                        onSubmitEditing={() => {
                          whatsappRef.current?.focus();
                        }}
                      />
                    )}
                  />
                )}

                <Controller
                  control={control}
                  name="whatsapp"
                  render={({ field: { value, onChange } }) => (
                    <InputMask
                      mask="(99)99999-9999"
                      autoCorrect={false}
                      autoCapitalize="none"
                      value={value}
                      placeholder="Ex.: DDD + Nº de telefone"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      keyboardType="numeric"
                      error={errors.whatsapp?.message}
                      returnKeyType="next"
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      onSubmitEditing={() => {
                        clubRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="club"
                  render={({ field: { value, onChange } }) => (
                    <SelectPicker
                      items={categoriesClubsAndChampionship.clubs}
                      placeholder="Selecione seu clube"
                      error={errors.club?.message}
                      value={value}
                      onValueChange={(text) => {
                        onChange(text);
                      }}
                    />
                  )}
                />

                {categoriesClubsAndChampionship.championship.value > 0 && (
                  <SubscriptionPlaceDateChampionshipContainer>
                    <SubscriptionIconContainer>
                      <Feather
                        name="dollar-sign"
                        size={15}
                        color={theme.COLORS.text}
                      />
                    </SubscriptionIconContainer>

                    <SubscriptionPlaceDateChampionshipContent>
                      <SubscriptionPlaceDateChampionshipText>
                        Valor:{' '}
                        {categoriesClubsAndChampionship.championship.value /
                          100}
                      </SubscriptionPlaceDateChampionshipText>
                    </SubscriptionPlaceDateChampionshipContent>
                  </SubscriptionPlaceDateChampionshipContainer>
                )}

                <SubscriptionCategoriesContainer>
                  <SubscriptionCategoriesTitle>
                    Categorias
                  </SubscriptionCategoriesTitle>

                  <SubscriptionCategoryContent>
                    {categoriesClubsAndChampionship.categories.map(
                      (category) => {
                        const active = selectedCategories.includes(
                          category.name,
                        );

                        return (
                          <SubscriptionCategoryActionButton
                            key={category.id}
                            onPress={() =>
                              handleSelectedCategories(category.name)
                            }
                          >
                            <Feather
                              name={active ? 'check-square' : 'square'}
                              size={25}
                              color={
                                active
                                  ? theme.COLORS['green-color']
                                  : theme.COLORS['text-secondary']
                              }
                            />

                            <SubscriptionCategoryActionButtonText>
                              {category.name}
                            </SubscriptionCategoryActionButtonText>
                          </SubscriptionCategoryActionButton>
                        );
                      },
                    )}
                  </SubscriptionCategoryContent>
                </SubscriptionCategoriesContainer>

                <Button
                  loading={loadingSendSubscription}
                  onPress={handleSubmit(handleSubscription)}
                >
                  Realizar inscrição
                </Button>
              </SubscriptionForm>
            )}
          </SubscriptionContent>
        </ScrollView>
      )}
    </SubscriptionContainer>
  );
}
