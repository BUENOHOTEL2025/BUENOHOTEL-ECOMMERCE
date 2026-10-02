import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';

const TOKEN_KEY = 'buenohotel_auth_token';
const USER_KEY = 'buenohotel_user_data';

export type ComprobanteRow = {
  encf?: string;
  origen?: string;
  razonSocial?: string;
  clienteNombre?: string;
  rncComprador?: string;
  estado?: string;
  aprobadoDgii?: boolean;
  emitidoAt?: string;
  trackId?: string;
  registroId?: string;
  tieneImpresion?: boolean;
  tieneXml?: boolean;
  montoTotal?: number;
};

@Injectable({ providedIn: 'root' })
export class FacturacionHubService {
  readonly api = environment.coreApi.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  token(): string {
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch {
      return '';
    }
  }

  headers(): HttpHeaders {
    const t = this.token();
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (t) h = h.set('Authorization', `Bearer ${t}`);
    return h;
  }

  isAdmin(): boolean {
    try {
      const raw = localStorage.getItem(USER_KEY);
      const u = raw ? JSON.parse(raw) : {};
      const role = String(u?.rol || u?.role || u?.tipo || '').toLowerCase();
      if (role === 'admin' || role === 'administrador') return true;
      const email = String(u?.email || '').toLowerCase();
      return email.endsWith('@buenohotel.com.do') || email === 'info@buenohotel.com';
    } catch {
      return false;
    }
  }

  async login(email: string, password: string): Promise<void> {
    const data = await firstValueFrom(
      this.http.post<any>(`${this.api}/api/auth/login`, { email, password })
    );
    const token = data?.token || data?.accessToken || data?.data?.token;
    const user = data?.user || data?.data?.user || data?.data || {};
    if (!token) throw new Error(data?.message || 'No se recibió sesión');
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (!this.isAdmin()) {
      localStorage.removeItem(TOKEN_KEY);
      throw new Error('Esta cuenta no es de administración.');
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  listar() {
    return this.http.get<any>(`${this.api}/api/facturacion/comprobantes`, { headers: this.headers() });
  }

  consulta(params: { encf?: string; trackId?: string; registroId?: string }) {
    const q = new URLSearchParams();
    if (params.encf) q.set('encf', params.encf);
    if (params.trackId) q.set('trackId', params.trackId);
    if (params.registroId) q.set('registroId', params.registroId);
    return this.http.get<any>(`${this.api}/api/facturacion/consulta?${q.toString()}`, {
      headers: this.headers()
    });
  }

  refrescar() {
    return this.http.post<any>(
      `${this.api}/api/facturacion/comprobantes/refrescar`,
      {},
      { headers: this.headers() }
    );
  }

  emitir(body: unknown) {
    return this.http.post<any>(`${this.api}/api/facturacion/emitir`, body, { headers: this.headers() });
  }

  previewHtml(body: unknown) {
    return fetch(`${this.api}/api/facturacion/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token() ? { Authorization: `Bearer ${this.token()}` } : {})
      },
      body: JSON.stringify(body)
    });
  }

  htmlUrl(id: string) {
    return `${this.api}/api/facturacion/comprobantes/${encodeURIComponent(id)}/html`;
  }

  xmlUrl(id: string) {
    return `${this.api}/api/facturacion/comprobantes/${encodeURIComponent(id)}/xml`;
  }

  async downloadXml(id: string) {
    const resp = await fetch(this.xmlUrl(id), {
      headers: this.token() ? { Authorization: `Bearer ${this.token()}` } : {}
    });
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      throw new Error(data.message || `HTTP ${resp.status}`);
    }
    const blob = await resp.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${id}.xml`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  async openHtml(id: string) {
    const resp = await fetch(this.htmlUrl(id), {
      headers: this.token() ? { Authorization: `Bearer ${this.token()}` } : {}
    });
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      throw new Error(data.message || 'No se pudo abrir la factura');
    }
    const html = await resp.text();
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  }
}
