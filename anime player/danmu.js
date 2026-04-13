document.addEventListener('DOMContentLoaded', () => {
  initDanmu();
});

// 弹幕核心变量
let danmuBuffer = [];
let bufferTimer = null;
let danmus = [];
let activeDanmus = [];
let lastDanmuTime = 0;
let densityInterval = 1000;
let linePositions = [];
const BASE_SPEED = 100; // 基础速度（像素/秒）
const temp = document.createElement("textarea");


function initDanmu() {
  updateLinePositions();
  window.danmusClear = danmusClear;
  // 监听 video-panel 尺寸变化（使用 ResizeObserver）
  const videoPanel = document.getElementById('video-panel');
  if (videoPanel) {
    // 创建尺寸观察器
    const resizeObserver = new ResizeObserver(entries => {
      // 防抖处理（避免频繁触发）
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(() => {
        handleVideoPanelResize(); // 处理尺寸变化
      }, 100);
    });

    // 开始观察 video-panel
    resizeObserver.observe(videoPanel);

    // 页面卸载时停止观察（避免内存泄漏）
    window.addEventListener('unload', () => {
      resizeObserver.unobserve(videoPanel);
    });
  }
  document.getElementById('danmuLimit').addEventListener('input', updateDensity);
  document.getElementById('danmuSpeed').addEventListener('input', updateDensity);
  document.getElementById('danmuSize').addEventListener('input', updateLinePositions);
  document.getElementById('danmuRange').addEventListener('input', updateLinePositions);
}
function danmusClear() {
  danmus = [];
}
// 容器 resize 时的处理函数
function handleVideoPanelResize() {
  if (!danmuContainer || !isDanmuEnabled) return;

  // 2. 重新计算行位置（适应新高度）
  updateLinePositions();

  // 3. 重新计算弹幕密度和速度（适应新宽度）
  updateDensity();
}
// 预计算行位置
function updateLinePositions() {
  const containerHeight = danmuContainer.offsetHeight || window.innerHeight;
  const danmuRange = document.getElementById('danmuRange');
  const rangePercent = danmuRange ? parseInt(danmuRange.value) / 100 : 1;
  const availableHeight = containerHeight * rangePercent;

  const danmuSize = document.getElementById('danmuSize');
  const customSize = danmuSize ? parseInt(danmuSize.value) : 24;
  const lineSpacing = 8;
  const totalLineHeight = customSize + lineSpacing;

  const maxLines = Math.max(1, Math.floor((availableHeight) / totalLineHeight));
  linePositions = [];
  for (let i = 0; i < maxLines; i++) {
    linePositions.push(i * totalLineHeight + (lineSpacing / 2));
  }
}

function updateDensity() {
  const danmuLimit = document.getElementById('danmuLimit');
  const danmuSpeed = document.getElementById('danmuSpeed');
  if (!danmuLimit || !danmuSpeed) return;

  const containerWidth = window.innerWidth;
  const speedMultiplier = parseFloat(danmuSpeed.value) || 1;
  const actualSpeed = BASE_SPEED * speedMultiplier;
  const avgDuration = containerWidth / actualSpeed;

  const maxPerSecond = parseInt(danmuLimit.value) / avgDuration;
  densityInterval = maxPerSecond > 0 ? 1000 / maxPerSecond : 1000;
}

