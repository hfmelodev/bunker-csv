import axios from 'axios'
import { env } from '../env'

export const API_PROTHEUS_DATA = axios.create({
  baseURL: env.API_PROTHEUS_DATA,
})

export const API_PROTHEUS_ST = axios.create({
  baseURL: env.API_PROTHEUS_ST,
})
