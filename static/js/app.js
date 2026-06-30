// ── Dark Mode ──────────────────────────────────────────────
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateThemeButton();
}

function updateThemeButton() {
    if (!themeToggle) return;
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = `<span class="me-2">${isDark ? '☽' : '☀'}</span><span>${isDark ? 'Dark' : 'Light'}</span>`;
}

const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = saved || (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
});

// ── Gauge animation (0–100% attrition risk) ─────────────────
function animateGauge(percent, lowerPercent, upperPercent) {
    const needle = document.getElementById('gaugeNeedle');
    const gaugeArc = document.getElementById('gaugeArc');
    const gaugeRange = document.getElementById('gaugeRange');
    const ARC_LEN = 377;
    const ARC_START = -90;
    const ARC_SWEEP = 180;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const pct = clamp(percent / 100, 0, 1);
    const pctLo = clamp(lowerPercent / 100, 0, 1);
    const pctHi = clamp(upperPercent / 100, 0, 1);
    const needleAngle = ARC_START + pct * ARC_SWEEP;
    const dashOffset = ARC_LEN - pct * ARC_LEN;
    needle.style.transform = `rotate(${needleAngle}deg)`;
    gaugeArc.style.strokeDashoffset = dashOffset;

    if (gaugeRange) {
        const CX = 150, CY = 155, R = 120;
        const ptOnArc = p => {
            const ang = (ARC_START + p * ARC_SWEEP) * (Math.PI / 180);
            return { x: CX + R * Math.cos(ang), y: CY + R * Math.sin(ang) };
        };
        const lo = ptOnArc(pctLo), hi = ptOnArc(pctHi);
        const largeArc = (pctHi - pctLo) * ARC_SWEEP > 180 ? 1 : 0;
        gaugeRange.setAttribute('d', `M ${lo.x} ${lo.y} A ${R} ${R} 0 ${largeArc} 1 ${hi.x} ${hi.y}`);
    }
}

function animateCounter(el, target, duration = 1200) {
    let start = null;
    const step = ts => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - prog, 3);
        el.textContent = (target * eased).toFixed(1) + '%';
        if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// ── Result rendering (success + inline error, no popups) ────
const resultSection = document.getElementById('resultSection');
const resultSuccess = document.getElementById('resultSuccess');
const resultError = document.getElementById('resultError');

function showSuccess(data) {
    resultError.style.display = 'none';
    resultSuccess.style.display = '';

    resultSection.classList.remove('visible');
    void resultSection.offsetWidth;
    resultSection.classList.add('visible');

    const readingEl = document.getElementById('readingValue');
    const labelEl = document.getElementById('predictionLabel');
    const rangeEl = document.getElementById('rangeValues');
    animateCounter(readingEl, data.attrition_probability);
    animateGauge(data.attrition_probability, data.lower_bound, data.upper_bound);
    labelEl.textContent = data.prediction_text;
    if (rangeEl) {
        rangeEl.textContent = `Likely range: ${data.lower_bound.toFixed(1)}% – ${data.upper_bound.toFixed(1)}%`;
    }

    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(message) {
    resultSuccess.style.display = 'none';
    resultError.style.display = '';
    resultError.textContent = 'Error: ' + message;

    resultSection.classList.remove('visible');
    void resultSection.offsetWidth;
    resultSection.classList.add('visible');

    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Form submission ──────────────────────────────────────────
const form = document.getElementById('predictForm');
const btn = document.getElementById('predictBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Predicting…';
    const payload = new FormData(form);
    try {
        const res = await fetch('/predict', {
            method: 'POST',
            body: payload,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        const data = await res.json();
        if (data.success) {
            showSuccess(data);
        } else {
            showError(data.error || 'Something went wrong.');
        }
    } catch (err) {
        showError('Could not reach the server. Make sure Flask is running.');
    } finally {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Predict Attrition Risk';
    }
});

// ── Render server-side result on full page load (non-AJAX fallback) ──
window.addEventListener('DOMContentLoaded', () => {
    if (window.FLASK_RESULT) {
        if (window.FLASK_RESULT.success) {
            showSuccess(window.FLASK_RESULT);
        } else {
            showError(window.FLASK_RESULT.error || 'Something went wrong.');
        }
    }
});