function createWaveform() {
  const canvas = document.getElementById('waveformCanvas');
  const video = document.getElementById('myVideo');
  if (!canvas || !danmus.length || !video || isNaN(video.duration)) return;

  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const duration = video.duration;

  // 1. 基礎統計
  const rawBins = new Array(Math.floor(width)).fill(0);
  danmus.forEach(d => {
    const binIndex = Math.floor((d.time / duration) * width);
    if (binIndex >= 0 && binIndex < rawBins.length) rawBins[binIndex]++;
  });

  // 2. Gaussian 平滑（取代原本的 Moving Average）
  const sigma = 6;
  const radius = Math.ceil(sigma * 3);
  const kernel = [];
  let ksum = 0;
  for (let i = -radius; i <= radius; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    kernel.push(v);
    ksum += v;
  }
  const norm = kernel.map(v => v / ksum);

  const smoothBins = rawBins.map((_, i) => {
    let sum = 0;
    for (let k = 0; k < norm.length; k++) {
      const j = i - radius + k;
      sum += (j >= 0 && j < rawBins.length ? rawBins[j] : 0) * norm[k];
    }
    return sum;
  });

  const maxDanmus = Math.max(...smoothBins) || 1;

  // 3. 降採樣成控制點（每 3 個取 1 個）
  const step = 3;
  const pts = smoothBins
    .map((val, i) => [i, height - (val / maxDanmus) * (height - 5)])
    .filter((_, i) => i % step === 0);

  // Catmull-Rom 轉貝塞爾曲線
  function drawCatmullRom() {
    ctx.lineTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
    }
  }

  // 4. 繪製
  ctx.clearRect(0, 0, width, height);

  // 填充區域
  ctx.beginPath();
  ctx.moveTo(0, height);
  drawCatmullRom();
  ctx.lineTo(pts[pts.length - 1][0], height);
  ctx.closePath();
  ctx.fillStyle = '#8a8a8a40';
  ctx.fill();

  // 頂部線條
  ctx.beginPath();
  drawCatmullRom();
  ctx.strokeStyle = '#bcbcbc';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function loadDanmuXML(xmlFile) {
  if (!danmuContainer) return;
  clearDanmus();
  updateDensity();
  updateLinePositions();

  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(evt.target.result, "text/xml");

      if (xml.querySelector('parsererror')) {
        console.error('弹幕XML解析错误:', xml.querySelector('parsererror').textContent);
        return;
      }

      const dNodes = xml.querySelectorAll('d');
      danmus = [];

      if (dNodes.length === 0) {
        console.warn('该视频没有弹幕数据');
        return;
      }

      dNodes.forEach(node => {
        const p = node.getAttribute('p')?.split(',');
        if (!p || p.length < 4) return;

        const time = parseFloat(p[0]); // 弹幕出现时间（秒）
        const color = '#' + parseInt(p[3]).toString(16).padStart(6, '0');
        const size = parseInt(p[2]) || 24;

        danmus.push({
          text: node.textContent || '无内容',
          time,
          color: color === "#00000f" ? "#ffffff" : color,
          size,
          shown: false
        });
      });

      danmus.sort((a, b) => a.time - b.time);
      console.log(`成功加载 ${danmus.length} 条弹幕`);
      createWaveform();
    } catch (err) {
      console.error('加载弹幕失败:', err);
    }
  };

  reader.onerror = function () {
    console.error('读取弹幕文件失败:', reader.error);
  };

  reader.readAsText(xmlFile);
}

function clearDanmus() {
  danmus.forEach(d => d.shown = false);
  activeDanmus.forEach(danmu => {
    danmuContainer.removeChild(danmu);
  });
  activeDanmus = [];
  danmuBuffer = [];
  if (bufferTimer) {
    clearTimeout(bufferTimer);
    bufferTimer = null;
  }
  lastDanmuTime = 0;
}

function getNonOverlappingLine() {
  if (linePositions.length === 0) updateLinePositions();

  const danmuSize = document.getElementById('danmuSize');
  const customSize = danmuSize ? parseInt(danmuSize.value) : 24;
  const RIGHT_EDGE_THRESHOLD = customSize * 1.2;
  const container = document.getElementById('danmu-container');
  const containerWidth = container.offsetWidth;

  // 優化：預先過濾出各行的彈幕狀態
  const occupiedLines = new Map();
  activeDanmus.forEach(dm => {
    const top = parseFloat(dm.style.top);
    if (!occupiedLines.has(top)) occupiedLines.set(top, []);
    occupiedLines.get(top).push(dm);
  });

  const availableLines = linePositions.filter(linePos => {
    const dmsInLine = occupiedLines.get(linePos);
    if (!dmsInLine) return true;

    // 檢查該行最晚進入的彈幕是否已經騰出空間
    return dmsInLine.every(dm => {
      const rect = dm.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      // 判斷彈幕右邊界是否已經離開容器右緣一定距離
      return (rect.right < containerRect.right - RIGHT_EDGE_THRESHOLD);
    });
  });

  if (availableLines.length > 0) {
    return availableLines[Math.floor(Math.random() * availableLines.length)];
  }
  return -1;
}

