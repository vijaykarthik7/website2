const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '..', 'styles.css');
let styles = fs.readFileSync(stylesPath, 'utf8');

const isCRLF = styles.includes('\r\n');
styles = styles.replace(/\r\n/g, '\n');

const startMarker = '.section-guardian {';
const endMarker = '/* Responsive Media Queries */\n@media (max-width: 1080px) {';

const startIdx = styles.indexOf(startMarker);
const endIdx = styles.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find markers:', { startIdx, endIdx });
  process.exit(1);
}

const newGuardianSectionCSS = `.section-guardian {
  position: relative;
  padding: 120px 0 100px 0;
  background: #040406;
  border-top: 1px solid rgba(212, 175, 55, 0.18);
  border-bottom: 1px solid rgba(212, 175, 55, 0.18);
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
              linear-gradient(180deg, rgba(4, 4, 6, 0.7) 0%, transparent 20%, transparent 80%, rgba(4, 4, 6, 0.95) 100%);
}

/* Top Hero Stage */
.guardian-platform-hero {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 50px;
  align-items: center;
  margin-bottom: 50px;
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
  width: 380px;
  height: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shield-pedestal-glow {
  position: absolute;
  bottom: 16px;
  width: 220px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(212, 175, 55, 0.55) 0%, transparent 70%);
  filter: blur(10px);
  pointer-events: none;
}

.shield-pedestal-rings {
  position: absolute;
  bottom: 24px;
  width: 190px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px dashed rgba(212, 175, 55, 0.55);
  animation: radarRotate 25s linear infinite;
  pointer-events: none;
}

.shield-pedestal-rings::before {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

/* 3D Shield Emblem - Significantly Enlarged with Grand Presence */
.guardian-shield-3d {
  position: relative;
  width: 195px;
  height: 235px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: shieldFloat 4s ease-in-out infinite alternate;
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 25px rgba(212, 175, 55, 0.35));
}

.shield-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 25px rgba(0, 0, 0, 0.95));
}

/* BIG, BOLD, RADIANT LOGO IN SHIELD */
.shield-hero-logo {
  position: relative;
  z-index: 2;
  width: 95px;
  height: 95px;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(244, 211, 107, 0.95)) drop-shadow(0 0 35px rgba(212, 175, 55, 0.65));
  margin-bottom: 12px;
  transition: transform 0.35s ease, filter 0.35s ease;
}

.guardian-shield-3d:hover .shield-hero-logo {
  transform: scale(1.08);
  filter: drop-shadow(0 0 28px rgba(244, 211, 107, 1)) drop-shadow(0 0 50px rgba(212, 175, 55, 0.85));
}

/* Floating Orbit Badges - Positioned Generously around the Large Shield */
.shield-orbit-badge {
  position: absolute;
  z-index: 4;
  background: rgba(14, 14, 20, 0.94);
  border: 1px solid rgba(212, 175, 55, 0.45);
  padding: 5px 13px;
  border-radius: 999px;
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 7px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.85), 0 0 12px rgba(212, 175, 55, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.45);
}

.badge-secure { top: 12px; left: 14px; }
.badge-optimize { top: 12px; right: 14px; }
.badge-grow { bottom: 85px; left: 6px; }
.badge-monitor { bottom: 85px; right: 6px; }
.badge-protect {
  bottom: 8px;
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
  gap: 10px;
  margin-bottom: 12px;
}

.pill-tag {
  font-family: var(--font-heading);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  padding: 4px 12px;
  border-radius: 999px;
  text-transform: uppercase;
}

.pill-dark {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #d4d4d8;
}

.pill-gold {
  background: rgba(212, 175, 55, 0.12);
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: var(--gold-bright);
}

.guardian-platform-title {
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 3.2vw, 2.9rem);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.16;
  margin-bottom: 12px;
}

.guardian-platform-title .title-gold,
.arena-card-title .title-gold {
  color: #F4D36B;
  text-shadow: 0 0 16px rgba(244, 211, 107, 0.5);
}

.guardian-platform-subtitle {
  font-size: 14px;
  color: #a1a1aa;
  line-height: 1.6;
  max-width: 720px;
  margin-bottom: 24px;
}

/* 3 Feature Metric Cards */
.guardian-features-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 26px;
}

.guardian-mini-card {
  background: rgba(18, 18, 24, 0.82);
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.25s ease;
}

.guardian-mini-card:hover {
  border-color: rgba(244, 211, 107, 0.55);
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.75), 0 0 16px rgba(212, 175, 55, 0.2);
}

.mini-card-icon {
  color: var(--gold-bright);
  margin-top: 2px;
  flex-shrink: 0;
}

.mini-card-title {
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 3px;
}

.mini-card-desc {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.45;
}

.btn-guardian-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #D4AF37 0%, #F4D36B 100%);
  color: #0a0a0a;
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 800;
  padding: 13px 26px;
  border-radius: 999px;
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: all 0.25s ease;
  box-shadow: 0 4px 18px rgba(212, 175, 55, 0.38);
  align-self: flex-start;
}

.btn-guardian-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 28px rgba(212, 175, 55, 0.7);
}

/* Bottom Split Arena */
.guardian-split-arena {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 32px;
  margin-bottom: 38px;
  position: relative;
  z-index: 2;
}

.guardian-arena-card {
  background: rgba(14, 14, 18, 0.88);
  border: 1px solid rgba(212, 175, 55, 0.24);
  border-radius: 16px;
  padding: 30px 32px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.75);
}

.arena-card-title {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.35;
  margin-bottom: 8px;
}

.arena-card-subtitle {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.5;
  margin-bottom: 22px;
}

/* Funnel Stepped Stack */
.guardian-tier-stack {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tier-step {
  background: rgba(18, 18, 24, 0.94);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  transition: all 0.25s ease;
  position: relative;
  z-index: 2;
}

.tier-step:hover {
  border-color: var(--gold-bright);
  transform: translateX(4px);
  box-shadow: 0 8px 22px rgba(212, 175, 55, 0.22);
}

.tier-1 { margin-left: 0; width: 100%; }
.tier-2 { margin-left: 20px; width: calc(100% - 20px); }
.tier-3 { margin-left: 40px; width: calc(100% - 40px); }
.tier-4 { margin-left: 60px; width: calc(100% - 60px); }

.tier-lead {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.tier-badge {
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 800;
  color: #0a0a0a;
  background: linear-gradient(135deg, #D4AF37, #F4D36B);
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.06em;
}

.tier-name {
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.1em;
}

.tier-tags {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.tier-tag {
  font-size: 10.5px;
  color: #d4d4d8;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 5px;
  padding: 3px 9px;
  white-space: nowrap;
}

.tier-funnel-glow {
  position: absolute;
  bottom: -20px;
  left: 25%;
  right: 15%;
  height: 90px;
  background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.25) 0%, transparent 70%);
  pointer-events: none;
  filter: blur(14px);
  z-index: 1;
}

/* Consultation Lead Form */
.guardian-lead-form {
  display: flex;
  flex-direction: column;
}

.guardian-lead-form .form-group {
  margin-bottom: 12px;
}

.guardian-form-input,
.guardian-form-textarea {
  width: 100%;
  background: rgba(9, 9, 14, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 12.5px;
  color: #ffffff;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

.guardian-form-input:focus,
.guardian-form-textarea:focus {
  border-color: var(--gold-bright);
  box-shadow: 0 0 14px rgba(212, 175, 55, 0.3);
  background: rgba(12, 12, 18, 0.98);
}

.guardian-form-textarea {
  resize: vertical;
  min-height: 64px;
}

.btn-guardian-submit {
  width: 100%;
  background: linear-gradient(135deg, #D4AF37 0%, #F4D36B 100%);
  color: #050505;
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 800;
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.38);
  margin-top: 6px;
}

.btn-guardian-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 26px rgba(212, 175, 55, 0.7);
}

/* Form Social Proof */
.form-social-proof {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.avatar-stack {
  display: flex;
  margin-right: 4px;
}

.avatar-chip {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid #0a0a0a;
  background: #26231c;
  color: #F4D36B;
  font-size: 8px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -6px;
}

.avatar-chip:first-child {
  margin-left: 0;
}

.proof-text {
  font-size: 11px;
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
  padding: 24px 16px 0 16px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  position: relative;
  z-index: 2;
  margin-top: 10px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #d4d4d8;
}

.trust-item svg {
  color: var(--gold-bright);
  flex-shrink: 0;
}

`;

styles = styles.substring(0, startIdx) + newGuardianSectionCSS + styles.substring(endIdx);

if (isCRLF) {
  styles = styles.replace(/\n/g, '\r\n');
}

fs.writeFileSync(stylesPath, styles, 'utf8');
console.log('✓ Successfully expanded guardian section with generous space and big logo in styles.css');
