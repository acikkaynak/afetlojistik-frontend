import { LoginResponseType } from 'types/user'
import { http } from 'services/http'
import { transformResponseData } from 'utils/http'
import { LoginFormType } from 'types/login'
import { RegisterFormType } from 'types/register'

export const requestAuthCode = async (data: LoginFormType): Promise<LoginResponseType> =>
  http
    .post('user/login', {
      ...data
    })
    .then(transformResponseData)

export const register = async (data: RegisterFormType): Promise<LoginResponseType> =>
  http
    .post('user', {
      ...data
    })
    .then(transformResponseData)
