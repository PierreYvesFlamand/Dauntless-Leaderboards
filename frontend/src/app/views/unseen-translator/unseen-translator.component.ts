import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dl-unseen-translator',
  templateUrl: './unseen-translator.component.html',
  styleUrls: ['./unseen-translator.component.scss']
})
export class UnseenTranslatorComponent implements OnInit {
  ngOnInit(): void {
    this.onLatinAlphabetTextChange(this.latinAlphabetText);
    this.onUnseenAlphabetTextChange(this.unseenAlphabetText);
  }

  public alphabet = [
    ['A', 'ㅏ'],
    ['B', 'Б'],
    ['C', 'C'],
    ['D', 'Δ'],
    ['E', 'Э'],
    ['F', 'Ф'],
    ['G', 'Γ'],
    ['H', 'ㅎ'],
    ['I', 'И'],
    ['J', 'ㅈ'],
    ['K', 'ㅋ'],
    ['L', 'Λ'],
    ['M', 'ㅁ'],
    ['N', 'N'],
    ['O', 'Ω'],
    ['P', 'Π'],
    ['Q', 'Q'],
    ['R', 'ㄹ'],
    ['S', 'Σ'],
    ['T', 'T'],
    ['U', 'U'],
    ['V', 'V'],
    ['W', 'W'],
    ['X', 'X'],
    ['Y', 'Y'],
    ['Z', 'З'],
  ]

  public latinAlphabetText: string = 'Do you carry a lantern ?';
  public latinAlphabetTextToUnseenAlphabet: string = '';

  public onLatinAlphabetTextChange(text: string) {
    this.latinAlphabetTextToUnseenAlphabet = this.translateLatinAlphabetToUnseenAlphabet(text);
  }

  private translateLatinAlphabetToUnseenAlphabet(text: string): string {
    return text.split('').map((char) => {
      const match = this.alphabet.find(([latin]) => latin.toLowerCase() === char.toLowerCase());
      return match ? match[1] : char;
    }).join('');
  }

  public unseenAlphabetText: string = 'ΔΩ YΩU CㅏㄹㄹY ㅏ ΛㅏNTЭㄹN ?';
  public unseenAlphabetTextToLatinAlphabet: string = '';

  public onUnseenAlphabetTextChange(text: string) {
    this.unseenAlphabetTextToLatinAlphabet = this.translateUnseedAlphabetToLatinAlphabet(text);
  }

  private translateUnseedAlphabetToLatinAlphabet(text: string): string {
    return text.split('').map((char) => {
      const match = this.alphabet.find(([, unseen]) => unseen === char);
      return match ? match[0] : char;
    }).join('');
  }
}