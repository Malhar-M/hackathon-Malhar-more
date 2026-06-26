// ==========================================
// 1. STATE & CORE CONFIGURATION MATRIX
// ==========================================
const pricingMatrix = {
  tier1: { name: "Starter", baseMonthUSD: 29, regionalTariff: { USD: 1, INR: 83, EUR: 0.92 } },
  tier2: { name: "Pro", baseMonthUSD: 79, regionalTariff: { USD: 1, INR: 83, EUR: 0.92 } },
  tier3: { name: "Max", baseMonthUSD: 149, regionalTariff: { USD: 1, INR: 83, EUR: 0.92 } }
};

const currencySymbols = { USD: '$', INR: '₹', EUR: '€' };
let currentBilling = 'monthly'; 
let currentCurrency = 'USD';
let activeBentoIndex = 0; 

// ==========================================
// 2. DYNAMIC PRICING SYSTEM (ZERO LATENCY)
// ==========================================
function updatePricingDOM() {
  const isAnnual = currentBilling === 'annual';
  const discountMultiplier = isAnnual ? 0.8 : 1.0; 

  Object.keys(pricingMatrix).forEach(tierKey => {
    const tier = pricingMatrix[tierKey];
    const basePrice = tier.baseMonthUSD * tier.regionalTariff[currentCurrency];
    let finalPrice = basePrice * discountMultiplier;
    
    if (isAnnual) {
      finalPrice = finalPrice * 12; 
    }

    const symbolElement = document.getElementById(`${tierKey}-symbol`);
    const valueElement = document.getElementById(`${tierKey}-value`);
    const periodElement = document.getElementById(`${tierKey}-period`);
    const buttonElement = document.getElementById(`${tierKey}-button`);

    const formattedPrice = Math.round(finalPrice).toLocaleString();
    const currentSymbol = currencySymbols[currentCurrency];

    if (symbolElement) symbolElement.innerText = currentSymbol;
    if (valueElement) valueElement.innerText = formattedPrice;
    if (periodElement) periodElement.innerText = isAnnual ? '/yr' : '/mo';
    
    // Updates the tier button text dynamically with custom text and selected currencies
    if (buttonElement) {
      if (tierKey === 'tier1') buttonElement.innerText = `Upgrade to Starter (${currentSymbol}${formattedPrice})`;
      if (tierKey === 'tier2') buttonElement.innerText = `Upgrade to Pro (${currentSymbol}${formattedPrice})`;
      if (tierKey === 'tier3') buttonElement.innerText = `Upgrade to Max (${currentSymbol}${formattedPrice})`;
    }
  });
}

// ==========================================
// 3. BENTO GRID TO ACCORDION SYNCING ENGINE
// ==========================================
const bentoNodes = document.querySelectorAll('.bento-node');

function highlightActiveBento(index) {
  bentoNodes.forEach((node, idx) => {
    if (idx === index) {
      node.classList.add('border-purple-500', 'scale-[1.01]'); 
    } else {
      node.classList.remove('border-purple-500', 'scale-[1.01]');
    }
  });
}

function syncLayoutBreakpoints() {
  const isMobile = window.innerWidth < 768; 
  
  if (isMobile) {
    const accordionPanels = document.querySelectorAll('.accordion-panel');
    accordionPanels.forEach((panel, idx) => {
      const content = panel.querySelector('.accordion-content');
      if (idx === activeBentoIndex) {
        content.style.maxHeight = content.scrollHeight + "px";
        panel.classList.add('is-active');
      } else {
        content.style.maxHeight = null;
        panel.classList.remove('is-active');
      }
    });
  } else {
    highlightActiveBento(activeBentoIndex);
  }
}

// ==========================================
// 4. INTERACTIVE INVERSE HERO GRADIENT MOTOR
// ==========================================
const setupHeadlineMatrix = () => {
  const title = document.getElementById('interactive-title');
  if (!title) return;

  window.addEventListener('mousemove', (e) => {
    const rect = title.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Clean white text elements track cursor center points directly, pushing yellow out
    title.style.background = `radial-gradient(circle at ${x}% ${y}%, #F1F6F4 0%, #FFC801 60%, #114C5A 120%)`;
    title.style.webkitBackgroundClip = 'text';
  });
  
  title.addEventListener('mouseleave', () => {
    title.style.background = `linear-gradient(90deg, #FFC801 0%, #F1F6F4 100%)`;
    title.style.webkitBackgroundClip = 'text';
  });
};

const setupVideoScrollEffect = () => {
  const trigger = document.getElementById('video-trigger');
  const videoContainer = document.getElementById('premium-video-container');
  if (!trigger || !videoContainer) return;

  const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ratio = entry.intersectionRatio;
        const scale = 0.98 + (ratio * 0.02); 
        const opacity = 0.95 + (ratio * 0.05); 
        
        videoContainer.style.transform = `scale(${scale})`;
        videoContainer.style.opacity = opacity;
      }
    });
  }, {
    threshold: thresholds,
    rootMargin: "0px 0px -5% 0px"
  });

  observer.observe(trigger);
};

// ==========================================
// 5. UNIFIED EVENT LISTENERS & INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updatePricingDOM();
  setupHeadlineMatrix();
  setupVideoScrollEffect();
  syncLayoutBreakpoints();

  document.getElementById('billing-toggle')?.addEventListener('change', (e) => {
    currentBilling = e.target.checked ? 'annual' : 'monthly';
    updatePricingDOM();
  });

  document.getElementById('currency-select')?.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    updatePricingDOM();
  });

  bentoNodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      activeBentoIndex = index;
      highlightActiveBento(index);
    });
  });

  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach((header, index) => {
    header.addEventListener('click', () => {
      activeBentoIndex = index; 
      syncLayoutBreakpoints();
    });
  });
});

window.addEventListener('resize', () => {
  window.requestAnimationFrame(syncLayoutBreakpoints);
});
