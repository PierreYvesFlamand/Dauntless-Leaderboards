import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Injectable({
    providedIn: 'root'
})
export class HtmlTagsService {
    constructor(
        private meta: Meta,
        private title: Title
    ) { }

    private reset() {
        this.title.setTitle('Dauntless Leaderboards');
        this.meta.updateTag({ property: 'og:title', content: 'Dauntless Leaderboards' });
        this.meta.updateTag({ property: 'og:description', content: 'Dauntless Trials & Gauntlets Leaderboards' });
        this.meta.updateTag({ name: 'description', content: 'Dauntless Trials & Gauntlets Leaderboards' });
        this.meta.updateTag({ property: 'og:image', content: 'https://dauntless-leaderboards.com/assets/img/app_icon.png' });
    }

    public set(params: { title?: string, description?: string, image?: string } = {}) {
        
        this.reset();
        if(params.title){            
            this.title.setTitle(params.title);
            this.meta.updateTag({ property: 'og:title', content: params.title });
        }
        if(params.description){
            this.meta.updateTag({ property: 'og:description', content: params.description });
            this.meta.updateTag({ name: 'description', content: params.description });
        }
        if(params.image){
            this.meta.updateTag({ property: 'og:image', content: params.image });
        }
    }
}