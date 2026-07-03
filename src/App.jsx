import { useMemo, useState } from 'react';

const initialRequests = [
  { id: 'XS202406250001', title: '小区路灯不亮', category: '设施报修', owner: '王女士', grid: '第三网格', status: '办理中', assignee: '李晓红', time: '06-25 09:40', desc: '3号楼北侧道路晚间照明不足，老人通行不方便。', timeline: ['居民提交诉求', 'AI小福补全地址与类型', '后台派单给李晓红', '网格员正在处理'] },
  { id: 'XS202406240045', title: '楼道卫生清理', category: '环境卫生', owner: '陈女士', grid: '第一网格', status: '已办结', assignee: '赵志强', time: '06-24 15:20', desc: '楼道堆放杂物，影响通行。', timeline: ['居民提交诉求', '社区受理', '物业联动处理', '居民确认完成'], rating: 5 },
  { id: 'XS202406230032', title: '停车位占用', category: '物业管理', owner: '李先生', grid: '第二网格', status: '待受理', assignee: '-', time: '06-23 18:05', desc: '消防通道旁停车位长期被占用。', timeline: ['居民提交诉求', '等待后台受理'] },
];

const serviceCards = [
  ['找党员', '党员先锋服务', 'ri-user-star-line', '#FF4D3F'],
  ['报事报修', '设施故障上报', 'ri-tools-line', '#FF8F1F'],
  ['政策咨询', 'AI政策问答', 'ri-question-answer-line', '#2878FF'],
];

const partyMembers = [
  { name: '李晓红', role: '第三网格党员', score: '98%', tags: ['独居老人', '设施报修'] },
  { name: '赵志强', role: '第一网格网格员', score: '96%', tags: ['环境卫生', '物业联动'] },
  { name: '刘建国', role: '第二网格党员', score: '95%', tags: ['政策咨询', '邻里纠纷'] },
];

const policies = [
  { title: '养老助餐服务申请指引', tag: '民生', match: 92, desc: '面向社区长者的助餐申请条件、材料和办理时限说明。' },
  { title: '居住证明办理指南', tag: '政务', match: 87, desc: '说明实名信息、居住地址和社区核验材料的办理要求。' },
  { title: '维修基金咨询口径', tag: '物业', match: 78, desc: '用于解释维修基金使用范围、咨询流程和反馈渠道。' },
];

const adminModules = [
  ['dashboard', '数据概览', 'ri-dashboard-fill'],
  ['requests', '诉求管理', 'ri-file-list-3-line'],
  ['party', '党员管理', 'ri-shield-user-line'],
  ['services', '服务事项', 'ri-layout-grid-line'],
  ['policy', '政策管理', 'ri-government-line'],
  ['announce', '公告管理', 'ri-megaphone-line'],
  ['users', '用户管理', 'ri-team-line'],
  ['ai', 'AI知识库', 'ri-robot-2-line'],
];

function statusTone(status) {
  if (status === '已办结') return 'success';
  if (status === '办理中') return 'blue';
  if (status === '待评价') return 'orange';
  return 'gray';
}

