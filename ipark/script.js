document.addEventListener('DOMContentLoaded', () => {
  // Pages and steps
  const pageIds = ['page-home','page-login','page-personal','page-vehicles','page-slots','page-payment','page-bill','page-thanks'];
  const pages = pageIds.map(id => document.getElementById(id));
  const steps = Array.from(document.querySelectorAll('.step'));
  let current = 0;
  function showPage(i){
    pages.forEach((p,idx) => p.classList.toggle('active', idx===i));
    steps.forEach((s,idx)=> s.classList.toggle('active', idx===i));
    current = i;
    window.scrollTo({top:0, behavior:'smooth'});
  }
  showPage(0);

  // Navigation helpers
  document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => showPage(Math.min(current+1, pages.length-1))));
  document.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => showPage(Math.max(current-1,0))));

  // Start button
  document.getElementById('startBtn').addEventListener('click', ()=> showPage(1));

  // ===== Auth (mock front-end) =====
  const users = {};  // ← works now
  document.getElementById('registerBtn').addEventListener('click', () => {
    const e = document.getElementById('authEmail').value.trim();
    const p = document.getElementById('authPass').value;
    if(!e||!p){ alert('Enter email and password to register.'); return; }
    users[e] = p;
    alert('Registered successfully. Now login.');
  });
  document.getElementById('loginBtn').addEventListener('click', () => {
    const e = document.getElementById('authEmail').value.trim();
    const p = document.getElementById('authPass').value;
    if(users[e] && users[e]===p){ showPage(2); } 
    else { alert('Invalid credentials. If new user, register first.'); }
  });

  document.getElementById('forgotLink').addEventListener('click', (ev)=>{ 
    ev.preventDefault(); 
    alert('Password reset link sent (mock).'); 
  });

  // ===== Personal & Vehicles =====
  const numVehiclesEl = document.getElementById('numVehicles');
  const vehiclesContainer = document.getElementById('vehiclesContainer');
  const toVehiclesBtn = document.getElementById('toVehiclesBtn');

  // generate vehicle input blocks
  function renderVehicleInputs(){
    const n = Math.min(3, Math.max(1, parseInt(numVehiclesEl.value || '1',10)));
    vehiclesContainer.innerHTML = '';
    for(let i=1;i<=n;i++){
      const div = document.createElement('div');
      div.className = 'vehicleBlock';
      div.innerHTML = `
        <div class="vehicleBlockInner">
          <label>Vehicle ${i} Number</label>
          <input class="vnum" placeholder="e.g. KA01AB1234" />
          <label>Vehicle ${i} Type</label>
          <select class="vtype">
            <option value="2W">2 Wheeler</option>
            <option value="3W">3 Wheeler</option>
            <option value="4W">4 Wheeler</option>
            <option value="EV">EV (Electric)</option>
          </select>
        </div>
      `;
      vehiclesContainer.appendChild(div);
    }
  }

  // initial render & listen
  renderVehicleInputs();
  numVehiclesEl.addEventListener('change', renderVehicleInputs);
  numVehiclesEl.addEventListener('input', renderVehicleInputs);

  toVehiclesBtn.addEventListener('click', ()=> {
    const name = document.getElementById('name').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    if(!name || !mobile){ alert('Enter name & mobile'); return; }
    showPage(3);
  });

  // ===== Slot booking =====
  const timeOfDayEl = document.getElementById('timeOfDay');
  const durationEl = document.getElementById('duration');
  const startTimeEl = document.getElementById('startTime');
  const slotsGrid = document.getElementById('slotsGrid');
  const evChargeBlock = document.getElementById('evChargeBlock');
  const evChargeEl = document.getElementById('evCharge');

  function genStartTimes(){
    const tod = timeOfDayEl.value;
    const dur = parseInt(durationEl.value,10) || 1;
    startTimeEl.innerHTML = '';
    let start=6,end=24;
    if(tod==='morning'){ start=6; end=12; }
    else if(tod==='afternoon'){ start=12; end=18; }
    else { start=18; end=24; }

    for(let s=start; s+dur<=end; s++){
      const label = formatHour(s) + ' — ' + formatHour(s+dur);
      const opt = document.createElement('option');
      opt.value = `${s}-${s+dur}`;
      opt.textContent = label;
      startTimeEl.appendChild(opt);
    }
  }
  function formatHour(h){
    const hh = h % 24;
    const period = hh < 12 ? 'AM' : 'PM';
    const display = hh % 12 === 0 ? 12 : hh % 12;
    return `${display}:00 ${period}`;
  }
  genStartTimes();
  timeOfDayEl.addEventListener('change', genStartTimes);
  durationEl.addEventListener('change', genStartTimes);

  const availability = { '1': true, '2': true, 'EV': true };
  if(Math.random()>0.6) availability['2'] = false;
  if(Math.random()>0.5) availability['EV'] = false;

  function refreshSlotsUI(){
    slotsGrid.querySelectorAll('.slotCard').forEach(card => {
      const key = card.dataset.slot;
      card.classList.remove('selected','occupied');
      const dot = card.querySelector('.slotDot');
      if(!availability[key]){ card.classList.add('occupied'); dot.style.background = '#ef4444'; }
      else { dot.style.background = (key==='EV' ? '#7c3aed' : '#34d399'); }
    });
  }
  refreshSlotsUI();

  const state = {
    personal: {},
    vehicles: [],
    assignments: {},
    booking: { timeOfDay:'morning', duration:1, startTime:'', evCharge:'' },
    payment: {},
    computed: {}
  };

  function readVehiclesFromInputs(){
    const blocks = Array.from(document.querySelectorAll('.vehicleBlock'));
    const arr = blocks.map(b=>{
      const num = b.querySelector('.vnum').value.trim() || 'NA';
      const type = b.querySelector('.vtype').value;
      return { number: num, type };
    });
    state.vehicles = arr;
    return arr;
  }

  slotsGrid.addEventListener('click', (ev)=>{
    const card = ev.target.closest('.slotCard');
    if(!card) return;
    const key = card.dataset.slot;
    if(!availability[key]){ alert('Slot occupied'); return; }

    const vehicles = readVehiclesFromInputs();
    const maxAssign = vehicles.length;
    const assignedCount = Object.keys(state.assignments).length;

    if(assignedCount >= maxAssign){
      const proceed = confirm(`All ${maxAssign} vehicle(s) already assigned. Reassign?`);
      if(!proceed) return;
    }

    const unassigned = [];
    for(let i=0;i<vehicles.length;i++){
      if(!Object.values(state.assignments).includes(i)) unassigned.push(i);
    }

    let pickIndex;
    if(unassigned.length===0){
      const labels = vehicles.map((v,i)=> `${i+1}: ${v.number} (${v.type})`).join('\n');
      const ans = prompt(`All assigned. Enter vehicle index:\n${labels}`, '1');
      if(!ans) return;
      pickIndex = parseInt(ans,10)-1;
      if(isNaN(pickIndex)||pickIndex<0||pickIndex>=vehicles.length){ alert('Invalid'); return; }
    } else if(unassigned.length>1){
      const labels = unassigned.map(i=> `${i+1}: ${vehicles[i].number} (${vehicles[i].type})`).join('\n');
      const ans = prompt(`Assign to which vehicle?\n${labels}`, `${unassigned[0]+1}`);
      if(!ans) return;
      pickIndex = parseInt(ans,10)-1;
      if(isNaN(pickIndex)||!unassigned.includes(pickIndex)){ alert('Invalid'); return; }
    } else {
      pickIndex = unassigned[0];
    }

    for(const k in state.assignments){ if(state.assignments[k]===pickIndex) delete state.assignments[k]; }
    state.assignments[key] = pickIndex;

    card.classList.add('selected');
    const existingLabel = card.querySelector('.assignedLabel');
    if(existingLabel) existingLabel.remove();
    const lbl = document.createElement('div');
    lbl.className = 'assignedLabel muted';
    lbl.textContent = `Veh ${pickIndex+1}`;
    card.appendChild(lbl);

    if(key==='EV') evChargeBlock.classList.remove('hidden');
  });

  document.getElementById('toPaymentBtn').addEventListener('click', ()=>{
    state.personal.name = document.getElementById('name').value.trim();
    state.personal.mobile = document.getElementById('mobile').value.trim();
    state.personal.email = document.getElementById('email').value.trim();

    if(!state.personal.name || !state.personal.mobile){ alert('Fill name and mobile'); return; }
    readVehiclesFromInputs();

    if(Object.keys(state.assignments).length === 0){
      const ok = confirm('No slot assigned. Continue anyway?');
      if(!ok) return;
    }

    state.booking.timeOfDay = timeOfDayEl.value;
    state.booking.duration = parseInt(durationEl.value,10);
    state.booking.startTime = startTimeEl.options[startTimeEl.selectedIndex]?.textContent || '';
    state.booking.evCharge = evChargeEl.value || '';

    computeSummary();
    renderSummaryBox();
    showPage(5);
  });

  const baseRates = { morning: 30, afternoon: 40, night: 25 };
  const evExtra = { Slow:5, Normal:10, Fast:20 };

  function computeSummary(){
    const vehicles = state.vehicles;
    const dur = state.booking.duration || 1;
    const tod = state.booking.timeOfDay || 'morning';
    const baseRate = baseRates[tod];

    let subtotal = 0;
    const items = [];

    const surge = Math.random() > 0.8 ? (1 + (0.1 + Math.random()*0.2)) : 1.0;

    for(let i=0;i<vehicles.length;i++){
      let rate = baseRate;
      let assignedSlotKey = null;
      for(const k in state.assignments){ if(state.assignments[k] === i) assignedSlotKey = k; }
      let chargingCostPerHr = 0;

      if(assignedSlotKey === 'EV' || vehicles[i].type === 'EV'){
        const ch = state.booking.evCharge || (vehicles[i].type === 'EV' ? 'Normal' : '');
        chargingCostPerHr = evExtra[ch] || 0;
        rate += chargingCostPerHr;
      }

      const amount = rate * dur * surge;
      items.push({ index:i, number: vehicles[i].number, type: vehicles[i].type, slot: assignedSlotKey || 'None', rate, amount, chargingPerHr: chargingCostPerHr });
      subtotal += amount;
    }

    const gst = subtotal * 0.05;
    const service = 10;
    const total = subtotal + gst + service;

    state.computed = { items, subtotal, gst, service, total, surge };
  }

  function renderSummaryBox(){
    const s = state.computed;
    let t = `Vehicles: ${state.vehicles.length}\nStart: ${state.booking.startTime}\nDuration: ${state.booking.duration} hr(s)\n\nDetails:\n`;
    s.items.forEach(it=>{
      t += `Veh ${it.index+1}: ${it.number} (${it.type}) — Slot: ${it.slot} — ₹${it.amount.toFixed(2)}\n`;
    });
    t += `\nSubtotal: ₹${s.subtotal.toFixed(2)}\nGST (5%): ₹${s.gst.toFixed(2)}\nService: ₹${s.service.toFixed(2)}\nSURGE: x${s.surge.toFixed(2)}\nTotal: ₹${s.total.toFixed(2)}\n`;
    document.getElementById('summaryBox').textContent = t;
  }

  const paymentMethodEl = document.getElementById('paymentMethod');
  const paymentArea = document.getElementById('paymentArea');

  paymentMethodEl.addEventListener('change', ()=>{
    paymentArea.innerHTML = '';
    const v = paymentMethodEl.value;

    if(v==='upi'){
      const upiInput = document.createElement('input');
      upiInput.placeholder = 'UPI ID (eg name@bank)';
      const btn = document.createElement('button');
      btn.textContent = 'Show UPI QR';
      btn.className = 'btn';
      const canvas = document.createElement('canvas');
      btn.addEventListener('click', ()=>{
        const upi = upiInput.value.trim() || 'ipark@upi';
        paymentArea.appendChild(canvas);
        QRCode.toCanvas(canvas, `upi://pay?pa=${encodeURIComponent(upi)}&pn=I-Park&cu=INR`, { width: 160 });
      });
      paymentArea.appendChild(upiInput); 
      paymentArea.appendChild(btn);
    } 
    else if(v==='card'){
      paymentArea.innerHTML = `
        <input placeholder="Card number" class="cardField"/>
        <input placeholder="Expiry MM/YY" class="cardField"/>
        <input placeholder="CVV" class="cardField"/>
      `;
    } 
    else if(v==='wallet'){
      paymentArea.innerHTML = `<input placeholder="Wallet ID / Mobile" />`;
    }
  });

  document.getElementById('payAndBillBtn').addEventListener('click', ()=>{
    if(!paymentMethodEl.value){ alert('Choose payment method'); return; }
    state.payment.method = paymentMethodEl.value;

    for(const k in state.assignments){ availability[k]=false; }
    refreshSlotsUI();

    buildBillAndTicket();
    showPage(6);
  });

  function buildBillAndTicket(){
    const s = state.computed;
    const lines = [];
    const tId = 'IPK-' + Math.random().toString(36).substring(2,9).toUpperCase();
    s.ticketId = tId;

    lines.push('I-PARK — Invoice');
    lines.push(`Ticket ID: ${tId}`);
    lines.push(`Name: ${state.personal.name} | Mobile: ${state.personal.mobile} | Email: ${state.personal.email}`);
    lines.push('');
    s.items.forEach(it=>{
      lines.push(`Vehicle ${it.index+1}: ${it.number} (${it.type})`);
      lines.push(`  Slot: ${it.slot} | Rate/hr: ₹${it.rate.toFixed(2)} | Amount: ₹${it.amount.toFixed(2)}`);
    });
    lines.push('');
    lines.push(`Subtotal: ₹${s.subtotal.toFixed(2)}`);
    lines.push(`GST (5%): ₹${s.gst.toFixed(2)}`);
    lines.push(`Service: ₹${s.service.toFixed(2)}`);
    lines.push(`Total: ₹${s.total.toFixed(2)}`);
    lines.push('');
    lines.push('Thank you for using I-PARK!');

    document.getElementById('billText').textContent = lines.join('\n');
    document.getElementById('ticketIdBox').textContent = `Ticket: ${tId}`;

    const ticketObj = {
      ticketId: s.ticketId,
      name: state.personal.name,
      mobile: state.personal.mobile,
      vehicles: state.vehicles,
      slots: state.assignments,
      startTime: state.booking.startTime,
      total: s.total
    };
    const canvas = document.getElementById('ticketQR');
    QRCode.toCanvas(canvas, JSON.stringify(ticketObj), { width: 160 });
  }

  document.getElementById('downloadTxtBtn').addEventListener('click', ()=>{
    const text = document.getElementById('billText').textContent;
    const blob = new Blob([text], { type:'text/plain' });
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob); 
    a.download = `${state.computed.ticketId || 'ipark_bill'}.txt`; 
    a.click();
  });

 document.getElementById('downloadPdfBtn').addEventListener('click', async ()=>{
  const s = state.computed;

  const el = document.createElement('div');
  el.style.padding = '16px';
  el.style.background = '#fff';
  el.style.color = '#111';
  el.style.fontFamily = 'Arial, sans-serif';
  el.style.fontSize = '14px';
  el.innerHTML = `
    <h2 style="text-align:center;">I-PARK — Invoice</h2>
    <p><strong>Ticket ID:</strong> ${s.ticketId}</p>
    <p><strong>Name:</strong> ${state.personal.name}<br>
       <strong>Mobile:</strong> ${state.personal.mobile}<br>
       <strong>Email:</strong> ${state.personal.email}</p>
    <p><strong>Start Time:</strong> ${state.booking.startTime} | <strong>Duration:</strong> ${state.booking.duration} hr(s)</p>
    <h3>Vehicles & Slots</h3>
    <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse; width:100%;">
      <tr>
        <th>#</th><th>Vehicle Number</th><th>Type</th><th>Slot</th><th>Rate/hr</th><th>Amount</th>
      </tr>
      ${s.items.map(it => `
        <tr>
          <td>${it.index+1}</td>
          <td>${it.number}</td>
          <td>${it.type}</td>
          <td>${it.slot}</td>
          <td>₹${it.rate.toFixed(2)}</td>
          <td>₹${it.amount.toFixed(2)}</td>
        </tr>
      `).join('')}
    </table>
    <h3>Summary</h3>
    <p>Subtotal: ₹${s.subtotal.toFixed(2)}<br>
       GST (5%): ₹${s.gst.toFixed(2)}<br>
       Service: ₹${s.service.toFixed(2)}<br>
       SURGE: x${s.surge.toFixed(2)}<br>
       <strong>Total: ₹${s.total.toFixed(2)}</strong></p>
    <h3>QR Code</h3>
    <div id="pdfQRContainer"></div>
    <p style="text-align:center;">Thank you for using I-PARK!</p>
  `;

  document.body.appendChild(el);

  // Add QR code to PDF
  const qrDiv = el.querySelector('#pdfQRContainer');
  const canvas = document.createElement('canvas');
  qrDiv.appendChild(canvas);
  await QRCode.toCanvas(canvas, JSON.stringify({
    ticketId: s.ticketId,
    name: state.personal.name,
    mobile: state.personal.mobile,
    vehicles: state.vehicles,
    slots: state.assignments,
    startTime: state.booking.startTime,
    total: s.total
  }), { width: 160 });

  // Generate PDF
  await html2pdf().from(el).set({ filename: `${s.ticketId || 'ipark_bill'}.pdf` }).save();
  el.remove();
});


  document.getElementById('finishBtn').addEventListener('click', ()=> {
    alert('Booking complete — returning to home.');
    window.location.reload();
  });
  document.getElementById('backHome').addEventListener('click', ()=> window.location.reload());

});


