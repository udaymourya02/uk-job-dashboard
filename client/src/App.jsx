import { useState } from "react";
import "./App.css";

const COLORS = ["#7F77DD","#1D9E75","#378ADD","#EF9F27","#D4537E","#D85A30","#9FE1CB","#FAC775","#B5D4F4","#F5C4B3","#AFA9EC","#5DCAA5"];
const MY_SKILLS = ["SQL","Power BI","Python","Excel","DAX","ETL","Agile","Git","React","Node.js","TypeScript","Azure","Tableau","VBA","SSIS","MongoDB","Docker"];

const DATA = {
  kpis: { total_jobs: 1726, avg_salary: 41230, total_roles: 8, total_cities: 47 },
  roles: [
    { role:"Data Analyst", job_count:400, avg_salary:48000 },
    { role:"Business Intelligence Analyst", job_count:290, avg_salary:52000 },
    { role:"SQL Developer", job_count:282, avg_salary:44000 },
    { role:"Business Analyst", job_count:275, avg_salary:40000 },
    { role:"Python Developer", job_count:226, avg_salary:46000 },
    { role:"BI Developer", job_count:119, avg_salary:58000 },
    { role:"Full Stack Developer", job_count:71, avg_salary:42000 },
    { role:"Junior Data Analyst", job_count:63, avg_salary:28000 },
  ],
  skills: [
    { skill:"R", mention_count:1726 },{ skill:"Git", mention_count:182 },
    { skill:"Azure", mention_count:149 },{ skill:"SSIS", mention_count:141 },
    { skill:"Agile", mention_count:96 },{ skill:"Excel", mention_count:80 },
    { skill:"SQL", mention_count:77 },{ skill:"Python", mention_count:69 },
    { skill:"React", mention_count:62 },{ skill:"TypeScript", mention_count:53 },
    { skill:"Power BI", mention_count:38 },{ skill:"AWS", mention_count:35 },
  ],
  cities: [
    { city:"London", job_count:577, avg_salary:54000 },
    { city:"Manchester", job_count:228, avg_salary:42000 },
    { city:"Birmingham", job_count:187, avg_salary:41000 },
    { city:"Leeds", job_count:156, avg_salary:40000 },
    { city:"Bristol", job_count:98, avg_salary:44000 },
    { city:"Edinburgh", job_count:76, avg_salary:43000 },
    { city:"Coventry", job_count:54, avg_salary:38000 },
    { city:"Sheffield", job_count:48, avg_salary:39000 },
  ],
  salaries: [
    { role:"BI Developer", avg_salary:58000, min_salary:35000, max_salary:90000, q1:45000, median:55000, q3:70000 },
    { role:"Business Intelligence Analyst", avg_salary:52000, min_salary:32000, max_salary:85000, q1:42000, median:50000, q3:65000 },
    { role:"Data Analyst", avg_salary:48000, min_salary:28000, max_salary:80000, q1:38000, median:46000, q3:60000 },
    { role:"Python Developer", avg_salary:46000, min_salary:30000, max_salary:75000, q1:36000, median:44000, q3:58000 },
    { role:"SQL Developer", avg_salary:44000, min_salary:28000, max_salary:72000, q1:35000, median:42000, q3:56000 },
    { role:"Business Analyst", avg_salary:40000, min_salary:25000, max_salary:68000, q1:32000, median:38000, q3:52000 },
    { role:"Full Stack Developer", avg_salary:42000, min_salary:26000, max_salary:70000, q1:33000, median:40000, q3:54000 },
    { role:"Junior Data Analyst", avg_salary:28000, min_salary:20000, max_salary:42000, q1:23000, median:27000, q3:34000 },
  ],
  trend: Array.from({length:30},(_,i)=>({ date:`2026-04-${String(i+1).padStart(2,'0')}`, job_count: Math.round(40+Math.random()*60+i*2) })),
  employers: [
    { employer:"Deloitte", job_count:28, avg_salary:58000 },
    { employer:"KPMG", job_count:24, avg_salary:56000 },
    { employer:"PwC", job_count:22, avg_salary:55000 },
    { employer:"NHS Digital", job_count:19, avg_salary:45000 },
    { employer:"Accenture", job_count:18, avg_salary:54000 },
    { employer:"Amazon", job_count:16, avg_salary:62000 },
    { employer:"HSBC", job_count:15, avg_salary:52000 },
    { employer:"Lloyds Banking Group", job_count:14, avg_salary:48000 },
    { employer:"Sky", job_count:13, avg_salary:50000 },
    { employer:"BT Group", job_count:12, avg_salary:47000 },
    { employer:"Barclays", job_count:11, avg_salary:51000 },
    { employer:"Vodafone", job_count:10, avg_salary:49000 },
  ],
  jobs: [
    { title:"Senior Data Analyst", employer:"Deloitte", location:"London", role:"Data Analyst", salary_avg:58000, posted_date:"2026-05-20", url:"#" },
    { title:"BI Developer", employer:"KPMG", location:"Manchester", role:"BI Developer", salary_avg:65000, posted_date:"2026-05-19", url:"#" },
    { title:"SQL Developer", employer:"NHS Digital", location:"Leeds", role:"SQL Developer", salary_avg:42000, posted_date:"2026-05-19", url:"#" },
    { title:"Business Analyst", employer:"PwC", location:"London", role:"Business Analyst", salary_avg:52000, posted_date:"2026-05-18", url:"#" },
    { title:"Python Developer", employer:"Amazon", location:"London", role:"Python Developer", salary_avg:72000, posted_date:"2026-05-18", url:"#" },
    { title:"Junior Data Analyst", employer:"Barclays", location:"Birmingham", role:"Junior Data Analyst", salary_avg:28000, posted_date:"2026-05-17", url:"#" },
    { title:"Data Analyst", employer:"Sky", location:"Bristol", role:"Data Analyst", salary_avg:45000, posted_date:"2026-05-17", url:"#" },
    { title:"BI Analyst", employer:"HSBC", location:"London", role:"Business Intelligence Analyst", salary_avg:55000, posted_date:"2026-05-16", url:"#" },
  ],
};