export function App() {
  const [mode, setMode] = useState('resident');
  const [residentRoute, setResidentRoute] = useState('home');
  const [adminRoute, setAdminRoute] = useState('dashboard');
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toast, setToast] = useState('欢迎使用幸福管家高保真原型');
  const [draft, setDraft] = useState({ category: '设施报修', desc: '小区东门路灯连续两晚不亮，希望尽快维修。' });
  const [aiQuestion, setAiQuestion] = useState('我想咨询一下，小区噪音扰民应该怎么处理？');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: '您好，我是AI小福。社区服务、政策咨询、报事报修、党员服务都可以直接问我。' },
  ]);

  const stats = useMemo(() => {
    const total = requests.length;
    const done = requests.filter((item) => item.status === '已办结' || item.status === '待评价').length;
    const running = requests.filter((item) => item.status === '办理中').length;
    const satisfaction = Math.min(99, 97 + requests.filter((item) => item.rating >= 4).length);
    return { total, done, running, satisfaction };
  }, [requests]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__happyButlerToast);
    window.__happyButlerToast = window.setTimeout(() => setToast(''), 2600);
  };

  const submitResidentRequest = () => {
    const next = {
      id: `XS20260625${String(requests.length + 1).padStart(4, '0')}`,
      title: draft.desc.slice(0, 12) || '居民诉求',
      category: draft.category,
      owner: '演示居民',
      grid: '第三网格',
      status: '待受理',
      assignee: '-',
      time: '刚刚',
      desc: draft.desc,
      timeline: ['居民提交诉求', 'AI小福识别诉求类型并生成工单', '等待后台受理'],
    };
    setRequests((items) => [next, ...items]);
    setResidentRoute('progress');
    showToast('诉求已提交，后台管理端可立即受理');
  };

  const askAiQuestion = () => {
    const question = aiQuestion.trim();
    if (!question) {
      showToast('先输入想问小福的问题');
      return;
    }
    setChatMessages((items) => [
      ...items,
      { role: 'user', text: question },
      { role: 'ai', text: `我已理解您的问题：“${question}”。您可以继续追问，我也可以帮您整理成社区诉求，自动补充类型、网格和办理建议。` },
    ]);
    setDraft((prev) => ({ ...prev, desc: question }));
    setAiQuestion('');
    showToast('小福已回复，可继续追问或转为诉求');
  };

  const convertAiAnswerToRequest = () => {
    setDraft((prev) => ({
      ...prev,
      desc: prev.desc || '请社区协助处理我的咨询事项。',
    }));
    showToast('已根据咨询内容生成诉求草稿，可直接提交');
  };

  const updateRequest = (request, patch, toastText) => {
    setRequests((items) => items.map((item) => (item.id === request.id ? { ...item, ...patch } : item)));
    setSelectedRequest((prev) => (prev && prev.id === request.id ? { ...prev, ...patch } : prev));
    showToast(toastText);
  };

  const dispatchRequest = (request) => updateRequest(request, {
    status: '办理中',
    assignee: '李晓红',
    timeline: [...request.timeline, '管理员派单给李晓红'],
  }, '已派单：居民端进度同步更新');

  const completeRequest = (request) => updateRequest(request, {
    status: '待评价',
    timeline: [...request.timeline, '网格员反馈已完成，等待居民评价'],
  }, '办理完成，居民端可评价');

  const rateRequest = (request) => updateRequest(request, {
    status: '已办结',
    rating: 5,
    timeline: [...request.timeline, '居民五星评价：非常满意'],
  }, '评价已提交，后台满意率已刷新');

  return (
    <main className="prototype" data-mode={mode}>
      <header className="stage-header">
        <div>
          <p className="eyebrow">Happy Butler Prototype</p>
          <h1>幸福管家 · 双端全流程可点击演示</h1>
          <div className="version-note">
            <span>V2整理版</span>
            <b>自由咨询 → AI生成诉求 → 后台协同闭环</b>
          </div>
        </div>
        <nav className="mode-switch" aria-label="切换演示端">
          <button className={mode === 'resident' ? 'active' : ''} onClick={() => setMode('resident')} data-route="resident">居民端</button>
          <button className={mode === 'admin' ? 'active' : ''} onClick={() => setMode('admin')} data-route="admin">后台管理</button>
        </nav>
      </header>

      <section className="stage">
        <div className="flow-rail" aria-label="V2演示主线">
          <span><i className="ri-chat-smile-3-line" />自由咨询</span>
          <span><i className="ri-magic-line" />AI生成诉求</span>
          <span><i className="ri-route-line" />智能派单</span>
          <span><i className="ri-dashboard-3-line" />AI协同闭环</span>
        </div>
        {mode === 'resident' && (
          <PhoneFrame title="幸福管家" route={residentRoute} setRoute={setResidentRoute} accent="blue">
            {residentRoute === 'home' && <ResidentHome setRoute={setResidentRoute} requests={requests} />}
            {residentRoute === 'request' && <ResidentRequest draft={draft} setDraft={setDraft} submit={submitResidentRequest} aiQuestion={aiQuestion} setAiQuestion={setAiQuestion} chatMessages={chatMessages} askAiQuestion={askAiQuestion} convertAiAnswerToRequest={convertAiAnswerToRequest} />}
            {residentRoute === 'progress' && <ResidentProgress requests={requests} rateRequest={rateRequest} />}
            {residentRoute === 'services' && <ResidentServices />}
            {residentRoute === 'profile' && <ResidentProfile requests={requests} />}
          </PhoneFrame>
        )}

        {mode === 'admin' && (
          <AdminDesktop
            route={adminRoute}
            setRoute={setAdminRoute}
            requests={requests}
            stats={stats}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
            dispatchRequest={dispatchRequest}
            completeRequest={completeRequest}
          />
        )}
      </section>

      {toast && <div className="toast"><i className="ri-checkbox-circle-fill" />{toast}</div>}
    </main>
  );
}

