import { useCallback, useRef, useState } from 'react';

import { TextInput } from 'react-native';

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

import { Header } from '@components/Header';
import { Loading } from '@components/Loading';
import { Input } from '@components/Form/Input';
import { InputMask } from '@components/Form/InputMask';
import { Button } from '@components/Form/Button';
import { IChampionshipsDTO } from '@dtos/championship-dto';

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
};

type ISubscriptionRouteParams = {
  championshipId: string;
};

const subscriptionValidationSchema = zod.object({
  name: zod.string().min(1),
  email: zod.string().email(),
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

  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  const { championshipId } = route.params as ISubscriptionRouteParams;

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const whatsappRef = useRef<TextInput>(null);
  const clubRef = useRef<TextInput>(null);
  const valueRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
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
            type: 'warning',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Informe as categorias que vai participar.',
          });

          return;
        }

        const data = {
          name,
          email,
          whatsapp,
          club,
          championship_id: championshipId,
          category_name: selectedCategories,
        };

        console.log('Dados', data);

        const response = await api.post('/subscriptions', data);

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
        setIsLoadingSendSubscription(false);

        if (error instanceof AxiosError) {
          if (error.response) {
            if (error.response.status === 400) {
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
        console.log('Erro', error);

        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Equipe AMIP',
          text2: 'Ops! Não foi possível realizar sua inscrição!',
        });
      }
    },
    [selectedCategories, championshipId, navigation],
  );
  // END FUNCTIONS

  // USE QUERY
  const {
    data: categoriesAndChampionship,
    isLoading: isLoadingCategoriesAndChampionship,
  } = useQuery<IResponseCategoriesAndChampionship | undefined>({
    queryKey: ['championship', championshipId],
    queryFn: async () => {
      const responseChampionship = await api.get(
        `/championships/show/${championshipId}`,
      );

      const responseCategory = await api.get('/categories');

      if (
        responseChampionship.status === 200 &&
        responseCategory.status === 200
      ) {
        const championshipData = responseChampionship.data as IChampionshipsDTO;

        const categoryData = responseCategory.data as ICategory[];

        return { categories: categoryData, championship: championshipData };
      }
    },
  });
  // END USE QUERY

  return (
    <SubscriptionContainer>
      <Header title="Faça sua inscrição" />

      {isLoadingCategoriesAndChampionship ? (
        <Loading />
      ) : (
        <SubscriptionContent>
          {categoriesAndChampionship && (
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
                      emailRef.current?.focus();
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={emailRef}
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={value}
                    placeholder="Informe o e-mail"
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    keyboardType="email-address"
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
                  <Input
                    ref={clubRef}
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={value}
                    placeholder="Informe o clube"
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    error={errors.club?.message}
                    returnKeyType="next"
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    onSubmitEditing={() => {
                      valueRef.current?.focus();
                    }}
                  />
                )}
              />

              {categoriesAndChampionship.championship.value > 0 && (
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
                      {categoriesAndChampionship.championship.value / 100}
                    </SubscriptionPlaceDateChampionshipText>
                  </SubscriptionPlaceDateChampionshipContent>
                </SubscriptionPlaceDateChampionshipContainer>
              )}

              <SubscriptionCategoriesContainer>
                <SubscriptionCategoriesTitle>
                  Categorias
                </SubscriptionCategoriesTitle>

                <SubscriptionCategoryContent>
                  {categoriesAndChampionship.categories.map((category) => (
                    <SubscriptionCategoryActionButton
                      key={category.id}
                      active={selectedCategories.includes(category.name)}
                      onPress={() => handleSelectedCategories(category.name)}
                    >
                      <SubscriptionCategoryActionButtonText>
                        {category.name}
                      </SubscriptionCategoryActionButtonText>
                    </SubscriptionCategoryActionButton>
                  ))}
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
      )}
    </SubscriptionContainer>
  );
}
