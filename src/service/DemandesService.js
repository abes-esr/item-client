import axios from 'axios';

export class DemandesService {
	//authToken = import.meta.env.VITE_API_TOKEN

  client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`}
  });

  axiosFetchDemandes(type, extension) {
    console.info('appel: ' + import.meta.env.VITE_API_URL + `demandes?type=${type}&extension=${extension}`)
    return this.client.get(`demandes?type=${type}&extension=${extension}`)
  }
}

export default new DemandesService()
