import { HTTPHandler } from '../api'

export const getUser = async (id: string) => {
  try {
    const data = await HTTPHandler.get(`users/${id}`)
    return data
  } catch (err) {
    console.error(err)
  }
}
