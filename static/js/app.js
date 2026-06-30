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

// ── Populate location dropdown ─────────────────────────────
const LOCATIONS = [
    "1st Block Jayanagar", "1st Phase JP Nagar", "2nd Phase Judicial Layout",
    "2nd Stage Nagarbhavi", "5th Block Hbr Layout", "5th Phase JP Nagar",
    "6th Phase JP Nagar", "7th Phase JP Nagar", "8th Phase JP Nagar",
    "Abbigere", "Akshaya Nagar", "Ambedkar Nagar", "Amruth Nagar",
    "Anandapura", "Anekal", "Anjanapura Township", "Ardendale",
    "Arekere", "Attibele", "BEML Layout", "BTM 2nd Stage", "BTM Layout",
    "Babusapalaya", "Badavala Nagar", "Balagere", "Banashankari",
    "Banashankari Stage II", "Banashankari Stage III", "Banashankari Stage V",
    "Banashankari Stage VI", "Banaswadi", "Banjara Layout", "Bannerghatta",
    "Bannerghatta Road", "Basavangudi", "Basaveshwara Nagar",
    "Battarahalli", "Begur", "Begur Road", "Bellandur",
    "Benson Town", "Bhoganhalli", "Billekahalli", "Binny Pete",
    "Bisuvanahalli", "Bommanahalli", "Bommasandra", "Bommasandra Industrial Area",
    "Bommasandra Jigani Link Road", "Brookefield", "Budigere",
    "CV Raman Nagar", "Chamrajpet", "Chandapura", "Channasandra",
    "Chikka Tirupathi", "Chikkabanavar", "Chikkalasandra", "Choodasandra",
    "Cooke Town", "Cox Town", "Cunningham Road", "Dasanapura",
    "Dasarahalli", "Devanahalli", "Devarachikkanahalli", "Dodda Nekkundi",
    "Doddaballapur", "Doddakallasandra", "Doddathoguru", "Domlur",
    "Dommasandra", "EPIP Zone", "Electronic City", "Electronic City Phase II",
    "Electronics City Phase 1", "Frazer Town", "GM Palaya", "Garudachar Palya",
    "Gollarapalya Hosahalli", "Gottigere", "Green Glen Layout",
    "Gubbalala", "Gunjur", "HBR Layout", "HRBR Layout",
    "HSR Layout", "Haralur Road", "Harlur", "Hebbal",
    "Hebbal Kempapura", "Hegde Nagar", "Hennur", "Hennur Road",
    "Hoodi", "Horamavu Agara", "Horamavu Banaswadi", "Hormavu",
    "Hosa Road", "Hosakerehalli", "Hoskote", "Hosur Road",
    "Hulimavu", "ISRO Layout", "ITPL", "Iblur Village",
    "Indira Nagar", "JP Nagar", "Jakkur", "Jalahalli",
    "Jalahalli East", "Jigani", "Judicial Layout", "KR Puram",
    "Kadubeesanahalli", "Kadugodi", "Kaggadasapura", "Kaggalipura",
    "Kaikondrahalli", "Kammanahalli", "Kanakpura Road", "Kannamangala",
    "Kasavanhalli", "Kasturi Nagar", "Kathriguppe", "Kenchenahalli",
    "Kereguddadahalli", "Kodichikkanahalli", "Kodigehalli", "Kodihalli",
    "Kogilu", "Konanakunte", "Koramangala", "Kothannur", "Kothnur",
    "Kudlu", "Kudlu Gate", "Kumaraswami Layout", "Kundalahalli",
    "LB Shastri Nagar", "Laggere", "Lakshminarayana Pura", "Lingadheeranahalli",
    "Magadi Road", "Mahadevpura", "Mahaveer Nagar", "Mallasandra",
    "Malleshpalya", "Malleshwaram", "Marathahalli", "Margondanahalli",
    "Mico Layout", "Munnekollal", "Murugeshpalya", "Mysore Road",
    "NGR Layout", "NRI Layout", "Nagarbhavi", "Nagasandra",
    "Nagawara", "Narayanapura", "Neeladri Nagar", "Nehru Nagar",
    "OMBR Layout", "Old Airport Road", "Old Madras Road",
    "Padmanabhanagar", "Pai Layout", "Panathur", "Parappana Agrahara",
    "Pattandur Agrahara", "Poorna Pragna Layout", "Prithvi Layout",
    "R.T. Nagar", "Rachenahalli", "Raja Rajeshwari Nagar", "Rajaji Nagar",
    "Rajiv Nagar", "Ramagondanahalli", "Ramamurthy Nagar", "Rayasandra",
    "Sahakara Nagar", "Sanjay nagar", "Sarakki Nagar", "Sarjapura",
    "Sarjapura Road", "Sarjapura - Attibele Road", "Sector 2 HSR Layout",
    "Sector 7 HSR Layout", "Singasandra", "Somasundara Palya",
    "Sompura", "Srinivasa Nagar", "Thanisandra", "Thellarapalya",
    "Thubarahalli", "Thyagaraja Nagar", "Tindlu", "Tumkur Road",
    "Ulsoor", "Uttarahalli", "Varthur", "Varthur Road",
    "Vasanthapura", "Vidyaranyapura", "Vijayanagar", "Vishveshwarya Layout",
    "Vishwapriya Layout", "Vittasandra", "Whitefield", "Yelachenahalli",
    "Yelahanka", "Yelahanka New Town", "Yeshwanthpur", "other"
];

