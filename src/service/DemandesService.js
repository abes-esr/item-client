import axios from 'axios';

export class DemandesService {
	//authToken = import.meta.env.VITE_API_TOKEN

  client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`}
  });

  axiosFetchDemandes(type, archive, extensionIln) {
    console.info('appel: ' + import.meta.env.VITE_API_URL + `demandes?type=${type}&archive=${archive}&extension=${extensionIln}`)
    return this.client.get(`demandes?type=${type}&archive=${archive}&extension=${extensionIln}`)
  }

  axiosGetFile(filetype, demandeNumber, fileFormat) {
    const url = `https://item-dev.sudoc.fr/api/v1/files/${filetype}_${demandeNumber}.${fileFormat}?id=${demandeNumber}`;
    console.info('appel: ' + url);

    return this.client({
      url: url,
      method: 'GET',
      responseType: 'blob', // Indique que la réponse est de type blob (fichier)
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filetype}_${demandeNumber}.${fileFormat}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  //.head
  axiosHeadFile(filetype, demandeNumber, fileFormat) {
    const url = `https://item-dev.sudoc.fr/api/v1/files/${filetype}_${demandeNumber}.${fileFormat}?id=${demandeNumber}`;

    return this.client.head(url)
      .then((response) => response)
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          // Masquer l'erreur 500 dans la console
          return Promise.resolve({ status: 500, data: null });
        } else if (error.request && error.request.readyState === 4 && error.request.status === 0) {
          // Masquer l'erreur liée à XMLHttpRequest dans la console
          return Promise.resolve({ status: 0, data: null });
        } else {
          return Promise.reject(error);
        }
      });
  }
}

export default new DemandesService()
