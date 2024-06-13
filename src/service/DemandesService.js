import axios from 'axios';

export class DemandesService {

  client = axios.create({
    baseURL: import.meta.env.VITE_API_URL
  });

  login(login, password) {
    const url = import.meta.env.VITE_API_URL + `signin`
    console.info('appel:' + url)

    this.client.post(`signin`, {username: login, password: password})
      .then((response) => {
        sessionStorage.setItem('user', JSON.stringify({
          login: login,
          shortname: response.data.shortname,
          token: `Bearer ${response.data.accessToken}`,
          userNum: response.data.userNum,
          iln: response.data.iln,
          role: response.data.role,
          email: response.data.email
        }));
        this.client.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      })
  }

  logout() {
    sessionStorage.removeItem('user');
    delete this.client.defaults.headers.common['Authorization'];
  }

  fetchDemandes(type, archive, extensionIln) {
    console.info('appel: ' + import.meta.env.VITE_API_URL + `demandes?type=${type}&archive=${archive}&extension=${extensionIln}`)
    return this.client.get(`demandes?type=${type}&archive=${archive}&extension=${extensionIln}`)
  }

  getFile(filetype, demandeNumber, fileFormat, typeDemande) {
    const url = import.meta.env.VITE_API_URL + `files/${filetype}_${demandeNumber}.${fileFormat}?id=${demandeNumber}&type=${typeDemande}`;
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

  //.head = controle de la disponibilité de l'url d'appel (pas de retour de data)
  checkFileExistence(filetype, demandeNumber, fileFormat, typeDemande) {
    const url = import.meta.env.VITE_API_URL + `files/${filetype}_${demandeNumber}.${fileFormat}?id=${demandeNumber}&type=${typeDemande}`;

    return this.client.head(url)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
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

  archiverDemande(type, numDemande) {
    const url = `archiverDemande?type=${type}&numDemande=${numDemande}`;
    console.info('appel: ' + import.meta.env.VITE_API_URL + url);
    return this.client.get(url);
  }

  supprimerDemande(type, numDemande) {
    const url = `supprimerDemande?type=${type}&numDemande=${numDemande}`;
    console.info('appel: ' + import.meta.env.VITE_API_URL + url);
    return this.client.get(url);
  }
}

export default new DemandesService()
