import { HTTPHandler } from '../api'
import { useQuery, UseQueryOptions } from 'react-query'

export type MeasurementUnit = {
  id: string
  name: string
  value: string
  createdAt: string
}

export type GetMeasurementUnitsResponse = {
  items: MeasurementUnit[]
  count: number
}

export async function getMeasurementUnits(
  page: number,
  pageLimit: any
): Promise<GetMeasurementUnitsResponse> {
  const { data } = await HTTPHandler.get('measurement-unit', {
    params: {
      page,
      pageLimit
    }
  })

  const count = data.count
  const items = data.items

  return {
    items,
    count
  }
}

export function useMeasurementUnits(page: number, options: UseQueryOptions, pageLimit) {
  return useQuery(['measurement-unit'], () => getMeasurementUnits(page, pageLimit), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options
  })
}
