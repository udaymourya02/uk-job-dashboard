const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const cityMap = {
  'E1':'London','E2':'London','E3':'London','E14':'London','EC1':'London','EC2':'London','EC3':'London','EC4':'London',
  'N1':'London','NW1':'London','NW3':'London','SE1':'London','SW1':'London','SW3':'London','W1':'London','WC1':'London','WC2':'London',
  'E':'London','EC':'London','N':'London','NW':'London','SE':'London','SW':'London','W':'London','WC':'London',
  'M1':'Manchester','M2':'Manchester','M3':'Manchester','M4':'Manchester','M11':'Manchester','M12':'Manchester','M13':'Manchester','M14':'Manchester','M15':'Manchester','M16':'Manchester','M21':'Manchester','M22':'Manchester','M23':'Manchester','M24':'Manchester','M25':'Manchester','M40':'Manchester','M50':'Manchester','M60':'Manchester','M90':'Manchester',
  'B1':'Birmingham','B2':'Birmingham','B3':'Birmingham','B4':'Birmingham','B5':'Birmingham','B6':'Birmingham','B7':'Birmingham','B8':'Birmingham','B9':'Birmingham','B10':'Birmingham','B11':'Birmingham','B12':'Birmingham','B13':'Birmingham','B14':'Birmingham','B15':'Birmingham','B16':'Birmingham','B17':'Birmingham','B18':'Birmingham','B19':'Birmingham','B20':'Birmingham',
  'LS1':'Leeds','LS2':'Leeds','LS3':'Leeds','LS4':'Leeds','LS5':'Leeds','LS6':'Leeds','LS7':'Leeds','LS8':'Leeds','LS9':'Leeds','LS10':'Leeds','LS11':'Leeds','LS12':'Leeds','LS13':'Leeds','LS14':'Leeds','LS15':'Leeds','LS16':'Leeds','LS17':'Leeds','LS18':'Leeds','LS19':'Leeds','LS27':'Leeds','LS28':'Leeds',
  'BS1':'Bristol','BS2':'Bristol','BS3':'Bristol','BS4':'Bristol','BS5':'Bristol','BS6':'Bristol','BS7':'Bristol','BS8':'Bristol','BS9':'Bristol','BS10':'Bristol','BS11':'Bristol','BS13':'Bristol','BS14':'Bristol','BS15':'Bristol','BS16':'Bristol',
  'EH1':'Edinburgh','EH2':'Edinburgh','EH3':'Edinburgh','EH4':'Edinburgh','EH5':'Edinburgh','EH6':'Edinburgh','EH7':'Edinburgh','EH8':'Edinburgh','EH9':'Edinburgh','EH10':'Edinburgh','EH11':'Edinburgh','EH12':'Edinburgh',
  'CV1':'Coventry','CV2':'Coventry','CV3':'Coventry','CV4':'Coventry','CV5':'Coventry','CV6':'Coventry','CV7':'Coventry','CV8':'Coventry',
  'S1':'Sheffield','S2':'Sheffield','S3':'Sheffield','S4':'Sheffield','S5':'Sheffield','S6':'Sheffield','S7':'Sheffield','S8':'Sheffield','S9':'Sheffield','S10':'Sheffield','S11':'Sheffield',
  'NE1':'Newcastle','NE2':'Newcastle','NE3':'Newcastle','NE4':'Newcastle','NE5':'Newcastle','NE6':'Newcastle',
  'G1':'Glasgow','G2':'Glasgow','G3':'Glasgow','G4':'Glasgow','G11':'Glasgow','G12':'Glasgow','G13':'Glasgow',
  'NG':'Nottingham','LE':'Leicester','DE':'Derby','ST':'Stoke','WV':'Wolverhampton',
  'OX':'Oxford','CB':'Cambridge','RG':'Reading','MK':'Milton Keynes','LU':'Luton',
  'CF':'Cardiff','NP':'Newport','SA':'Swansea',
  'YO':'York','HU':'Hull','BD':'Bradford','HD':'Huddersfield','WF':'Wakefield','DN':'Doncaster',
  'SK':'Stockport','WA':'Warrington','CH':'Chester','PR':'Preston','BL':'Bolton','OL':'Oldham','WN':'Wigan',
  'SO':'Southampton','PO':'Portsmouth','BN':'Brighton','GU':'Guildford','SL':'Slough','KT':'Kingston',
  'CM':'Chelmsford','SS':'Southend','CO':'Colchester','IP':'Ipswich','NR':'Norwich','PE':'Peterborough',
  'GL':'Gloucester','BA':'Bath','SN':'Swindon','AB':'Aberdeen','DD':'Dundee',
};

