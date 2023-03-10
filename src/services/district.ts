import { http } from 'services/http'
import { DistrictType } from 'types/district'
import { transformResponseData } from 'utils/http'

export const getDistrictList = (cityId: string): Promise<DistrictType[]> =>
  http.get(`location/cities/${cityId}/districts`).then(transformResponseData)
