import axios from 'axios';

export class IdrefService {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL_IDREF
    });
  }

  getRcrByIln(iln){
    return this.client.get(`iln2rcr/${iln}&format=text/json`)
  }

}

export default new IdrefService()