const KNOWN_CITIES = ['London','Manchester','Birmingham','Leeds','Bristol','Edinburgh','Coventry','Oxford','Cambridge','Reading','Sheffield','Newcastle','Nottingham','Leicester','Brighton','Southampton','Portsmouth','Cardiff','Glasgow','Liverpool','York','Bath','Warwick','Wolverhampton','Derby','Stoke','Milton Keynes'];

function mapToCity(raw) {
  if (!raw) return null;
  const p = raw.trim();
  const found = KNOWN_CITIES.find(c => p.toLowerCase().includes(c.toLowerCase()));
  if (found) return found;
  const u = p.toUpperCase().replace(/\s/g,'');
  const m3 = u.match(/^([A-Z]{1,2}\d{1,2})/);
  if (m3 && cityMap[m3[1]]) return cityMap[m3[1]];
  const m2 = u.match(/^([A-Z]{1,2}\d)/);
  if (m2 && cityMap[m2[1]]) return cityMap[m2[1]];
  const m1 = u.match(/^([A-Z]{1,2})/);
  if (m1 && cityMap[m1[1]]) return cityMap[m1[1]];
  return null;
}

function query(sql) {
  try {
    const cmd = `sqlcmd -S .\\SQLEXPRESS -d UKJobDashboard -U udayadmin -P "Admin1234!" -Q "${sql}" -C -W -s "|"`;
    const out = execSync(cmd, { encoding: 'utf8' });
    return out.split('\n').map(l => l.trim()).filter(l => l && !l.match(/^-+$/) && !l.includes('rows affected') && !l.includes('Changed database'));
  } catch(e) { throw e.stderr || e.message; }
}

function toNum(v) {
  if (!v || v.trim() === '' || v.trim() === 'NULL') return null;
  const n = Number(v.trim());
  return isNaN(n) ? v.trim() : n;
}

function parseRows(lines, headers) {
  return lines.slice(2).filter(l => l).map(line => {
    const vals = line.split('|');
    const obj = {};
    headers.forEach((h, i) => { obj[h] = toNum(vals[i]); });
    return obj;
  });
}

app.get('/api/kpis', (req, res) => {
  try {
    const lines = query("SELECT COUNT(*) as total_jobs, AVG(salary_avg) as avg_salary, COUNT(DISTINCT location) as total_cities, COUNT(DISTINCT search_term) as total_roles FROM jobs WHERE is_active = 1");
    res.json(parseRows(lines, ['total_jobs','avg_salary','total_cities','total_roles'])[0] || {});
  } catch(e) { res.status(500).json({ error: String(e) }); }
});

app.get('/api/roles', (req, res) => {
  try {
    const lines = query("SELECT search_term, COUNT(*) as job_count, AVG(salary_avg) as avg_salary FROM jobs WHERE is_active=1 GROUP BY search_term ORDER BY COUNT(*) DESC");
    res.json(parseRows(lines, ['role','job_count','avg_salary']));
  } catch(e) { res.status(500).json({ error: String(e) }); }
});

app.get('/api/skills', (req, res) => {
  try {
    const lines = query("SELECT TOP 12 skill, COUNT(*) as mention_count FROM job_skills GROUP BY skill ORDER BY COUNT(*) DESC");
    res.json(parseRows(lines, ['skill','mention_count']));
  } catch(e) { res.status(500).json({ error: String(e) }); }
});

app.get('/api/cities', (req, res) => {
  try {
    const lines = query("SELECT location, COUNT(*) as job_count, AVG(salary_avg) as avg_salary FROM jobs WHERE is_active=1 AND location IS NOT NULL GROUP BY location ORDER BY COUNT(*) DESC");
    const raw = parseRows(lines, ['city','job_count','avg_salary']);
    const mapped = {};
    raw.forEach(r => {
      const city = mapToCity(String(r.city));
      if (!city) return;
      if (!mapped[city]) mapped[city] = { city, job_count: 0, sum: 0, cnt: 0 };
      mapped[city].job_count += Number(r.job_count) || 0;
      if (r.avg_salary) { mapped[city].sum += Number(r.avg_salary); mapped[city].cnt++; }
    });
    const result = Object.values(mapped)
      .map(c => ({ city: c.city, job_count: c.job_count, avg_salary: c.cnt > 0 ? Math.round(c.sum / c.cnt) : null }))
      .sort((a,b) => b.job_count - a.job_count).slice(0, 15);
    res.json(result);
  } catch(e) { res.status(500).json({ error: String(e) }); }
});

