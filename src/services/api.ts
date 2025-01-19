import axios, { AxiosError, AxiosInstance } from 'axios';

import { AppError } from '@utils/app-error';

import { API_URL } from '@env';

import {
  authTokenGetStorageStorage,
  authTokenAddStorage,
} from '@storage/auth-token-storage';

/**
 * INTERFACE PORQUE NÃO TEMOS ACESSO A FUNÇÃO SIGNOUT
 * QUE ESTÁ NO CONTEXTO
 */
type SingOut = () => void;

type IAPIInstanceProps = AxiosInstance & {
  /**
   * GERENCIAR A INTERCEPTAÇÃO DO TOKEN
   * UMA FUNÇÃO QUE RECEBE OUTRA FUNÇÃO
   * NA PRIMEIRA FUNÇÃO RECEBEMOS O MÉTODO DE SIGNOUT
   * NA SEGUNDA FUNÇÃO VAI SER O INTERCEPTOR
   */
  registerInterceptTokenManager: (signOut: SingOut) => () => void;
};

type IPromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

export const api = axios.create({
  baseURL: API_URL,
}) as IAPIInstanceProps;

// FILA DE ESPERA DAS REQUISIÇÕES
let failedQueue: IPromiseType[] = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut) => {
  // ESTAMOS COLOCANDO O INTERCEPTADOR ELE NA CONSTANTE
  // PORQUE VAMOS UTILIZAR UM OUTRO MÉTODO DO INTERCEPTADOR
  // QUE É DA UM EJECT NO INTERCEPTADOR DEPOIS DE USAR ELE

  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      // VERIFICANDO O TOKEN
      if (requestError?.response?.status === 401) {
        const { refresh_token } = await authTokenGetStorageStorage();

        if (!refresh_token) {
          signOut();

          return Promise.reject(requestError);
        }

        const originalRequestConfig = requestError.config;

        /**
         * VERIFICA SE ESTÁ ACONTECENDO A
         * SOLICITAÇÃO DE UM NOVO TOKEN
         */
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              onSuccess: (token: string) => {
                originalRequestConfig.headers = {
                  Authorization: `Bearer ${token}`,
                };

                resolve(api(originalRequestConfig));
              },
              onFailure: (error: AxiosError) => {
                reject(error);
              },
            });
          });
        }

        /**
         * QUANDO OUTRA REQUISIÇÃO PASSAR POR AQUI
         * ISSO VAI ESTAR COMO VERDADEIRO
         * E SE O TOKEN NÃO TIVER SIDO ATUALIZDO
         * IMPLEMENTAREMOS A LÓGICA DE ADICIONAR AS
         * REQUISIÇÕES NO IF ACIMA
         */
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          try {
            api
              .post('/authenticate_player/refresh_token', {
                refresh_token,
              })
              .then(async (response) => {
                const data = response.data;

                await authTokenAddStorage({
                  token: data.token,
                  refresh_token: data.refresh_token,
                });

                /**
                 * REENVIANDO AS REQUISIÇÕES
                 */
                if (originalRequestConfig.data) {
                  originalRequestConfig.data = JSON.parse(
                    originalRequestConfig.data,
                  );
                }

                originalRequestConfig.headers = {
                  Authorization: `Bearer ${data.token}`,
                };

                api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

                failedQueue.forEach((request) => {
                  request.onSuccess(data.token);
                });

                resolve(api(originalRequestConfig));
              });
          } catch (error: any) {
            /**
             * CASO DÊ ERRO PARA OBTER O TOKEN
             * PERCORREMOS A FILA DE REQUISIÇÕES
             * E INFORMAMOS O ERRO NA REQUEST
             *
             */
            failedQueue.forEach((request) => {
              request.onFailure(error);
            });

            /**
             * DESLOGAMOS O URUÁRIO
             * E REJEITAMOS A PROMISE
             */
            signOut();
            reject(error);
          } finally {
            isRefreshing = false;
            failedQueue = [];
          }
        });
      }

      // SE O ERRO NÃO FOR NENHUM ACIMA, FAZEMOS O LOGOUT DO USUÁRIO
      signOut();

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        // return Promise.reject(
        //   new AppError('Erro no servidor. Tente novamente mais tarde.'),
        // );
        return Promise.reject(requestError);
      }
    },
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};