function SalaryPredictor() {
  const [selRole, setSelRole] = useState("");
  const [selCity, setSelCity] = useState("London");
  const [exp, setExp] = useState(2);
  const [mySkills, setMySkills] = useState(["SQL","Python","Power BI"]);
  const cityMult = { London:1.18, Manchester:0.98, Birmingham:0.96, Leeds:0.94, Bristol:1.02, Edinburgh:1.0, Coventry:0.91, Sheffield:0.93 };
  const base = DATA.salaries.find(s=>s.role===selRole)?.avg_salary || 40000;
  const predicted = selRole ? Math.round(base*(cityMult[selCity]||1)*(1+exp*0.04)*(1+mySkills.length*0.015)) : null;
  const toggleSkill = s => setMySkills(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  return (
    <div className="feature-card">
      <div className="feature-title">Salary predictor</div>
      <div className="feature-sub">Select your role, city and experience to estimate your market value</div>
      <div className="pred-grid">
        <div className="pred-col">
          <div className="pred-label">Target role</div>
          <select className="pred-select" value={selRole} onChange={e=>setSelRole(e.target.value)}>
            <option value="">Select role...</option>
            {DATA.salaries.map(s=><option key={s.role} value={s.role}>{s.role}</option>)}
          </select>
          <div className="pred-label" style={{marginTop:12}}>City</div>
          <select className="pred-select" value={selCity} onChange={e=>setSelCity(e.target.value)}>
            {Object.keys(cityMult).map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <div className="pred-label" style={{marginTop:12}}>Years of experience: <span style={{color:"#7F77DD"}}>{exp}</span></div>
          <input type="range" min={0} max={15} step={1} value={exp} onChange={e=>setExp(Number(e.target.value))} style={{width:"100%",marginTop:6}}/>
        </div>
        <div className="pred-col">
          <div className="pred-label">Your skills</div>
          <div className="skill-toggle-grid">
            {MY_SKILLS.map(s=><div key={s} className={`skill-toggle${mySkills.includes(s)?" on":""}`} onClick={()=>toggleSkill(s)}>{s}</div>)}
          </div>
        </div>
      </div>
      {predicted && (
        <div className="pred-result">
          <div className="pred-result-label">Estimated market salary</div>
          <div className="pred-result-val">£{Math.round(predicted/1000)}k – £{Math.round(predicted*1.12/1000)}k</div>
          <div className="pred-result-sub">Based on {DATA.salaries.find(s=>s.role===selRole)?.job_count||0} live listings · {selCity} · {exp}yr exp · {mySkills.length} skills</div>
          <div className="pred-breakdown">
            <div className="pb-item"><div className="pb-label">Base avg</div><div className="pb-val">£{Math.round(base/1000)}k</div></div>
            <div className="pb-arrow">→</div>
            <div className="pb-item"><div className="pb-label">City</div><div className="pb-val" style={{color:(cityMult[selCity]||1)>=1?"#1D9E75":"#D85A30"}}>{((cityMult[selCity]||1)-1>=0?"+":"")+Math.round(((cityMult[selCity]||1)-1)*100)}%</div></div>
            <div className="pb-arrow">→</div>
            <div className="pb-item"><div className="pb-label">Experience</div><div className="pb-val" style={{color:"#1D9E75"}}>+{exp*4}%</div></div>
            <div className="pb-arrow">→</div>
            <div className="pb-item"><div className="pb-label">Skills</div><div className="pb-val" style={{color:"#1D9E75"}}>+{Math.round(mySkills.length*1.5)}%</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkillGapAnalyser() {
  const [selRole, setSelRole] = useState("Data Analyst");
  const roleSkillMap = {
    "Data Analyst":["SQL","Python","Excel","Power BI","Tableau","Agile","Azure","Git"],
    "Business Intelligence Analyst":["SQL","Power BI","DAX","Excel","SSIS","Azure","Agile","Git"],
    "SQL Developer":["SQL","SSIS","Azure","Git","ETL","Python","VBA","Excel"],
    "Business Analyst":["Agile","SQL","Excel","Tableau","Python","Azure","Git","SSIS"],
    "Python Developer":["Python","Git","SQL","Docker","Azure","React","TypeScript","MongoDB"],
    "BI Developer":["SQL","Power BI","DAX","SSIS","Azure","Python","ETL","Git"],
    "Full Stack Developer":["React","Node.js","TypeScript","SQL","Git","Docker","MongoDB","Azure"],
    "Junior Data Analyst":["SQL","Excel","Python","Power BI","Agile","Tableau","Git","Azure"],
  };
  const required = roleSkillMap[selRole]||[];
  const have = MY_SKILLS.filter(s=>required.includes(s));
  const missing = required.filter(s=>!MY_SKILLS.includes(s));
  const score = Math.round((have.length/required.length)*100);
  return (
    <div className="feature-card">
      <div className="feature-title">Skill gap analyser</div>
      <div className="feature-sub">See how your skills match against live job requirements</div>
      <select className="pred-select" style={{marginBottom:16}} value={selRole} onChange={e=>setSelRole(e.target.value)}>
        {Object.keys(roleSkillMap).map(r=><option key={r} value={r}>{r}</option>)}
      </select>
      <div className="gap-score-row">
        <div className="gap-score-circle" style={{borderColor:score>=80?"#1D9E75":score>=50?"#EF9F27":"#D85A30"}}>
          <div className="gap-score-num" style={{color:score>=80?"#1D9E75":score>=50?"#EF9F27":"#D85A30"}}>{score}%</div>
          <div className="gap-score-label">match</div>
        </div>
        <div className="gap-score-detail">
          <div style={{marginBottom:10}}>
            <div className="gap-section-title" style={{color:"#1D9E75"}}>Skills you have ({have.length})</div>
            <div className="gap-pills">{have.map(s=><span key={s} className="gap-pill have">{s}</span>)}</div>
          </div>
          <div>
            <div className="gap-section-title" style={{color:"#D85A30"}}>Skills to develop ({missing.length})</div>
            <div className="gap-pills">{missing.length?missing.map(s=><span key={s} className="gap-pill miss">{s}</span>):<span style={{fontSize:11,color:"#1D9E75"}}>You have all required skills!</span>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobMatchScore() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  function analyse() {
    if (!jd.trim()) return;
    const text = jd.toUpperCase();
    const allSkills = ["SQL","PYTHON","POWER BI","EXCEL","TABLEAU","AZURE","AWS","GIT","DOCKER","REACT","NODE","TYPESCRIPT","AGILE","SCRUM","ETL","SSIS","DAX","VBA","MONGODB","SNOWFLAKE","JIRA","CONFLUENCE","SPARK","DATABRICKS","MACHINE LEARNING","STATISTICS","FORECASTING"];
    const found = allSkills.filter(s=>text.includes(s));
    const myFound = found.filter(s=>MY_SKILLS.map(x=>x.toUpperCase()).some(m=>s.includes(m)||m.includes(s)));
    const score = found.length?Math.round((myFound.length/found.length)*100):0;
    setResult({ score, found, myFound, missing:found.filter(s=>!myFound.includes(s)) });
  }
  return (
    <div className="feature-card">
      <div className="feature-title">Job match score</div>
      <div className="feature-sub">Paste a job description to see how well your skills match</div>
      <textarea className="jd-input" placeholder="Paste job description here..." value={jd} onChange={e=>setJd(e.target.value)}/>
      <button className="analyse-btn" onClick={analyse}>Analyse match →</button>
      {result && (
        <div className="match-result">
          <div className="match-score-row">
            <div className="match-score-circle" style={{borderColor:result.score>=70?"#1D9E75":result.score>=40?"#EF9F27":"#D85A30"}}>
              <div className="match-score-num" style={{color:result.score>=70?"#1D9E75":result.score>=40?"#EF9F27":"#D85A30"}}>{result.score}%</div>
              <div style={{fontSize:10,color:"#6B7280"}}>match</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:"#1D9E75",marginBottom:4}}>You have ({result.myFound.length})</div>
              <div className="gap-pills" style={{marginBottom:8}}>{result.myFound.map(s=><span key={s} className="gap-pill have">{s}</span>)}</div>
              <div style={{fontSize:11,color:"#D85A30",marginBottom:4}}>To develop ({result.missing.length})</div>
              <div className="gap-pills">{result.missing.map(s=><span key={s} className="gap-pill miss">{s}</span>)}</div>
            </div>
          </div>
          <div className="match-advice" style={{borderLeftColor:result.score>=70?"#1D9E75":result.score>=40?"#EF9F27":"#D85A30"}}>
            {result.score>=70?"Strong match — tailor your CV to highlight these skills.":result.score>=40?"Moderate match — consider upskilling in the missing areas.":"Low match — use this as your learning roadmap."}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("dashboard");
  const [theme, setTheme] = useState("dark");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const maxRole = Math.max(...DATA.roles.map(r=>r.job_count));
  const maxCity = Math.max(...DATA.cities.map(c=>c.job_count));
  const maxSal = Math.max(...DATA.salaries.map(s=>s.avg_salary));
  const maxEmp = Math.max(...DATA.employers.map(e=>e.job_count));
  const filteredJobs = DATA.jobs.filter(j=>(selectedRole==="all"||j.role===selectedRole)&&(selectedCity==="all"||j.location===selectedCity));
  const trendMax = Math.max(...DATA.trend.map(d=>d.job_count));
  const trendPts = DATA.trend.map((d,i)=>`${Math.round((i/(DATA.trend.length-1))*100)},${Math.round(90-(d.job_count/trendMax)*80)}`).join(" ");
  const growthRate = ((DATA.trend.slice(-5).reduce((a,b)=>a+b.job_count,0)/5)-(DATA.trend.slice(0,5).reduce((a,b)=>a+b.job_count,0)/5))/(DATA.trend.slice(0,5).reduce((a,b)=>a+b.job_count,0)/5);
  const forecast = [1,2,3,4].map(w=>Math.round((DATA.trend.slice(-5).reduce((a,b)=>a+b.job_count,0)/5)*(1+growthRate*w*0.5)));
  const absMax = Math.max(...DATA.salaries.map(d=>d.max_salary));

  return (
    <div className={`app theme-${theme}`}>
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">UK Job Market Intelligence</h1>
          <p className="header-sub">1,726 listings · 8 roles · 47 locations · Built by Uday Mourya · MSc Business Analytics, Warwick</p>
        </div>
        <div className="header-right">
          {["dashboard","analytics","tools","about"].map(v=><button key={v} className={`nav-btn${view===v?" active":""}`} onClick={()=>setView(v)}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>)}
          <button className="nav-btn" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>{theme==="dark"?"☀":"☾"}</button>
          <div className="live-badge">● Live data</div>
        </div>
      </header>

      {view==="dashboard" && <>
        <div className="filter-bar">
          <span className="filter-label">Filters:</span>
          {selectedRole!=="all"&&<span className="filter-chip" onClick={()=>setSelectedRole("all")}>{selectedRole} ×</span>}
          {selectedCity!=="all"&&<span className="filter-chip" onClick={()=>setSelectedCity("all")}>{selectedCity} ×</span>}
          {selectedRole==="all"&&selectedCity==="all"&&<span style={{fontSize:11,color:"#6B7280"}}>Click any role or city to filter</span>}
        </div>
        <div className="kpi-row">
          <div className="kpi-card"><div className="kpi-label">Total listings</div><div className="kpi-value" style={{color:"#7F77DD"}}>1,726</div><div className="kpi-sub">UK job market</div></div>
          <div className="kpi-card"><div className="kpi-label">Avg salary</div><div className="kpi-value" style={{color:"#1D9E75"}}>£41.2k</div><div className="kpi-sub">across all roles</div></div>
          <div className="kpi-card"><div className="kpi-label">Roles tracked</div><div className="kpi-value" style={{color:"#378ADD"}}>8</div><div className="kpi-sub">data & tech roles</div></div>
          <div className="kpi-card"><div className="kpi-label">Cities tracked</div><div className="kpi-value" style={{color:"#EF9F27"}}>47</div><div className="kpi-sub">UK wide coverage</div></div>
        </div>
        <div className="grid-2">
          <div className="chart-card">
            <div className="chart-title">Role demand — click to filter</div>
            {DATA.roles.map((r,i)=>(
              <div key={i} className={`bar-row${selectedRole===r.role?" sel":""}`} onClick={()=>setSelectedRole(p=>p===r.role?"all":r.role)} style={{cursor:"pointer"}}>
                <div className="bar-label">{r.role}</div>
                <div className="bar-track"><div className="bar-fill" style={{width:`${Math.round((r.job_count/maxRole)*100)}%`,background:COLORS[i%COLORS.length]}}/></div>
                <div className="bar-count">{r.job_count}</div>
              </div>
            ))}
          </div>
          <div className="chart-card">
            <div className="chart-title">Top skills in demand</div>
            <div className="skills-grid">
              {DATA.skills.map((d,i)=><div key={i} className="skill-pill"><span className="skill-name">{d.skill}</span><span className="skill-count" style={{color:COLORS[i%COLORS.length]}}>{d.mention_count}</span></div>)}
            </div>
          </div>
        </div>
        <div className="grid-3">
          <div className="chart-card">
            <div className="chart-title">Jobs by city — click to filter</div>
            {DATA.cities.map((d,i)=>(
              <div key={i} className={`city-row${selectedCity===d.city?" sel":""}`} onClick={()=>setSelectedCity(p=>p===d.city?"all":d.city)} style={{cursor:"pointer",marginBottom:8,display:"flex",alignItems:"center",gap:8,padding:"4px 6px",borderRadius:6,transition:"background 0.15s"}}>
                <div style={{width:`${Math.max(8,Math.round((d.job_count/maxCity)*20))}px`,height:`${Math.max(8,Math.round((d.job_count/maxCity)*20))}px`,borderRadius:"50%",background:COLORS[i%COLORS.length],flexShrink:0}}/>
                <div style={{fontSize:11,color:"#9CA3AF",width:90,flexShrink:0}}>{d.city}</div>
                <div style={{flex:1,height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:COLORS[i%COLORS.length],width:`${Math.round((d.job_count/maxCity)*100)}%`,transition:"width 0.6s"}}/></div>
                <div style={{fontSize:11,fontWeight:500,color:"var(--txt)",width:30,textAlign:"right",flexShrink:0}}>{d.job_count}</div>
                <div style={{fontSize:10,color:"#1D9E75",width:44,textAlign:"right",flexShrink:0}}>£{Math.round(d.avg_salary/1000)}k</div>
              </div>
            ))}
          </div>
          <div className="chart-card">
            <div className="chart-title">Avg salary by role</div>
            {DATA.salaries.map((d,i)=>(
              <div key={i} className="salary-row">
                <div className="salary-left"><div className="salary-role">{d.role}</div><div className="salary-bar-track"><div className="salary-bar-fill" style={{width:`${Math.round((d.avg_salary/maxSal)*100)}%`,background:COLORS[i%COLORS.length]}}/></div></div>
                <div className="salary-val">£{Math.round(d.avg_salary/1000)}k</div>
              </div>
            ))}
          </div>
          <div className="chart-card">
            <div className="chart-title">Posting trend — 30 days</div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:"100%",height:"100px",display:"block"}}>
              <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7F77DD" stopOpacity="0.3"/><stop offset="100%" stopColor="#7F77DD" stopOpacity="0"/></linearGradient></defs>
              <polyline points={trendPts} fill="none" stroke="#7F77DD" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
              <polygon points={`0,100 ${trendPts} 100,100`} fill="url(#tg)"/>
            </svg>
            <div className="trend-stats">
              <div className="trend-stat"><div className="ts-label">Trend</div><div className="ts-val" style={{color:growthRate>=0?"#1D9E75":"#D85A30"}}>{growthRate>=0?"+":""}{Math.round(growthRate*100)}%</div></div>
              <div className="trend-stat"><div className="ts-label">Outlook</div><div className="ts-val" style={{color:"#1D9E75"}}>{growthRate>0.05?"Growing":"Stable"}</div></div>
              <div className="trend-stat"><div className="ts-label">4wk forecast</div><div className="ts-val" style={{color:"#7F77DD"}}>{forecast[3]}/day</div></div>
            </div>
          </div>
        </div>
        <div className="chart-card full-width">
          <div className="chart-title">Live job listings {selectedRole!=="all"?`— ${selectedRole}`:""} {selectedCity!=="all"?`in ${selectedCity}`:""} <span style={{color:"#6B7280",fontWeight:400}}>({filteredJobs.length} shown)</span></div>
          <div className="jobs-table-wrap">
            <table className="jobs-table">
              <thead><tr><th>Title</th><th>Employer</th><th>City</th><th>Role</th><th>Salary</th><th>Posted</th></tr></thead>
              <tbody>{filteredJobs.map((j,i)=><tr key={i}><td><a href={j.url} className="job-link">{j.title}</a></td><td>{j.employer}</td><td>{j.location}</td><td><span className="role-badge">{j.role}</span></td><td>£{Math.round(j.salary_avg/1000)}k</td><td>{j.posted_date}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </>}

      {view==="analytics" && <div className="analytics-grid">
        <div className="feature-card">
          <div className="feature-title">Salary distribution by role</div>
          <div className="feature-sub">Box plots showing min, Q1, median, Q3 and max salary ranges</div>
          <div className="boxplot-list">
            {DATA.salaries.map((d,i)=>{
              const pct=v=>Math.round((v/absMax)*100);
              return <div key={i} className="boxplot-row">
                <div className="boxplot-label">{d.role.replace(" Developer","Dev").replace("Junior ","Jr ").replace(" Analyst","").replace("Business Intelligence","BI Intel.")}</div>
                <div className="boxplot-track">
                  <div className="boxplot-whisker-left" style={{left:`${pct(d.min_salary)}%`,width:`${pct(d.q1)-pct(d.min_salary)}%`}}/>
                  <div className="boxplot-box" style={{left:`${pct(d.q1)}%`,width:`${pct(d.q3)-pct(d.q1)}%`,background:COLORS[i%COLORS.length]+"33",borderColor:COLORS[i%COLORS.length]}}/>
                  <div className="boxplot-median" style={{left:`${pct(d.median)}%`,background:COLORS[i%COLORS.length]}}/>
                  <div className="boxplot-whisker-right" style={{left:`${pct(d.q3)}%`,width:`${pct(d.max_salary)-pct(d.q3)}%`}}/>
                </div>
                <div className="boxplot-vals">
                  <span style={{color:"#6B7280"}}>£{Math.round(d.min_salary/1000)}k</span>
                  <span style={{color:COLORS[i%COLORS.length],fontWeight:500}}>£{Math.round(d.median/1000)}k</span>
                  <span style={{color:"#6B7280"}}>£{Math.round(d.max_salary/1000)}k</span>
                </div>
              </div>;
            })}
          </div>
          <div className="boxplot-legend"><span>whisker = min/max</span><span>box = Q1–Q3</span><span>line = median</span></div>
        </div>
        <div className="feature-card">
          <div className="feature-title">Demand forecasting</div>
          <div className="feature-sub">Trend extrapolation based on 30-day posting velocity</div>
          <svg viewBox="0 0 280 100" width="100%" style={{display:"block",marginBottom:12}}>
            <line x1="233" y1="0" x2="233" y2="95" stroke="rgba(255,255,255,0.1)" strokeDasharray="3,2" strokeWidth="1"/>
            <text x="237" y="10" fill="#6B7280" fontSize="7">forecast →</text>
            <polyline points={trendPts.split(" ").map((p,i)=>{const[x,y]=p.split(",");return `${Math.round(Number(x)*2.33)},${y}`;}).join(" ")} fill="none" stroke="#7F77DD" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
            {forecast.map((v,i)=><circle key={i} cx={Math.round(233+i*16)} cy={Math.round(90-(v/trendMax)*80)} r="2.5" fill="#1D9E75"/>)}
            <polyline points={`233,${Math.round(90-(DATA.trend[DATA.trend.length-1].job_count/trendMax)*80)} ${forecast.map((v,i)=>`${Math.round(233+i*16)},${Math.round(90-(v/trendMax)*80)}`).join(" ")}`} fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeDasharray="4,2" vectorEffect="non-scaling-stroke"/>
            <line x1="0" y1="95" x2="280" y2="95" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
          </svg>
          <div className="forecast-stats">
            <div className="fc-item"><div className="fc-label">Current avg</div><div className="fc-val" style={{color:"#7F77DD"}}>{Math.round(DATA.trend.slice(-5).reduce((a,b)=>a+b.job_count,0)/5)}/day</div></div>
            <div className="fc-item"><div className="fc-label">30d trend</div><div className="fc-val" style={{color:growthRate>=0?"#1D9E75":"#D85A30"}}>{growthRate>=0?"+":""}{Math.round(growthRate*100)}%</div></div>
            <div className="fc-item"><div className="fc-label">4wk forecast</div><div className="fc-val" style={{color:"#1D9E75"}}>{forecast[3]}/day</div></div>
            <div className="fc-item"><div className="fc-label">Outlook</div><div className="fc-val" style={{color:"#1D9E75"}}>{growthRate>0.05?"Growing":"Stable"}</div></div>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-title">Top employers hiring now</div>
          <div className="feature-sub">Companies with most active listings in the dataset</div>
          <div className="employer-list">
            {DATA.employers.map((e,i)=>(
              <div key={i} className="employer-row">
                <div className="employer-rank" style={{color:COLORS[i%COLORS.length]}}>{i+1}</div>
                <div className="employer-info">
                  <div className="employer-name">{e.employer}</div>
                  <div className="employer-bar-track"><div className="employer-bar-fill" style={{width:`${Math.round((e.job_count/maxEmp)*100)}%`,background:COLORS[i%COLORS.length]}}/></div>
                </div>
                <div className="employer-count">{e.job_count} jobs</div>
                <div className="employer-salary" style={{color:"#1D9E75"}}>£{Math.round(e.avg_salary/1000)}k</div>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {view==="tools" && <div className="tools-grid"><SalaryPredictor/><SkillGapAnalyser/><JobMatchScore/></div>}

      {view==="about" && <div className="about-grid">
        <div className="about-profile">
          <div className="about-avatar">UM</div>
          <div className="about-name">Uday Mourya</div>
          <div className="about-title">MSc Business Analytics · University of Warwick</div>
          <div className="about-tags">
            <span className="about-tag">Data Analytics</span><span className="about-tag">Business Intelligence</span>
            <span className="about-tag">Full Stack</span><span className="about-tag">Business Analysis</span>
          </div>
          <div className="about-bio">Technically versatile professional combining software engineering, data analytics, BI, and full-stack development. Built this dashboard as a real-world demonstration of end-to-end data engineering.</div>
          <div className="about-links">
            <a href="https://www.linkedin.com/in/uday-mourya-1b0062230/?skipRedirect=true" target="_blank" rel="noopener noreferrer" className="about-link">LinkedIn →</a>
            <a href="https://github.com/udaymourya02" target="_blank" rel="noopener noreferrer" className="about-link">GitHub →</a>
          </div>
        </div>
        <div className="about-skills-section">
          <div className="about-section-title">Technical skills</div>
          {[
            { cat:"Data & BI", skills:["MS SQL","Power BI","DAX","ETL","SSIS","QlikSense","Tableau","Excel","VBA"], color:"#7F77DD" },
            { cat:"Programming", skills:["Python","JavaScript","TypeScript","Node.js","PHP","React","Next.js","HTML/CSS"], color:"#1D9E75" },
            { cat:"Databases", skills:["MySQL","MongoDB","MariaDB","Prisma","Snowflake"], color:"#378ADD" },
            { cat:"Methodology", skills:["Agile","Scrum","SDLC","BPMN","UAT","Stakeholder Mgmt"], color:"#EF9F27" },
          ].map((g,i)=>(
            <div key={i} className="about-skill-group">
              <div className="about-skill-cat" style={{color:g.color}}>{g.cat}</div>
              <div className="gap-pills">{g.skills.map(s=><span key={s} className="gap-pill" style={{background:g.color+"18",borderColor:g.color+"44",color:g.color}}>{s}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="about-project-card">
          <div className="about-section-title">This project — full pipeline</div>
          <div className="pipeline-steps">
            {[
              ["#7F77DD","Python scraper","Reed API · 9 roles · 8 cities · 1,726 jobs"],
              ["#1D9E75","ETL pipeline","Clean · validate · deduplicate · load to SQL"],
              ["#378ADD","MS SQL Server","Normalised schema · views · indexes · audit log"],
              ["#EF9F27","Node.js REST API","Express · 9 endpoints · real-time queries"],
              ["#D4537E","React dashboard","Custom charts · live filters · 4 analytics tools"],
            ].map(([color,name,detail],i)=>(
              <div key={i} className="pipeline-step">
                <div className="pipeline-dot" style={{background:color}}/>
                <div><div style={{fontSize:12,fontWeight:500,color}}>{name}</div><div style={{fontSize:11,color:"#6B7280"}}>{detail}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>}

      <footer className="footer">
        <p>Built by <span style={{color:"#7F77DD"}}>Uday Mourya</span> · MSc Business Analytics, University of Warwick · Python · MS SQL · Node.js · React · Power BI</p>
      </footer>
    </div>
  );
}
