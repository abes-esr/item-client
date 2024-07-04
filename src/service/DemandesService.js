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
  archiverDemande(type, numDemande) {
    const url = `archiverDemande/${type}/${numDemande}`;
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

  modifierRcrDemande(id, rcr, typeDemande){
    return this.client.patch(`demandes/${typeDemande}/${id}?rcr=${rcr}`);
  }

  modifierTypeExempDemande(id, typeExemp){
    return this.client.patch(`demandes/EXEMP/${id}?typeExemp=${typeExemp}`);
  }

  modifierTypeTraitementModifDemande(id, typeTraitement){
    return this.client.patch(`demandes/MODIF/${id}?traitement=${typeTraitement}`);
  }

  modifierCommentaireDemande(id, commentaire, typeDemande){
    return this.client.patch(`demandes/${typeDemande}/${id}?commentaire=${commentaire}`);
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

  getTypeExemp(){
    return this.client.get('typeExemp');
  }

  getNbLigneFichier(id, typeDemande){
    return this.client.get(`nbLignesFichier/${typeDemande}/${id}`);
  }

  simulerLigne(id, nbLigne,typeDemande){
    return this.client.get(`simulerLigne/${typeDemande}/${id}/${nbLigne}`);

  }

  choixEtape(id, numEtape, typeDemande){
    return this.client.patch(`etapeChoisie/${typeDemande}/${id}?etape=${numEtape}`);
  }

  lancerDemande(id, typeDemande){
    return this.client.patch(`passerEnAttente/${typeDemande}/${id}`);
  }

  deleteDemande(id, typeDemande) {
    return this.client.delete(`demandes/${typeDemande}/${id}`);
  }

  getFile(id, typeDemande, prefix, extention){
    return this.client.get(`/files/${typeDemande}/${id}/${prefix}_${id}${extention}`);
  }

  getTypeTraitement(){
    return this.client.get('traitements');
  }

  getEtatsDemande(){
    return this.client.get('etatsDemande');
  }
}

export default new DemandesService()
