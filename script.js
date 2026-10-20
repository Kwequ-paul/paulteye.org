const m=document.querySelector('.menu'),n=document.querySelector('.nav');if(m&&n){m.addEventListener('click',()=>{let o=n.classList.toggle('open');m.setAttribute('aria-expanded',String(o));m.textContent=o?'×':'☰'});n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{n.classList.remove('open');m.setAttribute('aria-expanded','false');m.textContent='☰'}))}let y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();

// Portfolio data is served by the Cloudflare Worker. Airtable credentials remain server-side.
const PORTFOLIO_API = 'https://paul-teye-portfolio-api.teikwekupaul.workers.dev/';
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const safeURL = (value) => { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
const formatDate = (value) => { if (!value) return ''; const d = new Date(value + (String(value).length === 10 ? 'T12:00:00' : '')); return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}); };
async function loadPortfolioData(){
  try {
    const response = await fetch(PORTFOLIO_API, { headers: { 'Accept':'application/json' } });
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    renderPublications(data.publications || []);
    renderProjects(data.projects || []);
    renderEducation(data.education || []);
    renderExperience(data.experience || []);
  } catch (error) {
    const message = 'The records could not be loaded right now. Please try refreshing this page later.';
    ['publication-list','project-list','education-list','experience-list'].forEach(id => { const el=document.getElementById(id); if(el) el.innerHTML=`<p class="notice">${message}</p>`; });
    const status=document.getElementById('publication-status'); if(status) status.textContent='Live database connection unavailable.';
    console.error('Portfolio API error:', error);
  }
}
function renderPublications(items){
  const target=document.getElementById('publication-list'); if(!target) return;
  const visible=items.filter(item => String(item.stage || item.status || 'Published').toLowerCase() !== 'draft');
  if(!visible.length){ target.innerHTML='<p class="notice">No public publication records are available yet.</p>'; return; }
  const sorted=[...visible].sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured)) || String(b.date||'').localeCompare(String(a.date||'')));
  target.innerHTML=sorted.map(item=>{
    const title=escapeHTML(item.title || item.name || 'Untitled publication');
    const authors=escapeHTML(item.authors || (Array.isArray(item.authorsList)?item.authorsList.join(', '):''));
    const type=escapeHTML(item.type || item.publicationType || 'Publication');
    const stage=escapeHTML(item.stage || item.status || 'Published');
    const venue=escapeHTML(item.venue || item.journal || '');
    const date=formatDate(item.date || item.publicationDate);
    const doi=String(item.doi || item.DOI || '').trim();
    const doiURL=doi ? safeURL(/^https?:\/\//i.test(doi)?doi:`https://doi.org/${doi}`) : '';
    const link=safeURL(item.link || item.url || '') || doiURL;
    const abstract=escapeHTML(item.abstract || '');
    return `<article class="paper"><span class="pill">${type.toUpperCase()}</span>${item.featured?'<span class="pill" style="margin-left:6px">FEATURED</span>':''}<h3>${title}</h3>${authors?`<p><strong>Authors:</strong> ${authors}</p>`:''}<p>${venue?`<strong>Venue:</strong> ${venue} · `:''}${date?`<strong>Date:</strong> ${escapeHTML(date)} · `:''}<strong>Status:</strong> ${stage}</p>${doi?`<p><strong>DOI:</strong> ${doiURL?`<a href="${escapeHTML(doiURL)}" target="_blank" rel="noopener noreferrer">${escapeHTML(doi)}</a>`:escapeHTML(doi)}</p>`:''}${abstract?`<details><summary style="cursor:pointer;font-weight:700;font-size:12px">Read abstract</summary><p>${abstract.replace(/\n/g,'<br>')}</p></details>`:''}${link?`<p><a class="btn light" href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">View publication ↗</a></p>`:''}</article>`;
  }).join('');
  const status=document.getElementById('publication-status'); if(status) status.textContent=`${visible.length} record${visible.length===1?'':'s'} loaded from the portfolio database.`;
}
function renderProjects(items){
  const target=document.getElementById('project-list'); if(!target) return;
  const visible=items.filter(item => String(item.status||'').toLowerCase() !== 'draft');
  if(!visible.length){ target.innerHTML='<p class="notice">No public project records are available yet.</p>'; return; }
  const sorted=[...visible].sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured)) || String(a.name||'').localeCompare(String(b.name||'')));
  target.innerHTML=sorted.map((item,i)=>{
    const name=escapeHTML(item.name || item.title || 'Untitled project');
    const desc=escapeHTML(item.description || 'Project description to be added.');
    const type=escapeHTML(item.type || 'PROJECT');
    const status=escapeHTML(item.status || 'In progress');
    const tech=Array.isArray(item.technologies)?item.technologies:item.technologies?[String(item.technologies)]:[];
    const url=safeURL(item.url || item.link || '');
    return `<article class="card ${item.featured?'green':''}"><span class="label">${String(i+1).padStart(2,'0')} / ${type.toUpperCase()}</span><div class="project-art">${escapeHTML(type.toUpperCase())}</div><h3>${name}</h3><p>${desc}</p><p><strong>Status:</strong> ${status}${item.startDate?` · <strong>Started:</strong> ${escapeHTML(formatDate(item.startDate))}`:''}</p>${tech.length?`<div class="tags">${tech.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div>`:''}${url?`<p><a class="btn light" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">View project ↗</a></p>`:''}</article>`;
  }).join('');
}
loadPortfolioData();

