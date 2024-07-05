import axios from 'axios';

export class IdrefService {
  //todo: renommer le service
  constructor() {
    this.client = axios.create({
      baseURL: 'https://www.idref.fr/services/'
    });
  }

  getRcrByIln(iln){
    return this.client.get(`iln2rcr/${iln}&format=text/json`)
  }

}

export default new IdrefService()