app.get('/api/salaries', (req, res) => {
  try {
    const lines = query("SELECT search_term, AVG(salary_avg) as avg_salary, MIN(salary_min) as min_salary, MAX(salary_max) as max_salary, COUNT(*) as job_count FROM jobs WHERE is_active=1 AND salary_avg IS NOT NULL GROUP BY search_term ORDER BY AVG(salary_avg) DESC");
    res.json(parseRows(lines, ['role','avg_salary','min_salary','max_salary','job_count']));
  } catch(e) { res.status(500).json({ error: String(e) }); }
});

app.get('/api/trend', (req, res) => {
  try {
    const lines = query("SELECT CAST(posted_date AS DATE) as date, COUNT(*) as job_count FROM jobs WHERE is_active=1 AND posted_date IS NOT NULL GROUP BY CAST(posted_date AS DATE) ORDER BY CAST(posted_date AS DATE) DESC");
    res.json(parseRows(lines, ['date','job_count']));
  } catch(e) { res.status(500).json({ error: String(e) }); }
});

app.get('/api/employers', (req, res) => {
  try {
    const lines = query("SELECT TOP 15 employer, COUNT(*) as job_count, AVG(salary_avg) as avg_salary FROM jobs WHERE is_active=1 AND employer IS NOT NULL AND employer != '' GROUP BY employer ORDER BY COUNT(*) DESC");
    res.json(parseRows(lines, ['employer','job_count','avg_salary']));
  } catch(e) { res.status(500).json({ error: String(e) }); }
});

app.get('/api/salary-distribution', (req, res) => {
  try {
    const lines = query("SELECT search_term as role, salary_min, salary_max, salary_avg FROM jobs WHERE is_active=1 AND salary_avg IS NOT NULL AND salary_avg > 10000 AND salary_avg < 200000 ORDER BY search_term");
    const rows = parseRows(lines, ['role','min','max','avg']);
    const grouped = {};
    rows.forEach(r => {
      if (!r.role) return;
      if (!grouped[r.role]) grouped[r.role] = [];
      grouped[r.role].push({ min: r.min, max: r.max, avg: r.avg });
    });
    const result = Object.entries(grouped).map(([role, vals]) => {
      const avgs = vals.map(v => v.avg).filter(Boolean).sort((a,b) => a-b);
      const n = avgs.length;
      return {
        role,
        count: n,
        min: Math.round(Math.min(...avgs)),
        max: Math.round(Math.max(...avgs)),
        avg: Math.round(avgs.reduce((a,b) => a+b, 0) / n),
        q1: Math.round(avgs[Math.floor(n*0.25)]),
        median: Math.round(avgs[Math.floor(n*0.5)]),
        q3: Math.round(avgs[Math.floor(n*0.75)]),
      };
    }).sort((a,b) => b.median - a.median);
    res.json(result);
  } catch(e) { res.status(500).json({ error: String(e) }); }
});

app.get('/api/jobs', (req, res) => {
  try {
    const role = (req.query.role || '').replace(/'/g,"''");
    const city = (req.query.city || '').replace(/'/g,"''");
    let q = "SELECT TOP 20 title, employer, location, search_term, salary_avg, CAST(posted_date AS DATE) as posted_date, url FROM jobs WHERE is_active=1";
    if (role && role !== 'all') q += ` AND search_term='${role}'`;
    q += " ORDER BY posted_date DESC";
    const lines = query(q);
    const rows = parseRows(lines, ['title','employer','location','role','salary_avg','posted_date','url']);
    rows.forEach(r => { if (r.location) r.location = mapToCity(String(r.location)) || r.location; });
    res.json(rows);
  } catch(e) { res.status(500).json({ error: String(e) }); }
});

app.listen(3001, () => console.log('API running on http://localhost:3001'));
