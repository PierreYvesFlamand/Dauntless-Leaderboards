import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private baseUrl: string = `${environment.backendUrl}/api/`;

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