import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

import { IPlayerDTO } from '@dtos/player-dto';

import { api } from '@services/api';

import {
  authTokenAddStorage,
  authTokenGetStorageStorage,
  authTokenRemoveStorage,
} from '@storage/auth-token-storage';

import { playerAddStorage, playerRemoveStorage } from '@storage/player-storage';

interface IAuthState {
  player: IPlayerDTO;
  token: string;
  refresh_token: string;
}

interface ICredentials {
  email: string;
  password: string;
}

interface IAuthContextDataProps {
  player: IPlayerDTO;
  isLoadingUserStorageData: boolean;
  signIn({ email, password }: ICredentials): Promise<void>;
  // Devolve `is_new_player` pra tela de SignIn decidir se leva o atleta
  // direto pro app ou pra um fluxo de completar o perfil (sem telefone/
  // data de nascimento, que o Google não fornece) - decisão de UX ainda
  // não tomada, ver comentário em SignInScreen.
  signInWithGoogle(id_token: string): Promise<{ is_new_player: boolean }>;
  signOut(): Promise<void>;
  updatePlayerProfile(player: IPlayerDTO): Promise<void>;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextDataProps>(
  {} as IAuthContextDataProps,
);

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [player, setPlayer] = useState<IPlayerDTO>({} as IPlayerDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  // FUNCTIONS
  const userAndTokenUpdate = useCallback(
    async (playerData: IPlayerDTO, token: string) => {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setPlayer(playerData);
    },
    [],
  );

  const storageUserAndTokenSave = useCallback(
    async (playerData: IPlayerDTO, token: string, refresh_token: string) => {
      try {
        setIsLoadingUserStorageData(true);

        await playerAddStorage(playerData);
        await authTokenAddStorage({ token, refresh_token });
      } catch (error) {
        throw error;
      } finally {
        setIsLoadingUserStorageData(false);
      }
    },
    [],
  );

  const signIn = useCallback(
    async ({ email, password }: ICredentials) => {
      try {
        const response = await api.post('/authenticate_player/session', {
          email,
          password,
        });

        if (response.status === 201) {
          const { player, token, refresh_token } = response.data as IAuthState;

          await storageUserAndTokenSave(player, token, refresh_token);
          await userAndTokenUpdate(player, token);

          api.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        throw error;
      }
    },
    [storageUserAndTokenSave, userAndTokenUpdate],
  );

  const signInWithGoogle = useCallback(
    async (id_token: string) => {
      const response = await api.post('/authenticate_player/google', {
        id_token,
      });

      const { player, token, refresh_token, is_new_player } =
        response.data as IAuthState & { is_new_player: boolean };

      await storageUserAndTokenSave(player, token, refresh_token);
      await userAndTokenUpdate(player, token);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      return { is_new_player };
    },
    [storageUserAndTokenSave, userAndTokenUpdate],
  );

  const signOut = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true);

      setPlayer({} as IPlayerDTO);

      await playerRemoveStorage();
      await authTokenRemoveStorage();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }, []);

  const updatePlayerProfile = useCallback(async (player: IPlayerDTO) => {
    await playerAddStorage(player);

    setPlayer(player);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true);

      const { token } = await authTokenGetStorageStorage();

      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        const response = await api.get('/players/me');

        if (response.status === 200) {
          const playerData = response.data;

          userAndTokenUpdate(playerData, token);
        }
      }
    } catch (error) {
      throw error;
      // await signOut();
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }, [userAndTokenUpdate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    // LIMPEZA DE MEMÓRIA
    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        player,
        isLoadingUserStorageData,
        signIn,
        signInWithGoogle,
        signOut,
        updatePlayerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextDataProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be use whiting an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
