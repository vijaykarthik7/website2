const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const startMarker = '/* ==========================================================================\n   RIYADVI GUARDIAN';
const altStartMarker = '/* ==========================================================================\r\n   RIYADVI GUARDIAN';
const endMarker = '/* ==========================================================================\n   PORTFOLIO & CASE STUDIES (Section 19)';
const altEndMarker = '/* ==========================================================================\r\n   PORTFOLIO & CASE STUDIES (Section 19)';

let startIndex = css.indexOf(startMarker);
if (startIndex === -1) startIndex = css.indexOf(altStartMarker);

let endIndex = css.indexOf(endMarker);
if (endIndex === -1) endIndex = css.indexOf(altEndMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
  process.exit(1);
}

const replacement = `/* ==========================================================================
   RIYADVI GUARDIAN™ PLATFORM (Layout Matched to Reference Image)
   ========================================================================== */
.section-guardian {
  position: relative;
  padding: 30px 0 14px 0;
  background: #040406;
  border-top: 1px solid rgba(212, 175, 55, 0.12);
  border-bottom: 1px solid rgba(212, 175, 55, 0.12);
  overflow: hidden;
}

/* Atmospheric Space Earth Backdrop */
.guardian-earth-bg {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: url('assets/guardian_earth_backdrop.jpg');
  background-size: cover;
  background-position: left center;
  background-repeat: no-repeat;
  opacity: 0.65;
  pointer-events: none;
  z-index: 1;
}

.guardian-earth-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 75% 50%, rgba(4, 4, 6, 0.95) 25%, rgba(4, 4, 6, 0.65) 60%, transparent 100%),
              linear-gradient(180deg, rgba(4, 4, 6, 0.6) 0%, transparent 20%, transparent 80%, rgba(4, 4, 6, 0.9) 100%);
}

/* Top Hero Stage */
.guardian-platform-hero {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  align-items: center;
  margin-bottom: 14px;
  position: relative;
  z-index: 2;
}

/* Left Sentinel Shield Stage */
.guardian-sentinel-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sentinel-shield-stage {
  position: relative;
  width: 280px;
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shield-pedestal-glow {
  position: absolute;
  bottom: 18px;
  width: 140px;
  height: 34px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(212, 175, 55, 0.45) 0%, transparent 70%);
  filter: blur(7px);
  pointer-events: none;
}

.shield-pedestal-rings {
  position: absolute;
  bottom: 24px;
  width: 120px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px dashed rgba(212, 175, 55, 0.45);
  animation: radarRotate 25s linear infinite;
  pointer-events: none;
}

.shield-pedestal-rings::before {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 1px solid rgba(212, 175, 55, 0.22);
}

/* 3D Shield Emblem */
.guardian-shield-3d {
  position: relative;
  width: 130px;
  height: 155px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: shieldFloat 4s ease-in-out infinite alternate;
}

.shield-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 22px rgba(0, 0, 0, 0.95));
}

.shield-hero-logo {
  position: relative;
  z-index: 2;
  width: 44px;
  height: 44px;
  object-fit: contain;
  filter: drop-shadow(0 0 14px rgba(244, 211, 107, 0.9));
  margin-bottom: 10px;
}

/* Floating Orbit Badges */
.shield-orbit-badge {
  position: absolute;
  z-index: 4;
  background: rgba(14, 14, 18, 0.92);
  border: 1px solid rgba(212, 175, 55, 0.35);
  padding: 3px 9px;
  border-radius: 999px;
  font-family: var(--font-heading);
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.shield-orbit-badge svg {
  color: var(--gold-bright);
}

.shield-orbit-badge:hover {
  border-color: var(--gold-bright);
  transform: scale(1.08);
  box-shadow: 0 0 16px rgba(212, 175, 55, 0.35);
}

.badge-secure { top: 8px; left: 4px; }
.badge-optimize { top: 8px; right: 4px; }
.badge-grow { bottom: 60px; left: 2px; }
.badge-monitor { bottom: 60px; right: 2px; }
.badge-protect {
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
}
.badge-protect:hover {
  transform: translateX(-50%) scale(1.08);
}

/* Right Content Column */
.guardian-content-col {
  display: flex;
  flex-direction: column;
}

.guardian-pill-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.pill-tag {
  font-family: var(--font-heading);
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  padding: 3px 10px;
  border-radius: 999px;
  text-transform: uppercase;
}

.pill-dark {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #d4d4d8;
}

.pill-gold {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.35);
  color: var(--gold-bright);
}

.guardian-platform-title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 2.7vw, 2.35rem);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 5px;
}

.guardian-platform-title .title-gold,
.arena-card-title .title-gold {
  color: #F4D36B;
  text-shadow: 0 0 14px rgba(244, 211, 107, 0.45);
}

.guardian-platform-subtitle {
  font-size: 11.5px;
  color: #a1a1aa;
  line-height: 1.45;
  max-width: 680px;
  margin-bottom: 12px;
}

/* 3 Feature Metric Cards */
.guardian-features-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.guardian-mini-card {
  background: rgba(18, 18, 22, 0.75);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  padding: 8px 11px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.25s ease;
}

.guardian-mini-card:hover {
  border-color: rgba(244, 211, 107, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
}

.mini-card-icon {
  color: var(--gold-bright);
  margin-top: 1px;
  flex-shrink: 0;
}

.mini-card-title {
  font-family: var(--font-heading);
  font-size: 11.5px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1px;
}

.mini-card-desc {
  font-size: 9.5px;
  color: #9ca3af;
  line-height: 1.35;
}

.btn-guardian-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #D4AF37 0%, #F4D36B 100%);
  color: #0a0a0a;
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 800;
  padding: 8px 18px;
  border-radius: 999px;
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.35);
  align-self: flex-start;
}

.btn-guardian-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 24px rgba(212, 175, 55, 0.65);
}

/* Bottom Split Arena */
.guardian-split-arena {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}

.guardian-arena-card {
  background: rgba(14, 14, 18, 0.85);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}

.arena-card-title {
  font-family: var(--font-heading);
  font-size: 15.5px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.3;
  margin-bottom: 3px;
}

.arena-card-subtitle {
  font-size: 10.5px;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 12px;
}

/* Funnel Stepped Stack */
.guardian-tier-stack {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.tier-step {
  background: rgba(18, 18, 22, 0.92);
  border: 1px solid rgba(212, 175, 55, 0.24);
  border-radius: 6px;
  padding: 6px 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  transition: all 0.25s ease;
  position: relative;
  z-index: 2;
}

.tier-step:hover {
  border-color: var(--gold-bright);
  transform: translateX(3px);
  box-shadow: 0 6px 18px rgba(212, 175, 55, 0.18);
}

.tier-1 { margin-left: 0; width: 100%; }
.tier-2 { margin-left: 16px; width: calc(100% - 16px); }
.tier-3 { margin-left: 32px; width: calc(100% - 32px); }
.tier-4 { margin-left: 48px; width: calc(100% - 48px); }

.tier-lead {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.tier-badge {
  font-family: var(--font-heading);
  font-size: 8px;
  font-weight: 800;
  color: #0a0a0a;
  background: linear-gradient(135deg, #D4AF37, #F4D36B);
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.05em;
}

.tier-name {
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.1em;
}

.tier-tags {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.tier-tag {
  font-size: 9px;
  color: #d4d4d8;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
}

.tier-funnel-glow {
  position: absolute;
  bottom: -15px;
  left: 30%;
  right: 15%;
  height: 70px;
  background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
  pointer-events: none;
  filter: blur(10px);
  z-index: 1;
}

/* Consultation Lead Form */
.guardian-lead-form {
  display: flex;
  flex-direction: column;
}

.guardian-lead-form .form-group {
  margin-bottom: 6px;
}

.guardian-form-input,
.guardian-form-textarea {
  width: 100%;
  background: rgba(9, 9, 12, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 10.5px;
  color: #ffffff;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

.guardian-form-input:focus,
.guardian-form-textarea:focus {
  border-color: var(--gold-bright);
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
  background: rgba(12, 12, 16, 0.95);
}

.guardian-form-textarea {
  resize: vertical;
  min-height: 44px;
}

.btn-guardian-submit {
  width: 100%;
  background: linear-gradient(135deg, #D4AF37 0%, #F4D36B 100%);
  color: #050505;
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 800;
  padding: 9px 14px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);
  margin-top: 2px;
}

.btn-guardian-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 22px rgba(212, 175, 55, 0.65);
}

/* Form Social Proof */
.form-social-proof {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.avatar-stack {
  display: flex;
  margin-right: 2px;
}

.avatar-chip {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #0a0a0a;
  background: #26231c;
  color: #F4D36B;
  font-size: 7px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -5px;
}

.avatar-chip:first-child {
  margin-left: 0;
}

.proof-text {
  font-size: 9.5px;
  color: #d4d4d8;
}

.proof-highlight {
  color: #F4D36B;
  font-weight: 800;
}

/* Bottom Trust Strip */
.guardian-trust-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 0 10px;
  border-top: 1px solid rgba(212, 175, 55, 0.15);
  position: relative;
  z-index: 2;
  margin-top: 2px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  color: #d4d4d8;
}

.trust-item svg {
  color: var(--gold-bright);
  flex-shrink: 0;
}

/* Responsive Media Queries */
@media (max-width: 1080px) {
  .guardian-platform-hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 18px;
  }
  .guardian-pill-tags {
    justify-content: center;
  }
  .guardian-platform-subtitle {
    margin: 0 auto 12px auto;
  }
  .guardian-features-row {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto 14px auto;
    text-align: left;
  }
  .btn-guardian-primary {
    align-self: center;
  }
  .guardian-split-arena {
    grid-template-columns: 1fr;
  }
  .tier-1, .tier-2, .tier-3, .tier-4 {
    margin-left: 0;
    width: 100%;
  }
  .guardian-trust-strip {
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .section-guardian {
    padding: 30px 0 20px 0;
  }
  .guardian-arena-card {
    padding: 14px 12px;
  }
  .tier-step {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  .tier-tags {
    justify-content: flex-start;
  }
}

`;

const newCss = css.substring(0, startIndex) + replacement + css.substring(endIndex);
fs.writeFileSync(cssPath, newCss, 'utf8');
console.log('Successfully updated styles.css with perfected vertical framing!');
