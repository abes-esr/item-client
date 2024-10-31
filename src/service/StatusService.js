import axios from 'axios';

export class StatusService {
  constructor() {
    this.client = axios.create({
      baseURL: "https://api.uptimerobot.com/"
    });
  }

  async getStatusBaseXML(){
    let data = {"api_key":"ur707639-b082a50474d1cfbe940438bc", "monitors":"782344734"}
    return this.client.post(`v2/getMonitors`,data).then(
      response => {
        return response.data.monitors[0].status === 2;
      })
  }

}

export default new StatusService()
