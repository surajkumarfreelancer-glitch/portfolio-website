const defaults = {
  availability: 'Independent digital partner · India & beyond',
  headline: 'Digital systems<br /><i>that move</i> business forward.',
  subheadline: 'Websites, content, growth campaigns and AI workflows — built together, so every part of your business works in flow.',
  email: 'hello@digitalflow.studio',
  services: [
    ['01','Websites & Web Apps','Business websites, booking flows, secure owner dashboards and practical web apps.','⌘'],
    ['02','Video, Reels & Motion','Promo reels, YouTube edits, motion graphics, animated intros and content made to hold attention.','◒'],
    ['03','Marketing & Lead Generation','Meta ads, tracking, Instagram strategy, YouTube SEO and WhatsApp booking funnels.','↗'],
    ['04','AI Voice & Automation','English and Tamil AI voice, creative assets, research assistants and useful workflow automation.','✦']
  ],
  projects: [
    ['01','Adventure Buddha','Travel journeys, trip discovery and digital support for a tourism brand built over seven years.',['Travel','Web','Growth']],
    ['02','SLV Photography','A visual-first web direction for photography, events and the stories that surround them.',['Portfolio','Events','Visual']],
    ['03','Regional Content Studio','Devotional and regional-language content shaped for culture, audience and platform.',['Video','Tamil','Content']]
  ],
  skills: ['Business websites','Admin dashboards','Booking systems','Meta ads','Video editing','AI voice-over','AI images','YouTube SEO','Content strategy','Cloudflare setup','WhatsApp funnels','Research automation']
};
const isAdmin = location.pathname.replace(/\/$/, '') === '/admin';
let data = structuredClone(defaults);
let authenticated = false;
let saveTimer;
const $ = (selector, root=document) => root.querySelector(selector);
const escape = (value='') => String(value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function save(){
  render();
  if (!authenticated) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => fetch('/api/content', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ data }) }), 600);
}
function bindText(){ document.querySelectorAll('[data-bind]').forEach(el=>{ const key=el.dataset.bind; if(key in data) el.innerHTML=data[key]; }); document.querySelectorAll('[data-bind-href]').forEach(el=>el.href=`mailto:${data[el.dataset.bindHref]}`); }
function render(){
  bindText();
  $('#service-grid').innerHTML=data.services.map(([n,title,copy,symbol])=>`<article class="service-card"><span class="service-number">${n}</span><div><h3>${escape(title)}</h3><p>${escape(copy)}</p></div><span class="service-symbol">${symbol}</span></article>`).join('');
  $('#project-list').innerHTML=data.projects.map(([n,title,copy,tags])=>`<article class="project"><span class="num">${n}</span><div><h3>${escape(title)}</h3><div class="tags">${tags.map(tag=>`<span>${escape(tag)}</span>`).join('')}</div></div><p>${escape(copy)}</p><span class="project-link">↗</span></article>`).join('');
  $('#skill-cloud').innerHTML=data.skills.map(skill=>`<span class="skill">${escape(skill)}</span>`).join('');
  $('#year').textContent=new Date().getFullYear();
  if($('#studio-dialog').open) renderDashboard(activePanel);
}
let activePanel = 'overview';
function input(label,key,value,type='text'){ return `<div class="field"><label>${label}</label>${type==='textarea'?`<textarea data-key="${key}">${escape(value)}</textarea>`:`<input data-key="${key}" value="${escape(value)}" />`}</div>`; }
function wireFields(root){ root.querySelectorAll('[data-key]').forEach(field=>field.addEventListener('input',e=>{ data[e.target.dataset.key]=e.target.value; save(); })); }
function renderDashboard(panel){
  activePanel=panel; document.querySelectorAll('.dash-tab').forEach(tab=>tab.classList.toggle('active',tab.dataset.panel===panel));
  const title={overview:'Your studio at a glance',brand:'Brand & hero copy',services:'Edit your services',projects:'Edit selected work',skills:'Your skill cloud',contact:'Contact details'}[panel]; $('#panel-title').textContent=title; const holder=$('#dashboard-content');
  if(panel==='overview') holder.innerHTML=`<div class="overview-grid"><div class="overview-card"><strong>${data.services.length}</strong><span>service areas</span></div><div class="overview-card"><strong>${data.projects.length}</strong><span>featured projects</span></div><div class="overview-card"><strong>${data.skills.length}</strong><span>skills in your toolkit</span></div></div><p class="save-note" style="margin-top:18px">This dashboard is live and saves edits in this browser. When the Worker is connected to D1, these same fields will save securely for every device.</p>`;
  if(panel==='brand'){ holder.innerHTML=`<div class="editor-form">${input('Availability line','availability',data.availability)}${input('Main headline (HTML allowed for line breaks)','headline',data.headline,'textarea')}${input('Intro paragraph','subheadline',data.subheadline,'textarea')}<p class="save-note">Every edit updates the public-site preview immediately.</p></div>`; wireFields(holder); }
  if(panel==='contact'){ holder.innerHTML=`<div class="editor-form">${input('Studio email','email',data.email)}<p class="save-note">Connect this address to your inbox after the domain is ready.</p></div>`; wireFields(holder); }
  if(panel==='services'){ holder.innerHTML=`<div class="editor-form">${data.services.map((s,i)=>`<section class="project-editor"><h3>Service ${String(i+1).padStart(2,'0')}</h3><div class="editor-row">${input('Title',`service-${i}-title`,s[1])}${input('Symbol',`service-${i}-symbol`,s[3])}</div>${input('Description',`service-${i}-copy`,s[2],'textarea')}</section>`).join('')}</div>`; holder.querySelectorAll('[data-key]').forEach(f=>f.addEventListener('input',e=>{const [,i,field]=e.target.dataset.key.split('-'); data.services[+i][field==='title'?1:field==='copy'?2:3]=e.target.value;save();})); }
  if(panel==='projects'){ holder.innerHTML=`<div class="editor-form">${data.projects.map((p,i)=>`<section class="project-editor"><h3>Project ${p[0]}</h3>${input('Project name',`project-${i}-title`,p[1])}${input('Project description',`project-${i}-copy`,p[2],'textarea')}${input('Tags (comma separated)',`project-${i}-tags`,p[3].join(', '))}</section>`).join('')}</div>`; holder.querySelectorAll('[data-key]').forEach(f=>f.addEventListener('input',e=>{const [,i,field]=e.target.dataset.key.split('-'); data.projects[+i][field==='title'?1:field==='copy'?2:3]=field==='tags'?e.target.value.split(',').map(x=>x.trim()).filter(Boolean):e.target.value;save();})); }
  if(panel==='skills'){ holder.innerHTML=`<div class="skills-editor">${data.skills.map((skill,i)=>`<button class="active" data-remove="${i}" title="Remove skill">${escape(skill)} ×</button>`).join('')}</div><div class="editor-form" style="margin-top:24px"><div class="field"><label>Add a skill</label><input id="new-skill" placeholder="e.g. Email marketing" /></div><button class="button button-light" id="add-skill" type="button">Add skill <span>+</span></button></div>`; holder.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{data.skills.splice(+b.dataset.remove,1);save()})); $('#add-skill',holder).addEventListener('click',()=>{let v=$('#new-skill',holder).value.trim();if(v&&!data.skills.includes(v)){data.skills.push(v);save()}}); }
}
function openStudio(){
  $('#studio-dialog').showModal();
  renderDashboard(activePanel);
}
function closeStudio(){
  $('#studio-dialog').close();
}
document.querySelectorAll('[data-open-studio]').forEach(btn=>btn.addEventListener('click',openStudio));
document.querySelectorAll('[data-close-studio]').forEach(btn=>btn.addEventListener('click',closeStudio));
document.querySelectorAll('.dash-tab').forEach(tab=>tab.addEventListener('click',()=>renderDashboard(tab.dataset.panel)));
$('#reset-content').addEventListener('click',()=>{ data=structuredClone(defaults); save(); });
async function showLogin(message='') {
  const dialog = $('#studio-dialog');
  const dashboard = $('.dashboard');
  dashboard.style.cssText = 'grid-template-columns:1fr;max-width:600px;height:auto;min-height:480px;margin-top:10vh';
  dashboard.querySelector('aside').style.display = 'none';
  dialog.showModal();
  $('#panel-title').textContent = 'Private studio';
  $('#dashboard-content').innerHTML = `<div style="max-width:390px"><h3 style="font-size:26px;margin:0 0 12px">Welcome back.</h3><p style="font-size:13px;line-height:1.6;color:#657185">Sign in to edit Digital Flow Studio. Changes save only to your protected D1 database.</p><form id="login-form" class="editor-form"><div class="field"><label>Admin password</label><input id="admin-password" type="password" autocomplete="current-password" required /></div><p style="color:#a42e20;font-size:12px;min-height:16px">${message}</p><button class="button button-light" type="submit">Sign in <span>↗</span></button></form></div>`;
  $('#login-form').addEventListener('submit', async event => {
    event.preventDefault();
    const response = await fetch('/api/admin/login', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ password: $('#admin-password').value }) });
    if (!response.ok) return showLogin('Incorrect password. Please try again.');
    authenticated = true;
    dashboard.style.cssText = '';
    dashboard.querySelector('aside').style.display = '';
    renderDashboard('overview');
  });
}
async function boot() {
  render();
  try { const result = await fetch('/api/content'); const payload = await result.json(); if (payload.data) { data = { ...structuredClone(defaults), ...payload.data }; render(); } } catch {}
  if (!isAdmin) return;
  try { const result = await fetch('/api/admin/me'); authenticated = (await result.json()).authenticated; } catch {}
  if (authenticated) { $('#studio-dialog').showModal(); renderDashboard('overview'); } else showLogin();
}
boot();