function createDanmu({ text, color, size, time: danmuTime }, currentVideoTime) {
  if (!isDanmuEnabled || !danmuContainer) return false;

  // 暂停时不新增弹幕
  const video = document.getElementById('myVideo');
  if (video.paused) return false;

  const danmuLimit = document.getElementById('danmuLimit');
  if (!danmuLimit) return false;
  const maxActive = parseInt(danmuLimit.value);

  if (activeDanmus.length >= maxActive) {
    danmuBuffer.push({ text, color, size, time: danmuTime });
    return false;
  }

  const now = Date.now();
  if (now - lastDanmuTime < densityInterval) return false;

  // 创建弹幕元素
  const danmu = document.createElement('div');
  danmu.className = 'danmu'; // 初始无暂停类
  temp.innerHTML = text;
  danmu.innerText = temp.value;
  danmu.style.color = color;

  const danmuSize = document.getElementById('danmuSize');
  const customSize = danmuSize ? parseInt(danmuSize.value) : size;
  danmu.style.fontSize = `${customSize}px`;

  const danmuOpacity = document.getElementById('danmuOpacity');
  if (danmuOpacity) {
    danmu.style.opacity = danmuOpacity.value;
  }

  // 获取高度并设置垂直位置
  danmu.style.visibility = 'hidden';
  danmuContainer.appendChild(danmu);
  const top = getNonOverlappingLine();
  if (top < 0) {
    danmuBuffer.push({ text, color, size, time: danmuTime });
    return false;
  }
  danmu.style.top = `${top}px`;
  danmu.style.visibility = 'visible';

  // 计算动画参数（与视频时间绑定）
  const containerWidth = window.innerWidth;
  const speedMultiplier = parseFloat(document.getElementById('danmuSpeed').value) || 1;
  const actualSpeed = BASE_SPEED * speedMultiplier;
  const totalDuration = (containerWidth + danmu.offsetWidth) / actualSpeed; // 总滚动时间（秒）

  // 关键：计算已滚动时间和剩余时间
  const elapsedTime = currentVideoTime - danmuTime; // 已滚动时间（秒）
  const animationDelay = Math.max(0, -elapsedTime).toFixed(1); // 延迟（未到出现时间）
  const remainingDuration = Math.max(0, totalDuration).toFixed(1); // 剩余滚动时间

  // 应用 move linear 动画
  danmu.style.animation = `move linear ${remainingDuration}s ${animationDelay}s forwards`;

  // 存储关键信息（用于恢复位置）
  danmu.dataset.danmuTime = danmuTime; // 弹幕出现时间
  danmu.dataset.totalDuration = totalDuration; // 总滚动时间
  danmu.dataset.speedMultiplier = speedMultiplier; // 速度倍率
  danmu.dataset.animationParams = `${remainingDuration}s ${animationDelay}s`; // 动画参数备份

  activeDanmus.push(danmu);
  lastDanmuTime = now;

  // 动画结束移除
  danmu.addEventListener('animationend', () => {
    danmu.remove();
    activeDanmus = activeDanmus.filter(d => d !== danmu);
    processBuffer();
  });

  return true;
}

function processBuffer() {
  if (danmuBuffer.length === 0) return;

  const video = document.getElementById('myVideo');
  if (video.paused) return;
  const now = Date.now();
  const currentTime = video.currentTime;

  if (now - lastDanmuTime >= densityInterval) {
    if (getNonOverlappingLine() !== -1 && danmuBuffer.length > 0) {

      const MAX_BUFFER_SIZE = 200;
      if (danmuBuffer.length > MAX_BUFFER_SIZE) {
        danmuBuffer.splice(0, Math.floor(danmuBuffer.length / 2));
      }

      var nextDanmu = danmuBuffer.pop();

      if (nextDanmu && createDanmu(nextDanmu, currentTime)) {
        lastDanmuTime = now;
      }
    }
  }

  if (danmuBuffer.length > 0 && !bufferTimer) {
    const delay = Math.max(0, densityInterval - (now - lastDanmuTime));
    bufferTimer = setTimeout(() => {
      bufferTimer = null;
      processBuffer();
    }, delay);
  }
}

