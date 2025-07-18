import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly defaultLang = 'do';
  private readonly storageKey = 'userLanguage';
  
  // Lista de países con sus códigos de idioma y banderas
  languages: Language[] = [
    { code: 'do', name: 'República Dominicana', nativeName: 'Español', flag: '🇩🇴' },
    { code: 'es', name: 'España', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'mx', name: 'México', nativeName: 'Español', flag: '🇲🇽' },
    { code: 'ar', name: 'Argentina', nativeName: 'Español', flag: '🇦🇷' },
    { code: 'co', name: 'Colombia', nativeName: 'Español', flag: '🇨🇴' },
    { code: 'pe', name: 'Perú', nativeName: 'Español', flag: '🇵🇪' },
    { code: 've', name: 'Venezuela', nativeName: 'Español', flag: '🇻🇪' },
    { code: 'cl', name: 'Chile', nativeName: 'Español', flag: '🇨🇱' },
    { code: 'ec', name: 'Ecuador', nativeName: 'Español', flag: '🇪🇨' },
    { code: 'us', name: 'United States', nativeName: 'English', flag: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', nativeName: 'English', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', nativeName: 'English/Français', flag: '🇨🇦' },
    { code: 'fr', name: 'France', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutschland', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italia', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portugal', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'br', name: 'Brasil', nativeName: 'Português', flag: '🇧🇷' },
    { code: 'ru', name: 'Россия', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'cn', name: '中国', nativeName: '中文', flag: '🇨🇳' },
    { code: 'jp', name: '日本', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'kr', name: '대한민국', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'sa', name: 'السعودية', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'ae', name: 'الإمارات', nativeName: 'العربية', flag: '🇦🇪' },
    { code: 'in', name: 'India', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'tr', name: 'Türkiye', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'nl', name: 'Nederland', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'se', name: 'Sverige', nativeName: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norge', nativeName: 'Norsk', flag: '🇳🇴' },
    { code: 'dk', name: 'Danmark', nativeName: 'Dansk', flag: '🇩🇰' },
    { code: 'fi', name: 'Suomi', nativeName: 'Suomi', flag: '🇫🇮' },
    { code: 'pl', name: 'Polska', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'gr', name: 'Ελλάδα', nativeName: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'za', name: 'South Africa', nativeName: 'English/Afrikaans', flag: '🇿🇦' },
    { code: 'ng', name: 'Nigeria', nativeName: 'English', flag: '🇳🇬' },
    { code: 'eg', name: 'مصر', nativeName: 'العربية', flag: '🇪🇬' },
    { code: 'th', name: 'ประเทศไทย', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'id', name: 'Indonesia', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'my', name: 'Malaysia', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'vn', name: 'Việt Nam', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ph', name: 'Pilipinas', nativeName: 'Filipino', flag: '🇵🇭' },
    { code: 'sg', name: 'Singapore', nativeName: 'English/中文', flag: '🇸🇬' },
    { code: 'il', name: 'ישראל', nativeName: 'עברית', flag: '🇮🇱' },
    { code: 'nz', name: 'New Zealand', nativeName: 'English/Māori', flag: '🇳🇿' },
    { code: 'au', name: 'Australia', nativeName: 'English', flag: '🇦🇺' },
    { code: 'ie', name: 'Éire', nativeName: 'Gaeilge', flag: '🇮🇪' },
    { code: 'at', name: 'Österreich', nativeName: 'Deutsch', flag: '🇦🇹' },
    { code: 'ch', name: 'Schweiz', nativeName: 'Deutsch/Français/Italiano', flag: '🇨🇭' },
    { code: 'be', name: 'Belgique', nativeName: 'Nederlands/Français/Deutsch', flag: '🇧🇪' },
    { code: 'lu', name: 'Lëtzebuerg', nativeName: 'Lëtzebuergesch/Français/Deutsch', flag: '🇱🇺' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initLanguage();
  }

  private initLanguage(): void {
    // Solo ejecutar en el navegador
    if (this.isBrowser) {
      // Intenta cargar el idioma guardado o usa el del navegador
      const savedLang = localStorage.getItem(this.storageKey);
      const browserLang = this.getBrowserLanguage();
      const langToUse = savedLang || browserLang;
      
      this.setLanguage(langToUse);
    } else {
      // En el servidor, usar el idioma por defecto
      this.setLanguage(this.defaultLang);
    }
  }
  
  // Verifica si estamos en el navegador
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getBrowserLanguage(): string {
    // Solo ejecutar en el navegador
    if (this.isBrowser) {
      // Obtiene el idioma del navegador
      const browserLang = navigator.language || (navigator as any).userLanguage || this.defaultLang;
      // Extrae el código de idioma principal (ej: 'es' de 'es-ES')
      return browserLang.split('-')[0];
    }
    return this.defaultLang;
  }

  setLanguage(lang: string): void {
    // Verifica si el idioma está soportado
    const langExists = this.languages.some(l => l.code === lang);
    const langToSet = langExists ? lang : this.defaultLang;
    
    // Solo guardar en localStorage si estamos en el navegador
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, langToSet);
      
      // Actualiza el atributo lang del HTML para activar la traducción automática
      document.documentElement.lang = langToSet;
      
      // Notifica a los componentes que el idioma ha cambiado
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: langToSet }));
    }
  }

  getCurrentLanguage(): string {
    if (this.isBrowser) {
      return localStorage.getItem(this.storageKey) || this.defaultLang;
    }
    return this.defaultLang;
  }
  
  getLanguageName(langCode: string): string {
    const lang = this.languages.find(l => l.code === langCode);
    return lang ? lang.name : langCode;
  }
  
  getCurrentLanguageObject(): Language | undefined {
    return this.languages.find(lang => lang.code === this.getCurrentLanguage());
  }
}