function renderEducation(items){
  const target=document.getElementById('education-list'); if(!target) return;
  const visible=items.filter(item=>String(item.status||'Published').toLowerCase()!=='draft');
  if(!visible.length){target.innerHTML='<p class="notice">No public education records are available yet.</p>';return;}
  target.innerHTML=visible.map(item=>{
    const qualification=escapeHTML(item.qualification||item.degree||item.title||item.name||'Academic qualification');
    const institution=escapeHTML(item.institution||item.school||item.organization||'');
    const location=escapeHTML(item.location||'');
    const start=escapeHTML(item.startDate||item.start||''); const end=escapeHTML(item.endDate||item.end||item.graduationDate||'');
    const period=[start,end].filter(Boolean).join(' — ');
    const description=escapeHTML(item.description||item.details||item.achievement||'');
    const award=escapeHTML(item.honors||item.grade||item.result||'');
    return `<div class="timeline-item"><span class="pill">${escapeHTML(item.type||'EDUCATION')}</span>${period?`<p class="timeline-date">${period}</p>`:''}<h3>${qualification}</h3>${institution?`<p class="institution">${institution}${location?' · '+location:''}</p>`:''}${description?`<p>${description}</p>`:''}${award?`<p><strong>Honours / result:</strong> ${award}</p>`:''}</div>`;
  }).join('');
  const status=document.getElementById('education-status'); if(status)status.textContent=`${visible.length} education record${visible.length===1?'':'s'} loaded from the portfolio database.`;
}
function renderExperience(items){
  const target=document.getElementById('experience-list'); if(!target) return;
  const visible=items.filter(item=>String(item.status||'Published').toLowerCase()!=='draft');
  if(!visible.length){target.innerHTML='<p class="notice">No public experience records are available yet.</p>';return;}
  target.innerHTML=visible.map((item,i)=>{
    const role=escapeHTML(item.role||item.position||item.title||item.name||'Professional role');
    const organization=escapeHTML(item.organization||item.institution||item.employer||'');
    const location=escapeHTML(item.location||'');
    const start=escapeHTML(item.startDate||item.start||''); const end=escapeHTML(item.endDate||item.end||'');
    const period=[start,end].filter(Boolean).join(' — ');
    const description=escapeHTML(item.description||item.responsibilities||item.details||'');
    return `<div class="timeline-item"><span class="pill">${escapeHTML(item.type||'EXPERIENCE')}</span>${period?`<p class="timeline-date">${period}</p>`:''}<h3>${role}</h3>${organization?`<p class="institution">${organization}${location?' · '+location:''}</p>`:''}${description?`<p>${description.replace(/\n/g,'<br>')}</p>`:''}</div>`;
  }).join('');
  const status=document.getElementById('experience-status'); if(status)status.textContent=`${visible.length} experience record${visible.length===1?'':'s'} loaded from the portfolio database.`;
}
