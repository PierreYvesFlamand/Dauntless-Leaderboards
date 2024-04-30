import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private baseUrl: string = 'http://localhost:7001/api/';

    public async fetch<T>(url: string): Promise<T | undefined> {
        try {
            const res = await fetch(this.baseUrl + url);
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
        }
        return undefined;
    }
}