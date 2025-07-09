// custom.js - Cambios personalizados para Ecommerce BuenoHotel
// ===========================================
// WhatsApp Button, Mis Reservas, Servicios Destacados, y otros scripts

// --- WhatsApp Button ---
(function(){
  const btn = document.createElement('a');
  btn.href = 'https://wa.me/18093034991';
  btn.target = '_blank';
  btn.className = 'whatsapp-float-btn';
  btn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width:40px;height:40px;">';
  document.body.appendChild(btn);
})();

// --- Mis Reservas (dummy) ---
function mostrarReservas() {
  document.getElementById('mis-reservas-table').style.display = 'table';
}
function eliminarReserva(btn) {
  var row = btn.parentNode.parentNode;
  row.style.display = 'none';
}

// --- Servicios Destacados: Scroll to section if needed ---
function scrollToServicios() {
  var el = document.getElementById('servicios-section');
  if(el) el.scrollIntoView({behavior:'smooth'});
}
