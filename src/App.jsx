import { useEffect, useState } from "react";
import "./App.css";

const menuItems = [
  { id: "overview", icon: "⌂", label: "Overview" },
  { id: "production", icon: "▥", label: "Production" },
  { id: "oee", icon: "◉", label: "OEE" },
  { id: "machines", icon: "▣", label: "Machines" },
  { id: "quality", icon: "✓", label: "Quality" },
  { id: "maintenance", icon: "⚒", label: "Maintenance" },
  { divider: true },
  { id: "reports", icon: "▤", label: "Reports" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      setCurrentDate(`${year}-${month}-${day}`);
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateDateTime();

    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const goToPage = (page) => {
    setActivePage(page);
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onPageChange={goToPage}
      />

      <main className="main">
        <Header
          currentDate={currentDate}
          currentTime={currentTime}
        />

        <div className="content">
          {activePage === "overview" && (
            <OverviewPage onPageChange={goToPage} />
          )}

          {activePage === "production" && <ProductionPage />}

          {activePage === "oee" && <OeePage />}

          {activePage === "machines" && <MachinesPage />}

          {activePage === "quality" && <QualityPage />}

          {activePage === "maintenance" && <MaintenancePage />}

          {activePage === "reports" && <ReportsPage />}

          {activePage === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}


/* ========================================
   SIDEBAR
======================================== */

function Sidebar({ activePage, onPageChange }) {
  return (
    <aside className="sidebar">
      <div className="logo-area">
        <div className="logo-box">SF</div>

        <div className="logo-text">
          <strong>SMART FACTORY</strong>
          <span>Manufacturing System</span>
        </div>
      </div>

      <nav className="navigation">
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <div className="menu-line" key={`divider-${index}`} />;
          }

          return (
            <button
              key={item.id}
              className={`menu-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => onPageChange(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="online-dot"></span>
        <span>System Online</span>
      </div>
    </aside>
  );
}


/* ========================================
   HEADER
======================================== */

function Header({ currentDate, currentTime }) {
  return (
    <header className="header">
      <div className="mobile-logo">SMART FACTORY</div>

      <div className="header-right">
        <button className="notification">
          🔔
          <span>3</span>
        </button>

        <div className="user-area">
          <div className="avatar">A</div>

          <div className="user-info">
            <strong>Admin</strong>
            <span>관리자</span>
          </div>
        </div>

        <div className="datetime">
          <span>{currentDate}</span>
          <strong>{currentTime}</strong>
        </div>
      </div>
    </header>
  );
}


/* ========================================
   OVERVIEW
======================================== */

function OverviewPage({ onPageChange }) {
  return (
    <section className="page active-page">
      <div className="page-heading">
        <div>
          <h1>Factory Overview</h1>
          <p>
            공장 전체의 생산 현황과 주요 설비 상태를 한눈에 확인할 수 있습니다.
          </p>
        </div>

        <button className="primary-button">
          + Production Report
        </button>
      </div>

      <div className="kpi-grid">
        <KpiCard
          title="OEE"
          symbol="◉"
          symbolClass="blue"
          value="87.4%"
          change="▲ 2.4%"
          changeClass="up"
          description="전일 대비"
        />

        <KpiCard
          title="Production"
          symbol="▥"
          symbolClass="purple"
          value="12,480"
          change="▲ 5.8%"
          changeClass="up"
          description="전일 대비"
        />

        <KpiCard
          title="Quality"
          symbol="✓"
          symbolClass="green"
          value="98.2%"
          change="▲ 0.7%"
          changeClass="up"
          description="전일 대비"
        />

        <KpiCard
          title="Downtime"
          symbol="◷"
          symbolClass="orange"
          value={
            <>
              42 <small>min</small>
            </>
          }
          change="▼ 12 min"
          changeClass="down"
          description="전일 대비"
        />
      </div>

      <div className="two-column">
        <ProductionTrend />

        <LineStatus onViewAll={() => onPageChange("machines")} />
      </div>

      <div className="two-column bottom">
        <Alerts />

        <FactorySummary />
      </div>
    </section>
  );
}


/* ========================================
   KPI CARD
======================================== */

function KpiCard({
  title,
  symbol,
  symbolClass,
  value,
  change,
  changeClass = "",
  description,
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span>{title}</span>

        {symbol && (
          <div className={`kpi-symbol ${symbolClass}`}>
            {symbol}
          </div>
        )}
      </div>

      <div className="kpi-value">{value}</div>

      <div className={`kpi-change ${changeClass}`}>
        {change}

        {description && <span>{description}</span>}
      </div>
    </div>
  );
}


/* ========================================
   PRODUCTION TREND
======================================== */

function ProductionTrend() {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h2>Production Trend</h2>
          <p>최근 24시간 생산량 추이</p>
        </div>

        <select className="select-box" defaultValue="Today">
          <option>Today</option>
          <option>Yesterday</option>
          <option>This Week</option>
        </select>
      </div>

      <div className="chart">
        <div className="chart-y">
          <span>800</span>
          <span>600</span>
          <span>400</span>
          <span>200</span>
          <span>0</span>
        </div>

        <div className="chart-body">
          <div className="chart-grid grid-1"></div>
          <div className="chart-grid grid-2"></div>
          <div className="chart-grid grid-3"></div>
          <div className="chart-grid grid-4"></div>

          <svg
            viewBox="0 0 700 250"
            preserveAspectRatio="none"
            className="chart-svg"
          >
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#2563eb"
                  stopOpacity="0.22"
                />

                <stop
                  offset="100%"
                  stopColor="#2563eb"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <path
              d="
                M0 190
                C45 170 65 180 100 145
                S165 90 205 125
                S260 170 305 110
                S360 75 405 105
                S465 155 510 85
                S575 50 615 92
                S665 105 700 48
                L700 250
                L0 250
                Z
              "
              fill="url(#chartGradient)"
            />

            <path
              d="
                M0 190
                C45 170 65 180 100 145
                S165 90 205 125
                S260 170 305 110
                S360 75 405 105
                S465 155 510 85
                S575 50 615 92
                S665 105 700 48
              "
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
            />
          </svg>

          <div className="chart-x">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ========================================
   LINE STATUS
======================================== */

function LineStatus({ onViewAll }) {
  const lines = [
    {
      name: "LINE 01",
      description: "자동 조립 생산라인",
      status: "RUN",
      className: "running",
    },
    {
      name: "LINE 02",
      description: "정밀 가공 생산라인",
      status: "RUN",
      className: "running",
    },
    {
      name: "LINE 03",
      description: "전자 부품 생산라인",
      status: "IDLE",
      className: "idle",
    },
    {
      name: "LINE 04",
      description: "CNC 가공 생산라인",
      status: "DOWN",
      className: "stopped",
    },
  ];

  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h2>Line Status</h2>
          <p>현재 생산라인 운영 상태</p>
        </div>

        <button className="text-button" onClick={onViewAll}>
          View All
        </button>
      </div>

      <div className="line-list">
        {lines.map((line) => (
          <div className="line-row" key={line.name}>
            <div className="line-info">
              <strong>{line.name}</strong>
              <span>{line.description}</span>
            </div>

            <span className={`status ${line.className}`}>
              ● {line.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ========================================
   ALERTS
======================================== */

function Alerts() {
  const alerts = [
    {
      type: "red",
      icon: "!",
      title: "CNC-04 abnormal temperature",
      description:
        "CNC-04 설비의 온도가 기준값을 초과했습니다.",
      time: "2 min ago",
    },
    {
      type: "yellow",
      icon: "!",
      title: "Line 03 material shortage",
      description:
        "Line 03의 원자재 재고가 부족합니다.",
      time: "12 min ago",
    },
    {
      type: "blue",
      icon: "i",
      title: "Maintenance scheduled",
      description:
        "Press-02 정기점검이 오늘 22:00에 예정되어 있습니다.",
      time: "30 min ago",
    },
  ];

  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h2>Active Alerts</h2>
          <p>현재 확인이 필요한 알림입니다.</p>
        </div>

        <span className="alert-badge">3 Alerts</span>
      </div>

      <div className="alert-list">
        {alerts.map((alert) => (
          <div className="alert-row" key={alert.title}>
            <div className={`alert-icon ${alert.type}`}>
              {alert.icon}
            </div>

            <div className="alert-content">
              <strong>{alert.title}</strong>
              <p>{alert.description}</p>
            </div>

            <span className="alert-time">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ========================================
   FACTORY SUMMARY
======================================== */

function FactorySummary() {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h2>Factory Summary</h2>
          <p>금일 공장 운영 요약</p>
        </div>
      </div>

      <SummaryItem
        label="Operating Lines"
        value="3 / 4"
        width="75%"
      />

      <SummaryItem
        label="Machine Utilization"
        value="91.6%"
        width="91.6%"
        color="purple"
      />

      <SummaryItem
        label="Quality Target"
        value="98.2%"
        width="98.2%"
        color="green"
      />
    </div>
  );
}


function SummaryItem({ label, value, width, color = "" }) {
  return (
    <div className="summary-item">
      <div className="summary-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className={`progress ${color}`}>
        <span style={{ width }}></span>
      </div>
    </div>
  );
}


/* ========================================
   PRODUCTION PAGE
======================================== */

function ProductionPage() {
  return (
    <section className="page active-page">
      <PageHeading
        title="Production"
        description="생산라인별 생산량과 작업 진행 현황을 확인합니다."
      />

      <div className="kpi-grid">
        <KpiCard
          title="Today's Production"
          value="12,480"
          change="▲ 5.8%"
          changeClass="up"
          description="전일 대비"
        />

        <KpiCard
          title="Target"
          value="14,000"
          change="달성률 89.1%"
        />

        <KpiCard
          title="Running Lines"
          value="3 / 4"
          change="1개 라인 생산 대기"
        />

        <KpiCard
          title="Efficiency"
          value="92.4%"
          change="▲ 1.2%"
          changeClass="up"
        />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Production Lines</h2>
            <p>현재 생산라인별 작업 현황입니다.</p>
          </div>
        </div>

        <div className="line-list">
          <ProductionLine
            name="LINE 01"
            description="오늘 생산량 4,120 / 목표 4,500"
            status="RUN"
            className="running"
          />

          <ProductionLine
            name="LINE 02"
            description="오늘 생산량 3,860 / 목표 4,000"
            status="RUN"
            className="running"
          />

          <ProductionLine
            name="LINE 03"
            description="자재 부족으로 생산 대기 중"
            status="IDLE"
            className="idle"
          />

          <ProductionLine
            name="LINE 04"
            description="CNC-04 설비 이상으로 생산 중단"
            status="DOWN"
            className="stopped"
          />
        </div>
      </div>
    </section>
  );
}


function ProductionLine({
  name,
  description,
  status,
  className,
}) {
  return (
    <div className="line-row">
      <div className="line-info">
        <strong>{name}</strong>
        <span>{description}</span>
      </div>

      <span className={`status ${className}`}>
        ● {status}
      </span>
    </div>
  );
}


/* ========================================
   OEE PAGE
======================================== */

function OeePage() {
  return (
    <section className="page active-page">
      <PageHeading
        title="OEE"
        description="설비종합효율을 기준으로 공장 운영 효율을 분석합니다."
      />

      <div className="kpi-grid">
        <KpiCard
          title="OEE"
          value="87.4%"
          change="▲ 2.4%"
          changeClass="up"
        />

        <KpiCard
          title="Availability"
          value="94.1%"
          change="▲ 1.1%"
          changeClass="up"
        />

        <KpiCard
          title="Performance"
          value="92.8%"
          change="▲ 0.8%"
          changeClass="up"
        />

        <KpiCard
          title="Quality"
          value="98.2%"
          change="▲ 0.7%"
          changeClass="up"
        />
      </div>

      <div className="panel empty-panel">
        <div className="large-number">87.4%</div>

        <h2>Overall Equipment Effectiveness</h2>

        <p>
          현재 공장의 설비종합효율은 목표값 85%를 상회하고 있습니다.
        </p>
      </div>
    </section>
  );
}


/* ========================================
   MACHINES PAGE
======================================== */

function MachinesPage() {
  const machines = [
    {
      status: "RUNNING",
      statusClass: "run",
      name: "CNC-01",
      description: "정밀 가공 설비",
      utilization: "94.2%",
    },
    {
      status: "RUNNING",
      statusClass: "run",
      name: "PRESS-02",
      description: "프레스 생산 설비",
      utilization: "91.8%",
    },
    {
      status: "IDLE",
      statusClass: "idle-status",
      name: "ROBOT-03",
      description: "자동 조립 로봇",
      utilization: "78.4%",
    },
    {
      status: "DOWN",
      statusClass: "down-status",
      name: "CNC-04",
      description: "정밀 가공 설비",
      utilization: "0%",
    },
  ];

  return (
    <section className="page active-page">
      <PageHeading
        title="Machines"
        description="주요 생산설비의 현재 상태와 운영 현황을 확인합니다."
      />

      <div className="machine-grid">
        {machines.map((machine) => (
          <div className="machine-card" key={machine.name}>
            <span
              className={`machine-status ${machine.statusClass}`}
            >
              {machine.status}
            </span>

            <h3>{machine.name}</h3>

            <p>{machine.description}</p>

            <strong>{machine.utilization}</strong>

            <small>가동률</small>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ========================================
   QUALITY PAGE
======================================== */

function QualityPage() {
  return (
    <section className="page active-page">
      <PageHeading
        title="Quality"
        description="제품 품질 지표와 불량 현황을 확인합니다."
      />

      <div className="kpi-grid">
        <KpiCard
          title="Quality Rate"
          value="98.2%"
          change="▲ 0.7%"
          changeClass="up"
        />

        <KpiCard
          title="Defect Rate"
          value="1.8%"
          change="▼ 0.7%"
          changeClass="down"
        />

        <KpiCard
          title="Inspected"
          value="12,720"
          change="금일 검사 수량"
        />

        <KpiCard
          title="Rejected"
          value="229"
          change="불량 제품"
        />
      </div>
    </section>
  );
}


/* ========================================
   MAINTENANCE PAGE
======================================== */

function MaintenancePage() {
  return (
    <section className="page active-page">
      <PageHeading
        title="Maintenance"
        description="설비 점검 일정과 유지보수 작업을 관리합니다."
      />

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Maintenance Schedule</h2>
            <p>예정된 설비 점검 및 유지보수 작업입니다.</p>
          </div>
        </div>

        <div className="maintenance-list">
          <MaintenanceRow
            machine="Press-02"
            task="정기 점검"
            time="22:00"
          />

          <MaintenanceRow
            machine="CNC-04"
            task="온도 센서 점검"
            time="긴급"
            danger
          />

          <MaintenanceRow
            machine="Robot-03"
            task="윤활 작업"
            time="내일 09:00"
          />
        </div>
      </div>
    </section>
  );
}


function MaintenanceRow({
  machine,
  task,
  time,
  danger = false,
}) {
  return (
    <div className="maintenance-row">
      <strong>{machine}</strong>

      <span>{task}</span>

      <b className={danger ? "danger-text" : ""}>
        {time}
      </b>
    </div>
  );
}


/* ========================================
   REPORTS PAGE
======================================== */

function ReportsPage() {
  const reports = [
    {
      type: "DAILY",
      title: "Daily Production Report",
      description: "일일 생산량 및 생산성 분석 보고서",
    },
    {
      type: "WEEKLY",
      title: "Weekly OEE Report",
      description: "주간 설비종합효율 분석 보고서",
    },
    {
      type: "QUALITY",
      title: "Quality Report",
      description: "제품 품질 및 불량률 분석 보고서",
    },
  ];

  return (
    <section className="page active-page">
      <PageHeading
        title="Reports"
        description="생산 및 설비 운영 데이터를 리포트 형태로 확인합니다."
      />

      <div className="report-grid">
        {reports.map((report) => (
          <div className="report-card" key={report.title}>
            <span>{report.type}</span>

            <h3>{report.title}</h3>

            <p>{report.description}</p>

            <button>View Report</button>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ========================================
   SETTINGS PAGE
======================================== */

function SettingsPage() {
  const [notification, setNotification] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <section className="page active-page">
      <PageHeading
        title="Settings"
        description="스마트 팩토리 시스템의 기본 환경을 설정합니다."
      />

      <div className="panel settings-panel">
        <div className="setting-row">
          <div>
            <strong>Factory Name</strong>
            <p>공장 이름을 설정합니다.</p>
          </div>

          <input
            type="text"
            defaultValue="Smart Factory"
          />
        </div>

        <div className="setting-row">
          <div>
            <strong>Notification</strong>
            <p>설비 이상 알림을 활성화합니다.</p>
          </div>

          <button
            type="button"
            className={`toggle ${
              notification ? "active" : ""
            }`}
            onClick={() =>
              setNotification((value) => !value)
            }
            aria-label="Notification toggle"
          ></button>
        </div>

        <div className="setting-row">
          <div>
            <strong>Auto Refresh</strong>
            <p>대시보드 데이터를 자동으로 갱신합니다.</p>
          </div>

          <button
            type="button"
            className={`toggle ${
              autoRefresh ? "active" : ""
            }`}
            onClick={() =>
              setAutoRefresh((value) => !value)
            }
            aria-label="Auto Refresh toggle"
          ></button>
        </div>
      </div>
    </section>
  );
}


/* ========================================
   PAGE HEADING
======================================== */

function PageHeading({ title, description }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default App;
