import { formatCurrency, withRetry, setStatus } from './utils.js';

const API_BASE = 'https://api.coingecko.com/api/v3';

document.addEventListener('DOMContentLoaded', () => {
  const coinSelect = document.getElementById('coinSelect');
  const rangeSelect = document.getElementById('rangeSelect');
  const refreshBtn = document.getElementById('refreshData');

  const priceEl = document.getElementById('currentPrice');
  const changeEl = document.getElementById('change24h');
  const volIdxEl = document.getElementById('volatilityIndex');

  // Charts
  const priceCtx = document.getElementById('priceChart');
  const volCtx = document.getElementById('volChart');

  const priceChart = new Chart(priceCtx, {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Price (USD)', data: [], borderColor: '#ff7a18', tension: 0.25 }] },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') } },
        y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') } }
      }
    }
  });

  const volChart = new Chart(volCtx, {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'Volume (USD)', data: [], backgroundColor: '#ff7a18' }] },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') } },
        y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') } }
      }
    }
  });

  async function fetchCurrent(coin) {
    return withRetry(async () => {
      const res = await fetch(`${API_BASE}/coins/${coin}?localization=false&tickers=false&market_data=true`);
      if (!res.ok) throw new Error('Failed current price');
      return res.json();
    }, 2, 800);
  }

  async function fetchMarketChart(coin, days) {
    return withRetry(async () => {
      const res = await fetch(`${API_BASE}/coins/${coin}/market_chart?vs_currency=usd&days=${days}&interval=daily`);
      if (!res.ok) throw new Error('Failed market chart');
      return res.json();
    }, 2, 800);
  }

  function computeVolatility(prices) {
    // Simple volatility index: avg abs percentage change
    if (prices.length < 2) return 0;
    let sum = 0;
    for (let i = 1; i < prices.length; i++) {
      const prev = prices[i - 1][1];
      const cur = prices[i][1];
      sum += Math.abs((cur - prev) / prev) * 100;
    }
    return (sum / (prices.length - 1)).toFixed(2) + '%';
  }

  async function loadData() {
    const coin = coinSelect.value;
    const days = rangeSelect.value;

    setStatus(priceEl, 'Loading…');
    setStatus(changeEl, 'Loading…');
    setStatus(volIdxEl, 'Loading…');

    try {
      const [current, market] = await Promise.all([
        fetchCurrent(coin),
        fetchMarketChart(coin, days)
      ]);

      const prices = market.prices; // [timestamp, price]
      const volumes = market.total_volumes; // [timestamp, volume]
      const labels = prices.map(p => new Date(p[0]).toLocaleDateString());

      // Find min/max for coloring
      const priceValues = prices.map(p => p[1]);

      // Compare last vs first
      const firstPrice = priceValues[0];
      const lastPrice = priceValues[priceValues.length - 1];

      const volumeValues = volumes.map(v => v[1]);
      const minVol = Math.min(...volumeValues);

      // Update price chart
      priceChart.data.labels = labels;
      priceChart.data.datasets[0].data = priceValues;
      priceChart.data.datasets[0].borderColor = lastPrice >= firstPrice ? '#36b37e' : '#ea9176';
      priceChart.update();

      // Update volume chart
      volChart.data.labels = labels;
      volChart.data.datasets[0].data = volumeValues;
      volChart.data.datasets[0].backgroundColor = '#36b37e'; // green
      if (volumeValues[volumeValues.length - 1] <= minVol) {
        volChart.data.datasets[0].backgroundColor = '#ea9176'; // red if low
      }
      volChart.update();

      priceEl.textContent = formatCurrency(current.market_data.current_price.usd);
      const change = current.market_data.price_change_percentage_24h;
      changeEl.textContent = `${change?.toFixed(2) ?? '—'}%`;
      changeEl.style.color = change >= 0 ? '#36b37e' : '#ea9176ff';
      volIdxEl.textContent = computeVolatility(prices);
    } catch (err) {
      priceEl.textContent = 'Failed to load';
      changeEl.textContent = '—';
      volIdxEl.textContent = '—';
      console.error(err);
    }
  }

  // Events
  refreshBtn.addEventListener('click', loadData);
  coinSelect.addEventListener('change', loadData);
  rangeSelect.addEventListener('change', loadData);

  // Initial load
  loadData();

  // Re-theme charts on theme change
  const observer = new MutationObserver(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim();
    priceChart.options.scales.x.ticks.color = color;
    priceChart.options.scales.y.ticks.color = color;
    volChart.options.scales.x.ticks.color = color;
    volChart.options.scales.y.ticks.color = color;
    priceChart.update('none');
    volChart.update('none');
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
});
