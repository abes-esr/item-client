export class DemandesService {
    baseURL = import.meta.env.VITE_API_URL;
    authToken = import.meta.env.VITE_API_TOKEN;

    async fetchDemandes(type, extension) {
      console.log(type, extension)
        const url = new URL(`${this.baseURL}demandes`);
        url.searchParams.append('type', type);
        url.searchParams.append('extension', extension);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            },
        });
        return response.json();
    }
}

export default new DemandesService();
