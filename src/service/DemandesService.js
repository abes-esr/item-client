export class DemandesService {
    baseURL = import.meta.env.VITE_API_URL;
    authToken = import.meta.env.VITE_API_TOKEN;

    async getDemandesPaginated(type, extension, page, itemPerPage) {
        const url = new URL(`${this.baseURL}demandes`);
        url.searchParams.append('type', type);
        url.searchParams.append('extension', extension);
        url.searchParams.append('page', page);
        url.searchParams.append('size', itemPerPage);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            },
        });
        console.log(JSON.stringify(response));
        return response.json();
    }
}

export default new DemandesService();
