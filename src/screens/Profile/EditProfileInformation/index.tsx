import { useCallback, useRef, useState } from 'react';

import { Platform, Pressable, ScrollView, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useForm } from 'react-hook-form';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';

import { useQuery } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import DatePicker from 'react-native-date-picker';

import { useTheme } from 'styled-components/native';

import { api } from '@services/api';

import { useAuth } from '@hooks/auth';

import { IPlayerDTO } from '@dtos/player-dto';

import { Header } from '@components/Header';
import { Loading } from '@components/Loading';
import { Input } from '@components/Form/Input';
import { InputMask } from '@components/Form/InputMask';

const editProfileValidationSchema = zod.object({
  name: zod.string().min(1),
  email: zod.string().email(),
  birthday: zod.string().min(1),
  phone: zod.string().min(1),
});

type IEditProfileFormSubmitData = zod.infer<typeof editProfileValidationSchema>;

export function EditProfileInformationScreen() {
  const [openDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState<Date>();
  const [dateBirthday, setDateBirthday] = useState('');

  const { updatePlayerProfile } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const birthdayRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IEditProfileFormSubmitData>({
    resolver: zodResolver(editProfileValidationSchema),
  });

  // FUNCTIONS
  const handleSelectedBirthday = useCallback((date: Date) => {
    setIsOpenDatePicker(false);

    setSelectedBirthday(date);

    const dateFormat = format(date, 'dd/MM/yyyy');
    setDateBirthday(dateFormat);
  }, []);

  const handleEditProfile = useCallback(
    ({ name, email, birthday, phone }: IEditProfileFormSubmitData) => {},
    [],
  );
  // END FUNCTIONS
}
