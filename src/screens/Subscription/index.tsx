import { useCallback, useRef, useState } from 'react';

import { ScrollView, TextInput } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

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
  name: zod.string().min(1),
  // email: zod.string().email(),
  whatsapp: zod.string().min(1),
  club: zod.string().min(1),
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

  const { championshipId } = route.params as ISubscriptionRouteParams;

  const nameRef = useRef<TextInput>(null);
  // const emailRef = useRef<TextInput>(null);
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
    async ({ name, whatsapp, club }: ISubscriptionFormSubmitData) => {
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

        const data = {
          name,
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

        const categoryData = responseCategory.data as ICategory[];

        const clubsSelectPicker = clubsData.map((club) => {
          return {
            label: club.name,
            value: club.name,
          };
        });

        if (player.id) {
          setValue('name', player.name);
          setValue('whatsapp', player.phone);
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
        <ScrollView style={{ flexGrow: 1 }}>
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
                      placeholderTextColor={theme.COLORS['gray-color-400']}
                      error={errors.name?.message}
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
                      placeholderTextColor={theme.COLORS['gray-color-400']}
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
                        color={theme.COLORS['black-color']}
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
                                  : theme.COLORS['gray-color']
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