function PhoneFrame({ title, route, setRoute, children, accent }) {
  const tabs = [['home', '首页', 'ri-home-5-fill'], ['services', '服务', 'ri-grid-fill'], ['request', '小福', 'ri-robot-2-fill'], ['progress', '消息', 'ri-chat-3-fill'], ['profile', '我的', 'ri-user-3-fill']];
  return (
    <div className={`phone-frame ${accent}`}>
      <div className="phone-status"><span>9:41</span><span><i className="ri-wifi-fill" /> 100%</span></div>
      <div className="phone-content">
        <div className="mini-title">{title}<span>●●</span></div>
        {children}
      </div>
      <nav className="bottom-tabs">
        {tabs.map(([key, label, icon]) => (
          <button key={key} className={route === key ? 'active' : ''} onClick={() => setRoute(key)} data-route={key}>
            <i className={icon} />{label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function AiHero({ setRoute }) {
  return (
    <section className="ai-hero">
      <div className="ai-face"><i className="ri-robot-2-fill" /></div>
      <div>
        <h2>AI小福智能助手</h2>
        <p>有问题，找小福；诉求填报快一步</p>
      </div>
      <button onClick={() => setRoute('request')}>立即咨询</button>
    </section>
  );
}

function ResidentHome({ setRoute, requests }) {
  return (
    <div className="mobile-screen resident" data-view="resident-home">
      <AiHero setRoute={setRoute} />
      <section className="v2-guide-card">
        <b>V2演示主线</b>
        <p>居民不必先理解事项分类，先自由咨询小福，再由 AI 自动整理成诉求草稿。</p>
      </section>
      <div className="search-pill"><i className="ri-search-line" /> 说说您想办理什么 <i className="ri-mic-line" /></div>
      <div className="quick-pair">
        <button onClick={() => setRoute('request')} data-action="start-resident-request"><i className="ri-user-voice-fill" />一键诉求<span>AI帮您快速提交</span></button>
        <button onClick={() => setRoute('progress')}><i className="ri-briefcase-4-fill" />我的进度<span>实时查看办理进度</span></button>
      </div>
      <div className="service-grid">
        {serviceCards.map(([title, desc, icon, color]) => (
          <button key={title} onClick={() => setRoute(title === '报事报修' ? 'request' : 'services')}>
            <span style={{ '--icon': color }}><i className={icon} /></span>{title}<small>{desc}</small>
          </button>
        ))}
      </div>
      <CardTitle title="我的诉求" action="全部" onClick={() => setRoute('progress')} />
      <div className="request-stack">{requests.slice(0, 3).map((item) => <RequestMini key={item.id} item={item} />)}</div>
    </div>
  );
}

function ResidentRequest({ draft, setDraft, submit, aiQuestion, setAiQuestion, chatMessages, askAiQuestion, convertAiAnswerToRequest }) {
  return (
    <div className="mobile-screen" data-view="resident-request">
      <section className="chat-card">
        <div className="chat-head">
          <div className="ai-face small"><i className="ri-robot-2-fill" /></div>
          <div>
            <h2>AI小福咨询</h2>
            <p>不限分类，想问什么都可以</p>
          </div>
        </div>
        <div className="chat-log">
          {chatMessages.map((message, index) => <div className={`bubble ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}
        </div>
        <div className="question-box">
          <textarea value={aiQuestion} onChange={(event) => setAiQuestion(event.target.value)} placeholder="比如：楼上噪音扰民怎么办？老人助餐怎么申请？设施维修怎么跟进？" />
          <button className="primary" onClick={askAiQuestion} data-action="ask-ai-question">随便问小福</button>
        </div>
        <div className="prompt-row">
          {['物业纠纷怎么处理？', '老人助餐如何申请？', '路灯维修怎么跟进？'].map((item) => <button key={item} onClick={() => setAiQuestion(item)}>{item}</button>)}
        </div>
        <button className="primary ghost" onClick={convertAiAnswerToRequest} data-action="convert-ai-answer-to-request">把咨询内容转为诉求草稿</button>
      </section>
      <section className="form-card glow">
        <h2>诉求草稿</h2>
        <p>如果问题需要社区处理，小福会把自由咨询整理成可提交的诉求。</p>
        <label>诉求类型</label>
        <div className="chip-row">{['设施报修', '环境卫生', '物业管理', '邻里纠纷'].map((item) => <button key={item} className={draft.category === item ? 'active' : ''} onClick={() => setDraft({ ...draft, category: item })}>{item}</button>)}</div>
        <label>问题描述</label>
        <textarea value={draft.desc} onChange={(event) => setDraft({ ...draft, desc: event.target.value })} />
        <div className="ai-suggestion"><i className="ri-magic-fill" /> AI建议：已识别为“{draft.category}”，建议派发至第三网格并关联物业维修。</div>
        <button className="primary" onClick={submit} data-action="submit-resident-request">提交诉求</button>
      </section>
    </div>
  );
}

function ResidentProgress({ requests, rateRequest }) {
  return (
    <div className="mobile-screen" data-view="resident-progress">
      <CardTitle title="进度查询" action={`${requests.length}条`} />
      {requests.map((item) => (
        <section className="progress-card" key={item.id}>
          <div className="row-between"><h3>{item.title}</h3><Badge tone={statusTone(item.status)}>{item.status}</Badge></div>
          <p>{item.desc}</p>
          <div className="timeline">{item.timeline.map((step) => <span key={step}>{step}</span>)}</div>
          {item.status === '待评价' && <button className="primary ghost" onClick={() => rateRequest(item)}>去评价</button>}
        </section>
      ))}
    </div>
  );
}

function ResidentServices() {
  return (
    <div className="mobile-screen" data-view="resident-services">
      <CardTitle title="服务事项" action="智能排序" />
      {['居住证明办理', '养老助餐申请', '维修基金咨询', '党员志愿服务预约'].map((item, index) => <section className="list-card" key={item}><i className={['ri-file-list-3-line', 'ri-restaurant-2-line', 'ri-bank-card-line', 'ri-shield-user-line'][index]} /><div><h3>{item}</h3><p>办理材料、办理时限、咨询入口已整理</p></div><button>查看</button></section>)}
      <CardTitle title="党员服务" action="3人在线" />
      {partyMembers.map((member) => <section className="member-card" key={member.name}><div className="avatar">{member.name.slice(0, 1)}</div><div><h3>{member.name}</h3><p>{member.role} · 响应率 {member.score}</p><div>{member.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div></div></section>)}
    </div>
  );
}

function ResidentProfile({ requests }) {
  return (
    <div className="mobile-screen" data-view="resident-profile">
      <section className="profile-card"><div className="avatar large">王</div><div><h2>王女士</h2><p>幸福社区 3号楼 · 第三网格</p></div></section>
      <div className="metric-grid mini"><Metric label="我的诉求" value={requests.length} /><Metric label="待评价" value={requests.filter((item) => item.status === '待评价').length} /><Metric label="已办结" value={requests.filter((item) => item.status === '已办结').length} /></div>
      <section className="form-card"><h3>常用资料</h3><p>手机号 138****8800</p><p>认证状态 已实名</p><p>默认社区 幸福社区</p></section>
    </div>
  );
}

function AdminDesktop({ route, setRoute, requests, stats, selectedRequest, setSelectedRequest, dispatchRequest, completeRequest }) {
  return (
    <div className="admin-desktop" data-view="admin">
      <aside className="admin-sidebar">
        <div className="brand"><i className="ri-home-smile-2-fill" />幸福管家</div>
        {adminModules.map(([key, label, icon]) => <button key={key} className={route === key ? 'active' : ''} onClick={() => setRoute(key)} data-route={`admin-${key}`}><i className={icon} />{label}</button>)}
        <div className="operator"><div className="avatar">张</div><div><b>张管理员</b><p>社区管理员</p></div></div>
      </aside>
      <section className="admin-main">
        <div className="admin-topbar"><h2>{adminModules.find(([key]) => key === route)?.[1]}</h2><div className="admin-search"><i className="ri-search-line" /> 搜索工单、用户、政策</div><button className="top-action"><i className="ri-notification-3-line" />消息</button></div>
        {route === 'dashboard' && <AdminDashboard stats={stats} requests={requests} setRoute={setRoute} />}
        {route === 'requests' && <AdminRequests requests={requests} setSelectedRequest={setSelectedRequest} />}
        {route !== 'dashboard' && route !== 'requests' && <AdminModule route={route} />}
      </section>
      {selectedRequest && <aside className="drawer"><button className="drawer-close" onClick={() => setSelectedRequest(null)}><i className="ri-close-line" /></button><Badge tone={statusTone(selectedRequest.status)}>{selectedRequest.status}</Badge><h2>{selectedRequest.title}</h2><p>{selectedRequest.desc}</p><div className="detail-grid"><span>工单编号<b>{selectedRequest.id}</b></span><span>所属网格<b>{selectedRequest.grid}</b></span><span>诉求人<b>{selectedRequest.owner}</b></span><span>办理人<b>{selectedRequest.assignee}</b></span></div><div className="timeline admin">{selectedRequest.timeline.map((step) => <span key={step}>{step}</span>)}</div><div className="drawer-actions"><button className="primary" onClick={() => dispatchRequest(selectedRequest)} data-action="dispatch-request">派单给党员</button><button className="primary ghost" onClick={() => completeRequest(selectedRequest)} data-action="complete-request">标记完成</button></div></aside>}
    </div>
  );
}

function AdminDashboard({ stats, requests, setRoute }) {
  return (
    <div className="admin-page" data-view="admin-dashboard">
      <section className="ai-loop-panel">
        <div>
          <p className="eyebrow">AI协同闭环</p>
          <h3>从自由咨询到派单办结，一条线讲清楚</h3>
          <span>小福识别居民意图，生成结构化工单，后台完成受理、派单、反馈和评价统计。</span>
        </div>
        <button onClick={() => setRoute('requests')}>查看诉求闭环</button>
      </section>
      <div className="metric-row"><Metric label="诉求总量" value={stats.total} icon="ri-file-list-3-fill" delta="+12.5%" /><Metric label="已办结" value={stats.done} icon="ri-checkbox-circle-fill" delta="+15.3%" tone="green" /><Metric label="办理中" value={stats.running} icon="ri-hourglass-2-fill" delta="-6.2%" /><Metric label="满意率" value={`${stats.satisfaction}%`} icon="ri-emotion-happy-fill" delta="+2.1%" tone="purple" /></div>
      <div className="dashboard-grid"><section className="panel wide"><CardTitle title="诉求趋势" action="本月" /><div className="chart-bars">{[48, 58, 54, 70, 78, 74, 61, 69, 82, 76, 88, 94].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div></section><section className="panel"><CardTitle title="诉求类型分布" action="1,256" /><div className="donut"><span>{stats.total}<small>总数</small></span></div><div className="legend"><p><b className="blue-dot" />环境卫生 35.6%</p><p><b className="green-dot" />设施设备 24.8%</p><p><b className="orange-dot" />物业服务 16.7%</p></div></section></div>
      <section className="panel"><CardTitle title="最新诉求" action="查看更多" onClick={() => setRoute('requests')} /><AdminTable requests={requests.slice(0, 5)} compact /></section>
    </div>
  );
}

function AdminRequests({ requests, setSelectedRequest }) {
  return <div className="admin-page" data-view="admin-requests"><div className="filter-bar">{['全部', '待受理', '办理中', '待评价', '已办结'].map((item) => <button key={item}>{item}</button>)}<span><i className="ri-filter-3-line" /> 网格 / 类型 / 时间</span></div><AdminTable requests={requests} onOpen={setSelectedRequest} /></div>;
}

function AdminTable({ requests, onOpen = () => {}, compact = false }) {
  return <table className="admin-table"><thead><tr><th>诉求编号</th><th>诉求内容</th><th>诉求人</th><th>网格</th><th>状态</th><th>办理人</th><th>更新时间</th><th>操作</th></tr></thead><tbody>{requests.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.title}</td><td>{item.owner}</td><td>{item.grid}</td><td><Badge tone={statusTone(item.status)}>{item.status}</Badge></td><td>{item.assignee}</td><td>{item.time}</td><td><button onClick={() => onOpen(item)}>{compact ? '查看' : '处理'}</button></td></tr>)}</tbody></table>;
}

function AdminModule({ route }) {
  const maps = {
    party: ['党员管理', partyMembers.map((m) => [m.name, m.role, `响应率 ${m.score}`, '在线'])],
    services: ['服务事项', [['居住证明办理', '政务服务', '1个工作日', '已上线'], ['设施报修', '社区服务', '2小时响应', '已上线'], ['养老助餐申请', '民生服务', '即办', '已上线']]],
    policy: ['政策管理', policies.map((p) => [p.title, p.tag, `${p.match}%匹配`, '已发布'])],
    announce: ['公告管理', [['电梯检修通知', '居民公告', '06-25', '已发布'], ['消防演练提醒', '安全公告', '06-24', '已发布'], ['防汛温馨提示', '安全公告', '草稿']]],
    users: ['用户管理', [['王女士', '居民', '第三网格', '正常'], ['李先生', '居民', '第二网格', '正常'], ['张管理员', '后台账号', '社区管理员', '正常']]],
    ai: ['AI知识库', [['诉求分类规则', '命中 1,246 次', '06-25更新', '启用'], ['政策问答库', '命中 806 次', '06-24更新', '启用'], ['服务事项口径', '命中 512 次', '06-22更新', '启用']]],
  };
  const [title, rows] = maps[route];
  return <div className="admin-page"><section className="panel"><CardTitle title={title} action="新增" /><table className="admin-table module"><tbody>{rows.map((row) => <tr key={row.join('-')}>{row.map((cell, i) => <td key={`${cell}-${i}`}>{i === row.length - 1 ? <Badge tone={cell.includes('草稿') ? 'orange' : 'green'}>{cell}</Badge> : cell}</td>)}<td><button>编辑</button></td></tr>)}</tbody></table></section></div>;
}

function CardTitle({ title, action, onClick }) {
  return <div className="card-title"><h2>{title}</h2>{action && <button onClick={onClick}>{action} <i className="ri-arrow-right-s-line" /></button>}</div>;
}

function RequestMini({ item }) {
  return <section className="request-mini"><div className="row-between"><h3>{item.title}</h3><Badge tone={statusTone(item.status)}>{item.status}</Badge></div><p>工单编号：{item.id}</p><span>{item.time} · {item.category}</span></section>;
}

function Metric({ label, value, icon = 'ri-bar-chart-2-fill', delta, tone = 'blue' }) {
  return <section className={`metric ${tone}`}><div><p>{label}</p><h3>{value}</h3>{delta && <span>环比 {delta}</span>}</div><i className={icon} /></section>;
}

function Badge({ children, tone = 'gray' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