const locationSelect = document.getElementById('location');
LOCATIONS.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = loc;
    locationSelect.appendChild(opt);
});

function updateSlider(input, fill, display, formatter) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    fill.style.width = pct + '%';
    display.textContent = formatter(val);
}

const sqft = document.getElementById('sqft');
const sqftFill = document.getElementById('sqftFill');
const sqftDisp = document.getElementById('sqftDisplay');
const bath = document.getElementById('bath');
const bathFill = document.getElementById('bathFill');
const bathDisp = document.getElementById('bathDisplay');
const beds = document.getElementById('bedrooms');
const bedsFill = document.getElementById('bedroomsFill');
const bedsDisp = document.getElementById('bedroomsDisplay');
const summaryLocation = document.getElementById('summaryLocation');
const summarySqft = document.getElementById('summarySqft');
const summaryBedrooms = document.getElementById('summaryBedrooms');
const summaryBath = document.getElementById('summaryBath');

function syncSummary() {
    summaryLocation.textContent = locationSelect.value || '—';
    summarySqft.textContent = sqft.value + ' sqft';
    summaryBedrooms.textContent = beds.value + ' BHK';
    summaryBath.textContent = bath.value;
}

updateSlider(sqft, sqftFill, sqftDisp, v => v + ' sqft');
updateSlider(bath, bathFill, bathDisp, v => v);
updateSlider(beds, bedsFill, bedsDisp, v => v + ' BHK');
syncSummary();

sqft.addEventListener('input', () => {
    updateSlider(sqft, sqftFill, sqftDisp, v => v + ' sqft');
    syncSummary();
});
bath.addEventListener('input', () => {
    updateSlider(bath, bathFill, bathDisp, v => v);
    syncSummary();
});
beds.addEventListener('input', () => {
    updateSlider(beds, bedsFill, bedsDisp, v => v + ' BHK');
    syncSummary();
});
locationSelect.addEventListener('change', syncSummary);

function animateGauge(predicted, lower, upper, maxVal) {
    const needle = document.getElementById('gaugeNeedle');
    const gaugeArc = document.getElementById('gaugeArc');
    const gaugeMax = document.getElementById('gaugeMax');
    const ARC_LEN = 377;
    const ARC_START = -90;
    const ARC_SWEEP = 180;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const pctPred = clamp(predicted / maxVal, 0, 1);
    const pctLo = clamp(lower / maxVal, 0, 1);
    const pctHi = clamp(upper / maxVal, 0, 1);
    const needleAngle = ARC_START + pctPred * ARC_SWEEP;
    const dashOffset = ARC_LEN - pctPred * ARC_LEN;
    needle.style.transform = `rotate(${needleAngle}deg)`;
    gaugeMax.textContent = maxVal >= 1000 ? '₹' + (maxVal / 100).toFixed(0) + 'Cr' : '₹' + maxVal.toFixed(0) + 'L';
    const rangeEl = document.getElementById('gaugeRange');
    const CX = 150, CY = 155, R = 120;
    function ptOnArc(pct) {
        const ang = (ARC_START + pct * ARC_SWEEP) * (Math.PI / 180);
        return { x: CX + R * Math.cos(ang), y: CY + R * Math.sin(ang) };
    }
    const lo = ptOnArc(pctLo), hi = ptOnArc(pctHi);
    const largeArc = (pctHi - pctLo) * ARC_SWEEP > 180 ? 1 : 0;
    rangeEl.setAttribute('d', `M ${lo.x} ${lo.y} A ${R} ${R} 0 ${largeArc} 1 ${hi.x} ${hi.y}`);
}

function animateCounter(el, target, duration = 1200) {
    let start = null;
    const step = ts => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - prog, 3);
        el.textContent = (target * eased).toFixed(2);
        if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function showResult(predicted) {
    const mape = 0.17;
    const lower = predicted * (1 - mape);
    const upper = predicted * (1 + mape);
    const maxVal = predicted * 1.6;
    const section = document.getElementById('resultSection');
    section.classList.remove('visible');
    void section.offsetWidth;
    section.classList.add('visible');
    const readingEl = document.getElementById('readingValue');
    animateCounter(readingEl, predicted);
    animateGauge(predicted, lower, upper, maxVal);
    document.getElementById('rangeValues').textContent = `₹ ${lower.toFixed(2)} – ₹ ${upper.toFixed(2)} Lakhs`;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const form = document.getElementById('predictForm');
const btn = document.getElementById('predictBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!locationSelect.value) {
        locationSelect.focus();
        return;
    }
    btn.classList.add('loading');
    btn.querySelector('.btn-text').textContent = 'Estimating…';
    const payload = new FormData(form);
    try {
        const res = await fetch('/predict', {
            method: 'POST',
            body: payload,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        const data = await res.json();
        if (data.predicted_price !== undefined) {
            showResult(parseFloat(data.predicted_price));
        } else if (data.error) {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        alert('Could not reach the server. Make sure Flask is running.');
    } finally {
        btn.classList.remove('loading');
        btn.querySelector('.btn-text').textContent = 'Estimate Market Value';
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (typeof window.FLASK_PREDICTION === 'number') {
        showResult(window.FLASK_PREDICTION);
    }
});