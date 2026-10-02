import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturacionHubService, ComprobanteRow } from '@services/facturacion-hub.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-facturacion-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturacion-admin-page.component.html',
  styleUrl: './facturacion-admin-page.component.scss'
})
export class FacturacionAdminPageComponent implements OnInit {
  email = '';
  password = '';
  loginError = '';
  loading = false;
  items: ComprobanteRow[] = [];
  filtered: ComprobanteRow[] = [];
  q = '';
  qEncf = '';
  qTrack = '';
  state = '';
  modalOpen = false;
  modalHtml = '';
  form = {
    origen: 'ecommerce',
    nombreRazon: '',
    rnc: '',
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
    itbis: 0,
    totalRD: 0
  };
  formMsg = '';

  constructor(public hub: FacturacionHubService) {}

  ngOnInit(): void {
    if (this.hub.token() && this.hub.isAdmin()) this.cargar();
  }

  loggedIn(): boolean {
    return Boolean(this.hub.token()) && this.hub.isAdmin();
  }

  async onLogin(): Promise<void> {
    this.loginError = '';
    this.loading = true;
    try {
      await this.hub.login(this.email.trim(), this.password);
      await this.cargar();
    } catch (e: any) {
      this.loginError = e?.message || 'No se pudo iniciar sesión';
    } finally {
      this.loading = false;
    }
  }

  onLogout(): void {
    this.hub.logout();
    this.items = [];
    this.filtered = [];
  }

  async cargar(): Promise<void> {
    this.state = 'Cargando comprobantes…';
    try {
      const data = await firstValueFrom(this.hub.listar());
      this.items = data?.items || [];
      this.applyFilter();
      this.state = `${this.filtered.length} comprobante(s)`;
    } catch (e: any) {
      this.state = e?.message || 'No se pudieron cargar';
    }
  }

  applyFilter(): void {
    const q = this.q.trim().toLowerCase();
    this.filtered = !q
      ? [...this.items]
      : this.items.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
    this.state = `${this.filtered.length} comprobante(s)`;
  }

  origenLabel(row: ComprobanteRow): string {
    const o = String(row.origen || '').toLowerCase();
    if (o === 'eventos') return 'Eventos';
    if (o === 'booking') return 'Booking';
    if (o === 'ecommerce') return 'Ecommerce';
    if (o === 'seguro') return 'Seguro';
    if (o === 'tours') return 'Tours';
    if (o === 'manual') return 'Manual';
    return row.origen || '—';
  }

  badge(row: ComprobanteRow): { label: string; bg: string } {
    const est = String(row.estado || '');
    if (row.aprobadoDgii || /acept/i.test(est)) return { label: 'Aceptado', bg: '#28a745' };
    if (/rechaz/i.test(est)) return { label: 'No aceptado', bg: '#dc2626' };
    if (/proceso|enviado/i.test(est)) return { label: 'En revisión', bg: '#d97706' };
    return { label: est || 'Sin consultar', bg: '#64748b' };
  }

  async consultar(row?: ComprobanteRow): Promise<void> {
    const encf = row?.encf || this.qEncf.trim();
    const trackId = row?.trackId || this.qTrack.trim();
    if (!encf && !trackId) {
      this.formMsg = 'Indica un e-NCF o una referencia de envío.';
      return;
    }
    this.modalOpen = true;
    this.modalHtml = 'Consultando en Impuestos Internos…';
    try {
      const data = await firstValueFrom(
        this.hub.consulta({ encf, trackId, registroId: row?.registroId })
      );
      const cr = data?.apis?.consultaResultado?.data || {};
      const tracks = Array.isArray(data?.apis?.tracks?.data)
        ? data.apis.tracks.data
        : data?.apis?.tracks?.data?.tracks || [];
      const t0 = tracks[0] || {};
      const estado = cr.estado || t0.estado || data?.local?.estado || '—';
      this.modalHtml = `<p style="font-size:1.05rem;line-height:1.45;margin:0 0 12px;"><strong>${this.esc(estado)}</strong></p>
        <p>Número: <strong>${this.esc(data?.encf || encf)}</strong><br/>
        Origen: ${this.esc(this.origenLabel(data?.local || row || {}))}<br/>
        Empresa: ${this.esc(data?.previewComprador?.razonSocial || data?.local?.razonSocial || '—')}<br/>
        RNC: ${this.esc(data?.previewComprador?.rnc || data?.local?.rncComprador || '—')}</p>
        <pre style="background:#0f172a;color:#e2e8f0;padding:12px;border-radius:10px;overflow:auto;font-size:11px;">${this.esc(JSON.stringify({ consulta: cr, tracks, publico: data?.apis?.estadoPublico?.data ?? null }, null, 2))}</pre>`;
    } catch (e: any) {
      this.modalHtml = `<p>${this.esc(e?.message || 'Error al consultar')}</p>`;
    }
  }

  async verFactura(row: ComprobanteRow): Promise<void> {
    try {
      await this.hub.openHtml(row.encf || row.registroId || '');
    } catch (e: any) {
      this.formMsg = e?.message || 'No se pudo abrir';
    }
  }

  async xml(row: ComprobanteRow): Promise<void> {
    try {
      await this.hub.downloadXml(row.encf || row.registroId || '');
    } catch (e: any) {
      this.formMsg = e?.message || 'No se pudo descargar XML';
    }
  }

  recalc(): void {
    const cant = Number(this.form.cantidad) || 0;
    const p = Number(this.form.precioUnitario) || 0;
    const itbis = Number(this.form.itbis) || 0;
    this.form.totalRD = Math.round((cant * p + itbis) * 100) / 100;
  }

  payload() {
    this.recalc();
    return {
      origen: this.form.origen || 'ecommerce',
      tipoeCF: 31,
      comprador: {
        nombreRazon: this.form.nombreRazon.trim(),
        rnc: String(this.form.rnc || '').replace(/\D/g, '')
      },
      lineas: [
        {
          descripcion: this.form.descripcion.trim() || 'Servicio',
          cantidad: Number(this.form.cantidad) || 1,
          precioUnitario: Number(this.form.precioUnitario) || 0,
          itbisLinea: Number(this.form.itbis) || 0,
          importeLinea: this.form.totalRD
        }
      ],
      totales: { totalRD: this.form.totalRD, MontoTotal: this.form.totalRD, itbis: Number(this.form.itbis) || 0 }
    };
  }

  async preview(): Promise<void> {
    this.formMsg = '';
    try {
      const resp = await this.hub.previewHtml(this.payload());
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.message || 'No se pudo previsualizar');
      }
      const html = await resp.text();
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(html);
        w.document.close();
      }
    } catch (e: any) {
      this.formMsg = e?.message || 'Error en vista previa';
    }
  }

  async emitir(): Promise<void> {
    if (!window.confirm('Esto reserva un e-NCF y envía el XML a Impuestos Internos. ¿Emitir ahora?')) return;
    this.formMsg = 'Enviando a Impuestos Internos…';
    try {
      const data = await firstValueFrom(this.hub.emitir(this.payload()));
      this.formMsg = `Emitido ${data?.encf || ''} · ${data?.estado || ''} · track ${data?.trackId || '—'}`;
      await this.cargar();
    } catch (e: any) {
      this.formMsg = e?.error?.message || e?.message || 'Error al emitir';
    }
  }

  private esc(s: unknown): string {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
