import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Laptop,
  LockKeyhole,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

import "./Home.css";

const features = [
  {
    icon: Boxes,
    title: "Asset Management",
    description:
      "Register, organize and track every physical asset throughout its complete lifecycle.",
  },
  {
    icon: PackageCheck,
    title: "Allocation & Ownership",
    description:
      "Know exactly who has an asset, where it belongs and when it is expected back.",
  },
  {
    icon: RefreshCw,
    title: "Transfers & Returns",
    description:
      "Handle transfers and returns with approval workflows and complete history.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description:
      "Raise, approve and track maintenance requests without losing asset visibility.",
  },
  {
    icon: CalendarCheck,
    title: "Resource Booking",
    description:
      "Book shared rooms, equipment and resources while preventing scheduling conflicts.",
  },
  {
    icon: ClipboardCheck,
    title: "Audit & Compliance",
    description:
      "Run structured audit cycles and identify missing or damaged assets quickly.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Register",
    description: "Add assets and organize them by category and department.",
  },
  {
    number: "02",
    title: "Allocate",
    description: "Assign assets to employees or departments with conflict protection.",
  },
  {
    number: "03",
    title: "Track",
    description: "Monitor ownership, location, condition and lifecycle status.",
  },
  {
    number: "04",
    title: "Maintain",
    description: "Handle maintenance requests through a structured workflow.",
  },
  {
    number: "05",
    title: "Return or Transfer",
    description: "Move assets safely while preserving their complete history.",
  },
  {
    number: "06",
    title: "Audit",
    description: "Verify assets and surface discrepancies before closing the cycle.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <button
            className="home-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="home-brand-icon">
              <Boxes size={20} strokeWidth={2.4} />
            </div>

            <div>
              <div className="home-brand-name">
                Asset<span>Flow</span>
              </div>
              <div className="home-brand-subtitle">
                Enterprise Asset Management
              </div>
            </div>
          </button>

          <div className="home-nav-links">
            <a href="#features">Features</a>
            <a href="#workflow">How It Works</a>
            <a href="#about">About</a>
          </div>

          <div className="home-nav-actions">
            <button
              className="home-signin-btn"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

            <button
              className="home-nav-cta"
              onClick={() => navigate("/signup")}
            >
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-hero-copy">
              <div className="home-eyebrow">
                <span className="home-eyebrow-dot" />
                Smart asset & resource management
              </div>

              <h1>
                Manage Your Assets.
                <br />
                <span>Simplify Your Operations.</span>
              </h1>

              <p className="home-hero-description">
                AssetFlow gives your organization one centralized platform to
                manage assets, allocations, transfers, returns, maintenance,
                bookings and audits.
              </p>

              <div className="home-hero-actions">
                <button
                  className="home-primary-btn"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                  <ArrowRight size={18} />
                </button>

                <button
                  className="home-secondary-btn"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                  <ArrowUpRight size={17} />
                </button>
              </div>

              <div className="home-hero-trust">
                <div>
                  <CheckCircle2 size={17} />
                  <span>Centralized management</span>
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  <span>Role-based workflows</span>
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  <span>Complete asset history</span>
                </div>
              </div>
            </div>

            {/* Product preview */}
            <div className="home-product-wrap">
              <div className="home-product-glow" />

              <div className="home-product-card">
                <div className="home-product-topbar">
                  <div className="home-product-dots">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="home-product-title">
                    AssetFlow Dashboard
                  </div>

                  <div className="home-product-avatar">AK</div>
                </div>

                <div className="home-product-content">
                  <div className="home-product-heading">
                    <div>
                      <span>Overview</span>
                      <h3>Good morning, Arun</h3>
                    </div>

                    <div className="home-product-date">
                      September 2026
                    </div>
                  </div>

                  <div className="home-kpi-grid">
                    <div className="home-kpi">
                      <div className="home-kpi-icon purple">
                        <Boxes size={16} />
                      </div>
                      <div>
                        <span>Available Assets</span>
                        <strong>248</strong>
                      </div>
                    </div>

                    <div className="home-kpi">
                      <div className="home-kpi-icon blue">
                        <PackageCheck size={16} />
                      </div>
                      <div>
                        <span>Allocated</span>
                        <strong>173</strong>
                      </div>
                    </div>

                    <div className="home-kpi">
                      <div className="home-kpi-icon orange">
                        <Wrench size={16} />
                      </div>
                      <div>
                        <span>Maintenance</span>
                        <strong>12</strong>
                      </div>
                    </div>

                    <div className="home-kpi">
                      <div className="home-kpi-icon green">
                        <CalendarCheck size={16} />
                      </div>
                      <div>
                        <span>Bookings</span>
                        <strong>31</strong>
                      </div>
                    </div>
                  </div>

                  <div className="home-product-bottom">
                    <div className="home-chart-card">
                      <div className="home-mini-heading">
                        <span>Asset utilization</span>
                        <small>Last 6 months</small>
                      </div>

                      <div className="home-chart">
                        <div className="home-chart-line" />
                        <div className="home-chart-grid">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </div>

                    <div className="home-activity-card">
                      <div className="home-mini-heading">
                        <span>Recent activity</span>
                        <small>View all</small>
                      </div>

                      <div className="home-activity">
                        <div className="home-activity-icon">
                          <PackageCheck size={13} />
                        </div>

                        <div>
                          <strong>Asset allocated</strong>
                          <span>Laptop · AF-0142</span>
                        </div>

                        <small>2m</small>
                      </div>

                      <div className="home-activity">
                        <div className="home-activity-icon orange">
                          <Wrench size={13} />
                        </div>

                        <div>
                          <strong>Maintenance approved</strong>
                          <span>Projector · AF-0081</span>
                        </div>

                        <small>18m</small>
                      </div>

                      <div className="home-activity">
                        <div className="home-activity-icon green">
                          <CalendarCheck size={13} />
                        </div>

                        <div>
                          <strong>Resource booked</strong>
                          <span>Conference Room B</span>
                        </div>

                        <small>1h</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="home-floating-card home-floating-one">
                <ShieldCheck size={18} />
                <div>
                  <strong>Secure workflows</strong>
                  <span>Role based access</span>
                </div>
              </div>

              <div className="home-floating-card home-floating-two">
                <CheckCircle2 size={18} />
                <div>
                  <strong>Asset verified</strong>
                  <span>Audit completed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="home-stats">
          <div className="home-stats-inner">
            <div>
              <strong>01</strong>
              <span>Centralized platform</span>
            </div>

            <div>
              <strong>06+</strong>
              <span>Core operational modules</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Asset lifecycle visibility</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Operational visibility</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="home-section" id="features">
          <div className="home-section-heading">
            <div className="home-section-label">POWERFUL MODULES</div>

            <h2>
              Everything you need to
              <br />
              <span>control your assets.</span>
            </h2>

            <p>
              From registration to audit, AssetFlow connects every stage of
              your organization's asset lifecycle.
            </p>
          </div>

          <div className="home-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div className="home-feature-card" key={feature.title}>
                  <div className="home-feature-icon">
                    <Icon size={22} />
                  </div>

                  <div className="home-feature-content">
                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>

                    <span className="home-feature-arrow">
                      Explore module
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* About */}
        <section className="home-about" id="about">
          <div className="home-about-inner">
            <div className="home-about-icon">
              <Building2 size={25} />
            </div>

            <div>
              <div className="home-section-label">BUILT FOR ORGANIZATIONS</div>

              <h2>
                One system for
                <br />
                <span>everything you manage.</span>
              </h2>

              <p>
                AssetFlow is designed for organizations that manage equipment,
                furniture, vehicles, rooms, shared resources and other
                physical assets. Replace disconnected spreadsheets and manual
                records with one structured operational platform.
              </p>
            </div>

            <div className="home-about-points">
              <div>
                <Users size={19} />
                <span>Employees & departments</span>
              </div>

              <div>
                <Laptop size={19} />
                <span>Physical assets & equipment</span>
              </div>

              <div>
                <LockKeyhole size={19} />
                <span>Secure role-based access</span>
              </div>

              <div>
                <FileCheck2 size={19} />
                <span>Auditable operational history</span>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="home-section" id="workflow">
          <div className="home-section-heading">
            <div className="home-section-label">HOW IT WORKS</div>

            <h2>
              A simple lifecycle.
              <br />
              <span>Complete visibility.</span>
            </h2>

            <p>
              AssetFlow follows the way assets actually move through an
              organization.
            </p>
          </div>

          <div className="home-workflow">
            {workflow.map((item, index) => (
              <div className="home-workflow-item" key={item.number}>
                <div className="home-workflow-number">{item.number}</div>

                <div className="home-workflow-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                {index !== workflow.length - 1 && (
                  <div className="home-workflow-line" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="home-final-cta">
          <div className="home-final-cta-inner">
            <div className="home-final-icon">
              <Boxes size={26} />
            </div>

            <h2>
              Bring your assets
              <br />
              <span>under control.</span>
            </h2>

            <p>
              Start managing your organization's assets and resources with
              AssetFlow.
            </p>

            <div className="home-final-actions">
              <button
                className="home-primary-btn"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <button
                className="home-final-signin"
                onClick={() => navigate("/login")}
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <div className="home-brand-icon">
              <Boxes size={18} />
            </div>

            <div>
              <strong>
                Asset<span>Flow</span>
              </strong>

              <small>Enterprise Asset Management</small>
            </div>
          </div>

          <p>
            © {new Date().getFullYear()} AssetFlow. Built for smarter
            operations.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;