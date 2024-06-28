import axios from 'axios';

export class DemandesService {
  //todo: renommer le service
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL
    });

    // Ajout de l'intercepteur
    this.client.interceptors.request.use(
      (config) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user && user.token) {
          config.headers.Authorization = user.token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  login(login, password) {
    const url = import.meta.env.VITE_API_URL + `signin`;
    console.info('appel:' + url);

    return this.client.post(`signin`, {username: login, password: password})
      .then((response) => {
        const userData = {
          login: login,
          shortname: response.data.shortname,
          token: `Bearer ${response.data.accessToken}`,
          userNum: response.data.userNum,
          iln: response.data.iln,
          role: response.data.role,
          email: response.data.email
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        this.client.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
        return userData;
      })
      .catch(error => {
        console.error(error);
        sessionStorage.clear();
        throw error;
      });
  }

  logout() {
    sessionStorage.removeItem('user');
    sessionStorage.clear()
    delete this.client.defaults.headers.common.Authorization;
  }

  fetchDemandes(type, archive, extensionIln) {
    console.info('appel: ' + import.meta.env.VITE_API_URL + `demandes/${type}?archive=${archive}&extension=${extensionIln}`)
    return this.client.get(`demandes/${type}?archive=${archive}&extension=${extensionIln}`)
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
    const url = `archiverDemande/${type}/${numDemande}`;
    console.info('appel: ' + import.meta.env.VITE_API_URL + url);
    return this.client.get(url);
  }

  supprimerDemande(type, numDemande) {
    const url = `supprimerDemande/${type}/${numDemande}`;
    console.info('appel: ' + import.meta.env.VITE_API_URL + url);
    return this.client.get(url);
  }

  checkToken(){
    const url = `checkToken`;
    console.info('appel: ' + import.meta.env.VITE_API_URL + url);
    return this.client.get(url)
  }

  modifierEmail(id, email){
    const config = { headers: {'Content-Type': 'text/plain'} };
    return this.client.patch(`utilisateurs/${id}`, email, config);
  }
  creerEmail(id, email){
    const config = { headers: {'Content-Type': 'text/plain'} };
    return this.client.post(`utilisateurs/${id}`, email, config);
  }
  creerDemande(rcr, typeDemande){
    return this.client.post(`demandes/${typeDemande}?rcr=${rcr}`);
  }

  modifierDemande(id, rcr, typeDemande){
    return this.client.patch(`demandes/${typeDemande}/${id}?rcr=${rcr}`);
  }

  uploadDemande(id, file, typeDemande){

    const config = { headers: {
      'Content-Type': 'multipart/form-data',
        'charset': 'utf-8'
    }};
    const data = new FormData();
    data.append('file',file);
    return this.client.post(`uploadDemande/${typeDemande}/${id}`,data,config);
  }

  getDemande(id, typeDemande){
    return this.client.get(`demandes/${typeDemande}/${id}`);
  }
}

export default new DemandesService()
