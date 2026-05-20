import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:3001/api";
const COLORS = ["#7F77DD","#1D9E75","#378ADD","#EF9F27","#D4537E","#D85A30","#9FE1CB","#FAC775","#B5D4F4","#F5C4B3","#AFA9EC","#5DCAA5"];

const MY_SKILLS = ["SQL","Power BI","Python","Excel","DAX","ETL","Agile","Git","React","Node.js","TypeScript","Azure","Tableau","VBA","SSIS","MongoDB","Docker"];

function useFetch(endpoint) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!endpoint) return;
    fetch(`${API}/${endpoint}`).then(r => r.json()).then(setData).catch(() => {});
  }, [endpoint]);
  return data;
}

// ── SALARY PREDICTOR ─────────────────────────────────────────
function SalaryPredictor({ salaries, skills }) {
  const [selRole, setSelRole] = useState("");
  const [selCity, setSelCity] = useState("London");
  const [exp, setExp] = useState(2);
  const [mySkills, setMySkills] = useState(["SQL","Python","Power BI"]);

  const cityMultiplier = { London: 1.18, Manchester: 0.98, Birmingham: 0.96, Leeds: 0.94, Bristol: 1.02, Edinburgh: 1.0, Coventry: 0.91 };
  const expMultiplier = (y) => 1 + (y * 0.04);
  const skillBonus = (s) => s.length * 0.015;

  const base = salaries?.find(s => s.role === selRole)?.avg_salary || 40000;
  const predicted = selRole ? Math.round(base * (cityMultiplier[selCity] || 1) * expMultiplier(exp) * (1 + skillBonus(mySkills))) : null;

  const toggleSkill = (s) => setMySkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div className="feature-card">
      <div className="feature-title">Salary predictor</div>
      <div className="feature-sub">Select your role, city and experience to estimate your market value</div>
      <div className="pred-grid">
        <div className="pred-col">
          <div className="pred-label">Target role</div>
          <select className="pred-select" value={selRole} onChange={e => setSelRole(e.target.value)}>
            <option value="">Select role...</option>
            {salaries?.map(s => <option key={s.role} value={s.role}>{s.role}</option>)}
          </select>
          <div className="pred-label" style={{marginTop:12}}>City</div>
          <select className="pred-select" value={selCity} onChange={e => setSelCity(e.target.value)}>
            {Object.keys(cityMultiplier).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="pred-label" style={{marginTop:12}}>Years of experience: <span style={{color:"#7F77DD"}}>{exp}</span></div>
          <input type="range" min={0} max={15} step={1} value={exp} onChange={e => setExp(Number(e.target.value))} style={{width:"100%",marginTop:6}} />
        </div>
        <div className="pred-col">
          <div className="pred-label">Your skills (select all that apply)</div>
          <div className="skill-toggle-grid">
            {MY_SKILLS.map(s => (
              <div key={s} className={`skill-toggle${mySkills.includes(s) ? " on" : ""}`} onClick={() => toggleSkill(s)}>{s}</div>
            ))}
          </div>
        </div>
      </div>
      {predicted && (
        <div className="pred-result">
          <div className="pred-result-label">Estimated market salary</div>
          <div className="pred-result-val">£{Math.round(predicted/1000)}k – £{Math.round(predicted*1.12/1000)}k</div>
          <div className="pred-result-sub">Based on {salaries?.find(s=>s.role===selRole)?.job_count || 0} live listings · {selCity} market · {exp} years exp · {mySkills.length} skills matched</div>
          <div className="pred-breakdown">
            <div className="pb-item"><div className="pb-label">Base (market avg)</div><div className="pb-val">£{Math.round(base/1000)}k</div></div>
            <div className="pb-arrow">→</div>
            <div className="pb-item"><div className="pb-label">City adjustment</div><div className="pb-val" style={{color:(cityMultiplier[selCity]||1)>=1?"#1D9E75":"#D85A30"}}>{((cityMultiplier[selCity]||1)-1>=0?"+":"")+Math.round(((cityMultiplier[selCity]||1)-1)*100)}%</div></div>
            <div className="pb-arrow">→</div>
            <div className="pb-item"><div className="pb-label">Experience</div><div className="pb-val" style={{color:"#1D9E75"}}>+{Math.round(exp*4)}%</div></div>
            <div className="pb-arrow">→</div>
            <div className="pb-item"><div className="pb-label">Skills bonus</div><div className="pb-val" style={{color:"#1D9E75"}}>+{Math.round(skillBonus(mySkills)*100)}%</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SKILL GAP ANALYSER ───────────────────────────────────────
function SkillGapAnalyser({ skills }) {
  const [selRole, setSelRole] = useState("Data Analyst");
  const roleSkillMap = {
    "Data Analyst": ["SQL","Python","Excel","Power BI","Tableau","Agile","Azure","Git"],
    "Business Intelligence Analyst": ["SQL","Power BI","DAX","Excel","SSIS","SSRS","Azure","Agile"],
    "SQL Developer": ["SQL","SSIS","SSRS","Azure","Git","ETL","Python","VBA"],
    "Business Analyst": ["Agile","SQL","Excel","JIRA","Confluence","BPMN","Tableau","Python"],
    "Python Developer": ["Python","Git","SQL","Docker","Azure","React","TypeScript","MongoDB"],
    "BI Developer": ["SQL","Power BI","DAX","SSIS","Azure","Python","ETL","Git"],
    "Full Stack Developer": ["React","Node.js","TypeScript","SQL","Git","Docker","MongoDB","Azure"],
    "Junior Data Analyst": ["SQL","Excel","Python","Power BI","Agile","Tableau","Git","Azure"],
  };
  const required = roleSkillMap[selRole] || [];
  const have = MY_SKILLS.filter(s => required.includes(s));
  const missing = required.filter(s => !MY_SKILLS.includes(s));
  const score = Math.round((have.length / required.length) * 100);

  return (
    <div className="feature-card">
      <div className="feature-title">Skill gap analyser</div>
      <div className="feature-sub">See how your skills match against live job requirements</div>
      <select className="pred-select" style={{marginBottom:16}} value={selRole} onChange={e => setSelRole(e.target.value)}>
        {Object.keys(roleSkillMap).map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <div className="gap-score-row">
        <div className="gap-score-circle" style={{borderColor: score>=80?"#1D9E75":score>=50?"#EF9F27":"#D85A30"}}>
          <div className="gap-score-num" style={{color: score>=80?"#1D9E75":score>=50?"#EF9F27":"#D85A30"}}>{score}%</div>
          <div className="gap-score-label">match</div>
        </div>
        <div className="gap-score-detail">
          <div style={{marginBottom:12}}>
            <div className="gap-section-title" style={{color:"#1D9E75"}}>Skills you have ({have.length})</div>
            <div className="gap-pills">{have.map(s => <span key={s} className="gap-pill have">{s}</span>)}</div>
          </div>
          <div>
            <div className="gap-section-title" style={{color:"#D85A30"}}>Skills to develop ({missing.length})</div>
            <div className="gap-pills">{missing.length ? missing.map(s => <span key={s} className="gap-pill miss">{s}</span>) : <span style={{fontSize:11,color:"#1D9E75"}}>You have all required skills!</span>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SALARY DISTRIBUTION BOX PLOTS ───────────────────────────
function SalaryBoxPlots({ data }) {
  if (!data?.length) return <div className="empty">Loading distribution data...</div>;
  const absMax = Math.max(...data.map(d => d.max));
  return (
    <div className="feature-card">
      <div className="feature-title">Salary distribution by role</div>
      <div className="feature-sub">Box plots showing min, Q1, median, Q3 and max salary ranges</div>
      <div className="boxplot-list">
        {data.map((d, i) => {
          const pct = v => Math.round((v / absMax) * 100);
          return (
            <div key={i} className="boxplot-row">
              <div className="boxplot-label">{d.role?.replace(' Developer','Dev').replace('Junior ','Jr ')}</div>
              <div className="boxplot-track">
                <div className="boxplot-whisker-left" style={{left:`${pct(d.min)}%`,width:`${pct(d.q1)-pct(d.min)}%`}} />
                <div className="boxplot-box" style={{left:`${pct(d.q1)}%`,width:`${pct(d.q3)-pct(d.q1)}%`,background:COLORS[i%COLORS.length]+'33',borderColor:COLORS[i%COLORS.length]}} />
                <div className="boxplot-median" style={{left:`${pct(d.median)}%`,background:COLORS[i%COLORS.length]}} />
                <div className="boxplot-whisker-right" style={{left:`${pct(d.q3)}%`,width:`${pct(d.max)-pct(d.q3)}%`}} />
              </div>
              <div className="boxplot-vals">
                <span style={{color:"#6B7280"}}>£{Math.round(d.min/1000)}k</span>
                <span style={{color:COLORS[i%COLORS.length],fontWeight:500}}>£{Math.round(d.median/1000)}k</span>
                <span style={{color:"#6B7280"}}>£{Math.round(d.max/1000)}k</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="boxplot-legend">
        <span>whisker = min/max</span><span>box = Q1–Q3</span><span>line = median</span>
      </div>
    </div>
  );
}

// ── DEMAND FORECASTING ───────────────────────────────────────
function DemandForecast({ trend }) {
  if (!trend?.length) return <div className="empty">Loading trend data...</div>;
  const recent = [...trend].reverse().slice(-20);
  const n = recent.length;
  const avgLast5 = recent.slice(-5).reduce((a,b) => a+b.job_count,0)/5;
  const avgFirst5 = recent.slice(0,5).reduce((a,b) => a+b.job_count,0)/5;
  const growthRate = (avgLast5 - avgFirst5) / avgFirst5;
  const forecast = [1,2,3,4].map(w => Math.round(avgLast5 * (1 + growthRate * w * 0.5)));
  const max = Math.max(...recent.map(d=>d.job_count), ...forecast);
  const allPoints = [...recent.map(d=>d.job_count), ...forecast];

  const pathPoints = allPoints.map((v,i) => `${Math.round((i/(allPoints.length-1))*280)},${Math.round(90-(v/max)*80)}`).join(' ');
  const histPoints = recent.map((d,i) => `${Math.round((i/(allPoints.length-1))*280)},${Math.round(90-(d.job_count/max)*80)}`).join(' ');
  const forePoints = forecast.map((v,i) => `${Math.round(((n-1+i)/(allPoints.length-1))*280)},${Math.round(90-(v/max)*80)}`).join(' ');
  const splitX = Math.round(((n-1)/(allPoints.length-1))*280);

  return (
    <div className="feature-card">
      <div className="feature-title">Demand forecasting</div>
      <div className="feature-sub">Simple trend extrapolation based on recent posting velocity</div>
      <svg viewBox="0 0 280 100" width="100%" style={{display:"block",marginBottom:12}}>
        <line x1={splitX} y1="0" x2={splitX} y2="95" stroke="rgba(255,255,255,0.1)" strokeDasharray="3,2" strokeWidth="1"/>
        <text x={splitX+4} y="10" fill="#6B7280" fontSize="7">forecast →</text>
        <polyline points={histPoints} fill="none" stroke="#7F77DD" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
        <polyline points={`${splitX},${Math.round(90-(recent[recent.length-1].job_count/max)*80)} ${forePoints}`} fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeDasharray="4,2" vectorEffect="non-scaling-stroke"/>
        {forecast.map((v,i) => (
          <circle key={i} cx={Math.round(((n-1+i)/(allPoints.length-1))*280)} cy={Math.round(90-(v/max)*80)} r="2.5" fill="#1D9E75"/>
        ))}
        <line x1="0" y1="95" x2="280" y2="95" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
      </svg>
      <div className="forecast-stats">
        <div className="fc-item"><div className="fc-label">Current avg/day</div><div className="fc-val" style={{color:"#7F77DD"}}>{Math.round(avgLast5)}</div></div>
        <div className="fc-item"><div className="fc-label">Weekly trend</div><div className="fc-val" style={{color:growthRate>=0?"#1D9E75":"#D85A30"}}>{growthRate>=0?"+":""}{Math.round(growthRate*100)}%</div></div>
        <div className="fc-item"><div className="fc-label">4-week forecast</div><div className="fc-val" style={{color:"#1D9E75"}}>{forecast[3]} jobs/day</div></div>
        <div className="fc-item"><div className="fc-label">Outlook</div><div className="fc-val" style={{color:growthRate>=0?"#1D9E75":"#EF9F27"}}>{growthRate>0.05?"Strong growth":growthRate<-0.05?"Slowing":"Stable"}</div></div>
      </div>
    </div>
  );
}

// ── TOP EMPLOYERS ─────────────────────────────────────────────
function TopEmployers({ employers }) {
  if (!employers?.length) return <div className="empty">Loading employer data...</div>;
  const max = Math.max(...employers.map(e => e.job_count));
  return (
    <div className="feature-card">
      <div className="feature-title">Top employers hiring now</div>
      <div className="feature-sub">Companies with the most active job listings in the dataset</div>
      <div className="employer-list">
        {employers.map((e, i) => (
          <div key={i} className="employer-row">
            <div className="employer-rank" style={{color:COLORS[i%COLORS.length]}}>{i+1}</div>
            <div className="employer-info">
              <div className="employer-name">{e.employer}</div>
              <div className="employer-bar-track"><div className="employer-bar-fill" style={{width:`${Math.round((e.job_count/max)*100)}%`,background:COLORS[i%COLORS.length]}}/></div>
            </div>
            <div className="employer-count">{e.job_count} jobs</div>
            <div className="employer-salary" style={{color:"#1D9E75"}}>{e.avg_salary?`£${Math.round(e.avg_salary/1000)}k`:"—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── JOB MATCH SCORE ───────────────────────────────────────────
function JobMatchScore({ skills }) {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);

  function analyse() {
    if (!jd.trim()) return;
    const text = jd.toUpperCase();
    const allSkills = ["SQL","PYTHON","POWER BI","EXCEL","TABLEAU","AZURE","AWS","GIT","DOCKER","REACT","NODE","TYPESCRIPT","AGILE","SCRUM","ETL","SSIS","DAX","VBA","MONGODB","SNOWFLAKE","JIRA","CONFLUENCE","R ","JAVA","SPARK","DATABRICKS","MACHINE LEARNING","NLP","STATISTICS","FORECASTING","POWER AUTOMATE","QLIK","LOOKER","DOMO"];
    const found = allSkills.filter(s => text.includes(s));
    const myFound = found.filter(s => MY_SKILLS.map(x=>x.toUpperCase()).some(m => s.includes(m) || m.includes(s)));
    const score = found.length ? Math.round((myFound.length / found.length) * 100) : 0;
    setResult({ score, found: found.map(s=>s.trim()), myFound: myFound.map(s=>s.trim()), missing: found.filter(s=>!myFound.includes(s)).map(s=>s.trim()) });
  }

  return (
    <div className="feature-card">
      <div className="feature-title">Job match score</div>
      <div className="feature-sub">Paste a job description to see how well your skills match</div>
      <textarea className="jd-input" placeholder="Paste the full job description here..." value={jd} onChange={e => setJd(e.target.value)} />
      <button className="analyse-btn" onClick={analyse}>Analyse match →</button>
      {result && (
        <div className="match-result">
          <div className="match-score-row">
            <div className="match-score-circle" style={{borderColor:result.score>=70?"#1D9E75":result.score>=40?"#EF9F27":"#D85A30"}}>
              <div className="match-score-num" style={{color:result.score>=70?"#1D9E75":result.score>=40?"#EF9F27":"#D85A30"}}>{result.score}%</div>
              <div style={{fontSize:10,color:"#6B7280"}}>match</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:"#9CA3AF",marginBottom:8}}>Skills detected in this JD: {result.found.length}</div>
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,color:"#1D9E75",marginBottom:4}}>You have ({result.myFound.length})</div>
                <div className="gap-pills">{result.myFound.map(s=><span key={s} className="gap-pill have">{s}</span>)}</div>
              </div>
              <div>
                <div style={{fontSize:10,color:"#D85A30",marginBottom:4}}>To develop ({result.missing.length})</div>
                <div className="gap-pills">{result.missing.map(s=><span key={s} className="gap-pill miss">{s}</span>)}</div>
              </div>
            </div>
          </div>
          <div className="match-advice" style={{borderLeftColor:result.score>=70?"#1D9E75":result.score>=40?"#EF9F27":"#D85A30"}}>
            {result.score>=70?"Strong match — you meet most technical requirements. Tailor your CV to highlight these skills.":result.score>=40?"Moderate match — consider upskilling in the missing areas before applying.":"Low match — significant skill gaps exist. Use this as a learning roadmap."}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ABOUT ME ──────────────────────────────────────────────────
function AboutMe() {
  return (
    <div className="about-grid">
      <div className="about-profile">
        <div className="about-avatar">UM</div>
        <div className="about-name">Uday Mourya</div>
        <div className="about-title">MSc Business Analytics · University of Warwick</div>
        <div className="about-tags">
          <span className="about-tag">Data Analytics</span>
          <span className="about-tag">Business Intelligence</span>
          <span className="about-tag">Full Stack</span>
          <span className="about-tag">Business Analysis</span>
        </div>
        <div className="about-bio">Technically versatile professional with a rare combination of software engineering, data analytics, business intelligence, and full-stack development capabilities. Built this dashboard as a real-world demonstration of end-to-end data engineering and product thinking.</div>
        <div className="about-links">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="about-link">LinkedIn →</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="about-link">GitHub →</a>
        </div>
      </div>
      <div className="about-skills-section">
        <div className="about-section-title">Technical skills</div>
        {[
          { cat:"Data & BI", skills:["MS SQL","Power BI","DAX","ETL","SSIS","QlikSense","Tableau","Excel","VBA"], color:"#7F77DD" },
          { cat:"Programming", skills:["Python","JavaScript","TypeScript","Node.js","PHP","React","Next.js","HTML/CSS"], color:"#1D9E75" },
          { cat:"Databases", skills:["MySQL","MongoDB","MariaDB","Prisma","Snowflake"], color:"#378ADD" },
          { cat:"Methodology", skills:["Agile","Scrum","SDLC","BPMN","UAT","Stakeholder Mgmt"], color:"#EF9F27" },
        ].map((g,i) => (
          <div key={i} className="about-skill-group">
            <div className="about-skill-cat" style={{color:g.color}}>{g.cat}</div>
            <div className="gap-pills">{g.skills.map(s=><span key={s} className="gap-pill" style={{background:g.color+'18',borderColor:g.color+'44',color:g.color}}>{s}</span>)}</div>
          </div>
        ))}
      </div>
      <div className="about-project-card">
        <div className="about-section-title">This project — what I built</div>
        <div className="pipeline-steps">
          {[
            ["#7F77DD","Python scraper","Reed API · 9 roles · 8 cities · 1,700+ jobs"],
            ["#1D9E75","ETL pipeline","Clean · validate · deduplicate · load to SQL"],
            ["#378ADD","MS SQL Server","Normalised schema · views · indexes · audit log"],
            ["#EF9F27","Node.js REST API","Express · 9 endpoints · real-time queries"],
            ["#D4537E","React dashboard","Custom charts · live filters · analytics features"],
          ].map(([color,name,detail],i)=>(
            <div key={i} className="pipeline-step">
              <div className="pipeline-dot" style={{background:color}}/>
              <div><div style={{fontSize:12,fontWeight:500,color:color}}>{name}</div><div style={{fontSize:11,color:"#6B7280"}}>{detail}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("dashboard");
  const [theme, setTheme] = useState("dark");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  const kpis = useFetch("kpis");
  const allRoles = useFetch("roles");
  const skills = useFetch("skills");
  const allCities = useFetch("cities");
  const salaries = useFetch("salaries");
  const trend = useFetch("trend");
  const employers = useFetch("employers");
  const boxplots = useFetch("salary-distribution");
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedRole !== "all") params.set("role", selectedRole);
    if (selectedCity !== "all") params.set("city", selectedCity);
    fetch(`${API}/jobs?${params}`).then(r=>r.json()).then(setJobs).catch(()=>{});
  }, [selectedRole, selectedCity]);

  const maxCount = allRoles ? Math.max(...allRoles.map(r => r.job_count)) : 1;
  const maxCity = allCities ? Math.max(...allCities.map(c => c.job_count)) : 1;

  const VIEWS = [
    {id:"dashboard",label:"Dashboard"},
    {id:"analytics",label:"Analytics"},
    {id:"tools",label:"Tools"},
    {id:"about",label:"About me"},
  ];

  return (
    <div className={`app theme-${theme}`}>
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">UK Job Market Intelligence</h1>
          <p className="header-sub">Live data · {kpis?.total_jobs?.toLocaleString() ?? "—"} listings · Built by Uday Mourya · MSc Business Analytics, Warwick</p>
        </div>
        <div className="header-right">
          {VIEWS.map(v => <button key={v.id} className={`nav-btn${view===v.id?" active":""}`} onClick={()=>setView(v.id)}>{v.label}</button>)}
          <button className="nav-btn" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>{theme==="dark"?"☀ Light":"☾ Dark"}</button>
          <div className="live-badge">● Live</div>
        </div>
      </header>

      {view === "dashboard" && (
        <>
          <div className="filter-bar">
            <span className="filter-label">Filters:</span>
            {selectedRole!=="all" && <span className="filter-chip" onClick={()=>setSelectedRole("all")}>{selectedRole} ×</span>}
            {selectedCity!=="all" && <span className="filter-chip" onClick={()=>setSelectedCity("all")}>{selectedCity} ×</span>}
            {selectedRole==="all"&&selectedCity==="all"&&<span style={{fontSize:11,color:"#6B7280"}}>Click any role or city bar to filter</span>}
          </div>
          <div className="kpi-row">
            <div className="kpi-card"><div className="kpi-label">Total listings</div><div className="kpi-value" style={{color:"#7F77DD"}}>{kpis?.total_jobs?.toLocaleString()??'—'}</div><div className="kpi-sub">UK job market</div></div>
            <div className="kpi-card"><div className="kpi-label">Avg salary</div><div className="kpi-value" style={{color:"#1D9E75"}}>{kpis?.avg_salary?`£${Math.round(kpis.avg_salary/1000)}k`:'—'}</div><div className="kpi-sub">across all roles</div></div>
            <div className="kpi-card"><div className="kpi-label">Roles tracked</div><div className="kpi-value" style={{color:"#378ADD"}}>{kpis?.total_roles??'—'}</div><div className="kpi-sub">data & tech roles</div></div>
            <div className="kpi-card"><div className="kpi-label">Cities tracked</div><div className="kpi-value" style={{color:"#EF9F27"}}>{kpis?.total_cities??'—'}</div><div className="kpi-sub">UK wide coverage</div></div>
          </div>
          <div className="grid-2">
            <div className="chart-card">
              <div className="chart-title">Role demand — click to filter</div>
              {allRoles?.map((r,i) => (
                <div key={i} className={`bar-row${selectedRole===r.role?" sel":""}`} onClick={()=>setSelectedRole(p=>p===r.role?"all":r.role)} style={{cursor:"pointer"}}>
                  <div className="bar-label">{r.role}</div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${Math.round((r.job_count/maxCount)*100)}%`,background:COLORS[i%COLORS.length]}}/></div>
                  <div className="bar-count">{r.job_count}</div>
                </div>
              ))}
            </div>
            <div className="chart-card">
              <div className="chart-title">Top skills in demand</div>
              <div className="skills-grid">
                {skills?.map((d,i) => <div key={i} className="skill-pill"><span className="skill-name">{d.skill}</span><span className="skill-count" style={{color:COLORS[i%COLORS.length]}}>{d.mention_count}</span></div>)}
              </div>
            </div>
          </div>
          <div className="grid-3">
            <div className="chart-card">
              <div className="chart-title">Jobs by city — click to filter</div>
              {allCities?.map((d,i) => (
                <div key={i} className={`city-row${selectedCity===d.city?" sel":""}`} onClick={()=>setSelectedCity(p=>p===d.city?"all":d.city)} style={{cursor:"pointer",marginBottom:8}}>
                  <div className="city-dot" style={{width:`${Math.max(8,Math.round((d.job_count/maxCity)*20))}px`,height:`${Math.max(8,Math.round((d.job_count/maxCity)*20))}px`,background:COLORS[i%COLORS.length]}}/>
                  <div className="city-name">{d.city}</div>
                  <div className="city-bar-track"><div className="city-bar-fill" style={{width:`${Math.round((d.job_count/maxCity)*100)}%`,background:COLORS[i%COLORS.length]}}/></div>
                  <div className="city-count">{d.job_count}</div>
                  {d.avg_salary&&<div className="city-salary" style={{color:"#1D9E75"}}>£{Math.round(d.avg_salary/1000)}k</div>}
                </div>
              ))}
            </div>
            <div className="chart-card">
              <div className="chart-title">Avg salary by role</div>
              {salaries?.map((d,i) => {
                const max = Math.max(...(salaries||[]).map(s=>s.avg_salary||0));
                return <div key={i} className="salary-row"><div className="salary-left"><div className="salary-role">{d.role}</div><div className="salary-bar-track"><div className="salary-bar-fill" style={{width:`${Math.round(((d.avg_salary||0)/max)*100)}%`,background:COLORS[i%COLORS.length]}}/></div></div><div className="salary-val">{d.avg_salary?`£${Math.round(d.avg_salary/1000)}k`:"N/A"}</div></div>;
              })}
            </div>
            <div className="chart-card">
              <div className="chart-title">Posting trend — 30 days</div>
              {trend?.length && (() => {
                const r = [...trend].reverse().slice(-30);
                const max = Math.max(...r.map(d=>d.job_count));
                const pts = r.map((d,i)=>`${Math.round((i/(r.length-1))*100)},${Math.round(90-(d.job_count/max)*80)}`).join(' ');
                return <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:"100%",height:"100px",display:"block"}}><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7F77DD" stopOpacity="0.3"/><stop offset="100%" stopColor="#7F77DD" stopOpacity="0"/></linearGradient></defs><polyline points={pts} fill="none" stroke="#7F77DD" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/><polygon points={`0,100 ${pts} 100,100`} fill="url(#tg)"/></svg>;
              })()}
            </div>
          </div>
          {jobs?.length > 0 && (
            <div className="chart-card full-width">
              <div className="chart-title">Live listings {selectedRole!=="all"?`— ${selectedRole}`:""} {selectedCity!=="all"?`in ${selectedCity}`:""} <span style={{color:"#6B7280",fontWeight:400}}>({jobs.length} shown)</span></div>
              <div className="jobs-table-wrap">
                <table className="jobs-table">
                  <thead><tr><th>Title</th><th>Employer</th><th>City</th><th>Role</th><th>Salary</th><th>Posted</th></tr></thead>
                  <tbody>{jobs.map((j,i)=><tr key={i}><td>{j.url?<a href={j.url} target="_blank" rel="noopener noreferrer" className="job-link">{j.title}</a>:j.title}</td><td>{j.employer||"—"}</td><td>{j.location||"—"}</td><td><span className="role-badge">{j.role}</span></td><td>{j.salary_avg?`£${Math.round(j.salary_avg/1000)}k`:"—"}</td><td>{j.posted_date?String(j.posted_date).split("T")[0]:"—"}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {view === "analytics" && (
        <div className="analytics-grid">
          <SalaryBoxPlots data={boxplots}/>
          <DemandForecast trend={trend}/>
          <TopEmployers employers={employers}/>
        </div>
      )}

      {view === "tools" && (
        <div className="tools-grid">
          <SalaryPredictor salaries={salaries} skills={skills}/>
          <SkillGapAnalyser skills={skills}/>
          <JobMatchScore skills={skills}/>
        </div>
      )}

      {view === "about" && <AboutMe/>}

      <footer className="footer">
        <p>Built by <span style={{color:"#7F77DD"}}>Uday Mourya</span> · MSc Business Analytics, University of Warwick · Python · MS SQL · Node.js · React · Power BI</p>
      </footer>
    </div>
  );
}