function resetDanmusByTime(currentTime) {
  // 清理旧弹幕
  danmuContainer.innerHTML = '';
  activeDanmus = [];

  // 关键：清空并重置缓冲区
  danmuBuffer = [];
  if (bufferTimer) {
    clearTimeout(bufferTimer);
    bufferTimer = null;
  }

  // 重置显示状态
  danmus.forEach(d => {
    d.shown = false;
  });

  // 重新计算行位置和密度（确保使用最新设置）
  updateLinePositions();
  updateDensity();

  // 重新触发弹幕，使用最新的时间参数
  triggerDanmus(currentTime);
  lastDanmuTime = 0;
}

function triggerDanmus(currentTime) {
  if (!danmus.length || !isDanmuEnabled || !danmuContainer) return;

  const video = document.getElementById('myVideo');
  if (video.paused) return;

  const speedMultiplier = parseFloat(document.getElementById('danmuSpeed').value) || 1;
  const actualSpeed = BASE_SPEED * speedMultiplier;
  const containerWidth = window.innerWidth;
  const totalDuration = containerWidth / actualSpeed;

  // 计算合理的时间窗口：只包含应该显示或即将显示的弹幕
  const timeWindowStart = currentTime - 2; // 允许2秒内已经出现的弹幕（避免刚拖动就消失）
  const timeWindowEnd = currentTime; // 加上1秒缓冲

  // 只添加当前时间窗口内的弹幕
  danmus.forEach(d => {
    const isActive = d.time >= timeWindowStart && d.time <= timeWindowEnd;
    if (!d.shown && isActive) {
      danmuBuffer.push(d);
      d.shown = true;
    }
  });

  // 按时间排序缓冲区，确保弹幕按正确顺序显示
  danmuBuffer.sort((a, b) => a.time - b.time);

  processBuffer();
}

// 暂停/恢复弹幕（与隐藏类兼容）
window.pauseDanmus = function () {
  activeDanmus.forEach(danmu => {
    danmu.classList.add('danmu-paused');
    // 即使隐藏，暂停状态也生效
  });
};

window.resumeDanmus = function () {
  activeDanmus.forEach(danmu => {
    danmu.classList.remove('danmu-paused');
    // 恢复时无论是否隐藏，动画都继续运行
  });
};

// 2. 修复关闭再开启弹幕复位问题
window.danmu_add_class = function () {
  if (!danmuContainer) return;

  if (isDanmuEnabled) {
    // 显示弹幕：移除隐藏类，保持动画状态
    activeDanmus.forEach(danmu => {
      danmu.classList.remove('danmu-hidden');
    });
  } else {
    // 隐藏弹幕：添加隐藏类（仅透明，动画继续）
    activeDanmus.forEach(danmu => {
      danmu.classList.add('danmu-hidden');
    });
  }
};

window.updateDanmuAnimationSpeed = function () {
  updateDensity();
  const currentTime = document.getElementById('myVideo').currentTime;
  resetDanmusByTime(currentTime);
};

window.updateDanmuOpacity = function () {
  if (!danmuContainer) return;
  const opacity = document.getElementById('danmuOpacity').value;
  activeDanmus.forEach(danmu => {
    danmu.style.opacity = opacity;
  });
};

// 视频事件监听
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('myVideo');
  if (video) {
    video.addEventListener('timeupdate', () => {
      if (!danmuContainer) return;
      triggerDanmus(video.currentTime);
    });

    // 暂停时触发弹幕暂停
    video.addEventListener('pause', () => {
      window.pauseDanmus();
    });

    // 播放时恢复弹幕
    video.addEventListener('play', () => {
      window.resumeDanmus();
    });

    video.addEventListener('seeked', () => {
      resetDanmusByTime(video.currentTime);
    });
  }
});