const video = document.getElementById('myVideo');
const videoList = document.getElementById('videoList');
const folderInput = document.getElementById('folderInput');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const toggleDanmuSettings = document.getElementById('toggleDanmuSettings');
const danmuSettings = document.getElementById('danmuSettings');
const videoPanel = document.getElementById('video-panel');
const volumeControl = document.getElementById('volume');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle'); // 1. 进度条圆点
const timeDisplay = document.getElementById('timeDisplay');
const toggleDanmu = document.getElementById('toggleDanmu');
const videoTitle = document.getElementById('videoTitle');
const playbackSpeed = document.getElementById('playbackSpeed');
const container = document.getElementById('container');
const videoTopArea = document.getElementById('videoTopArea');
const videoBottomArea = document.getElementById('videoBottomArea');

// 彈幕設置控件
const danmuSpeed = document.getElementById('danmuSpeed');
const speedValue = document.getElementById('speedValue');
const danmuSize = document.getElementById('danmuSize');
const sizeValue = document.getElementById('sizeValue');
const danmuOpacity = document.getElementById('danmuOpacity');
const opacityValue = document.getElementById('opacityValue');
const danmuRange = document.getElementById('danmuRange');
const rangeValue = document.getElementById('rangeValue');
const danmuLimit = document.getElementById('danmuLimit');
const limitValue = document.getElementById('limitValue');

let videos = [];
let isDanmuPaused = false;
let isDanmuEnabled = true;
let danmuContainer;
let hideControlsTimer;
let isDragging = false; // 2. 拖動狀態標記
const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());

const saved_isDanmuEnabled = localStorage.getItem("isDanmuEnabled") === null 
    ? true 
    : localStorage.getItem("isDanmuEnabled") === "true";
const saved_volume        = parseFloat(localStorage.getItem("volume")) || 1.0;   // 預設音量 1.0
const saved_danmuSpeed    = parseFloat(localStorage.getItem("danmuSpeed")) || 1.0; // 預設 1.0 倍速
const saved_danmuSize     = parseFloat(localStorage.getItem("danmuSize")) || 24;  // 預設 1.0 倍大小
const saved_danmuOpacity  = parseFloat(localStorage.getItem("danmuOpacity")) || 1.0; // 預設不透明
const saved_danmuRange    = parseFloat(localStorage.getItem("danmuRange")) || 75;   // 預設3/4螢幕範圍
const saved_danmuLimit    = parseInt(localStorage.getItem("danmuLimit")) || 100;    //預設50
// 初始化
document.addEventListener('DOMContentLoaded', () => {
  danmuContainer = document.getElementById('danmu-container');
  volumeControl.value=saved_volume;
  danmuSpeed.value=saved_danmuSpeed;
  danmuSize.value=saved_danmuSize;
  danmuOpacity.value=saved_danmuOpacity;
  danmuRange.value=saved_danmuRange;
  danmuLimit.value=saved_danmuLimit;
  isDanmuEnabled=saved_isDanmuEnabled;
  volumeControl.style.background = `linear-gradient(to right, #888 ${volumeControl.value*100}%, #333 ${volumeControl.value*100}%)`;
  toggleDanmu.textContent = `彈幕: ${isDanmuEnabled ? '開' : '關'}`;
  const speed = parseFloat(danmuSpeed.value).toFixed(1);
  speedValue.textContent = `${speed}x`;
  sizeValue.textContent = `${danmuSize.value}px`;
  const opacity = parseFloat(danmuOpacity.value);
  const percent = Math.round(opacity * 100);
  opacityValue.textContent = `${percent}%`;
  rangeValue.textContent = `${danmuRange.value}%`;
  limitValue.textContent = `${danmuLimit.value}條`;
  updateOpacityDisplay();
  initKeyboardShortcuts();
  playPauseBtn.addEventListener('click', togglePlayPause);
  initVideoControlAreas();
  
  // 2. 初始化进度条拖動功能
  initProgressBarDrag();
});

// 初始化时确保鼠标移动事件正确绑定
function initVideoControlAreas() {
  // 初始状态显示控制区和鼠标
  showControlAreas();
  
  // 绑定鼠标移动事件 - 确保事件冒泡正确触发
  videoPanel.addEventListener('mousemove', handleMouseMovement);
  document.addEventListener('mousemove', (e) => {
    // 当鼠标在视频面板外但在容器内时也触发显示
    if (container.contains(e.target) && !videoPanel.contains(e.target)) {
      showControlAreas();
      hideControlsTimer = setTimeout(hideControlAreas, 1500);
    }
  });
  
  // 上下区域点击不触发视频播放
  videoTopArea.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  videoBottomArea.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// 2. 初始化进度条拖動功能
function initProgressBarDrag() {
  // 鼠标按下
  progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    progressBar.classList.add('dragging');
    updateProgressFromMouse(e);
    showControlAreas(); // 拖動時顯示控制區
    e.preventDefault(); // 阻止默认行为
    e.stopPropagation(); // 阻止事件冒泡
  });
  
  // 鼠标移动（全局监听，确保拖出进度条也能响应）
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      updateProgressFromMouse(e);
      e.preventDefault(); // 防止選中文字等默認行為
    }
  });
  
  // 鼠标释放
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      progressBar.classList.remove('dragging');
    }
  });
  
  // 点击进度条跳转（保持点击功能）
  progressBar.addEventListener('click', updateProgressFromMouse);
}

// 2. 根据鼠标位置更新进度
function updateProgressFromMouse(e) {
  const rect = progressBar.getBoundingClientRect();
  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); // 限制在0-1之间
  const newTime = pos * (video.duration || 0);
  
  // 更新视频进度
  video.currentTime = newTime;
  
  // 手动更新进度条更新时间显示显示（避免视频timeupdate延迟）
  progressFill.style.width = `${pos * 100}%`;
  progressHandle.style.left = `${pos * 100}%`;
  
  // 更新时间显示
  const currentTime = formatTime(newTime);
  const duration = video.duration ? formatTime(video.duration) : '00:00';
  timeDisplay.textContent = `${currentTime} / ${duration}`;
  
  if (window.resetDanmusByTime) {
    window.resetDanmusByTime(newTime);
  }
}

// 处理鼠标移动显示控制区域和鼠标
function handleMouseMovement(e) {
  clearTimeout(hideControlsTimer);
  showControlAreas();
  
  hideControlsTimer = setTimeout(hideControlAreas, 1500);
}
// 额外添加侧边栏内部鼠标移动监听（增强兼容性）
sidebar.addEventListener('mousemove', (e) => {
  // 当鼠标在侧边栏内时，强制显示控制区
  showControlAreas();
  clearTimeout(hideControlsTimer);
});

function showControlAreas() {
  videoTopArea.classList.remove('hidden');
  videoBottomArea.classList.remove('hidden');
  videoPanel.style.cursor = 'default'; // 恢复鼠标显示
}

// 隐藏上下区域并隐藏鼠标
function hideControlAreas() {
  videoTopArea.classList.add('hidden');
  videoBottomArea.classList.add('hidden');
  danmuSettings.style.display="none";
  videoPanel.style.cursor = 'none'; // 隐藏鼠标
}

// 播放/暫停切換
function togglePlayPause() {
  if (video.paused) {
    video.play();
    playPauseBtn.textContent = '❚❚';
  } else {
    video.pause();
    playPauseBtn.textContent = '▶';
  }
}
let lastClick = 0;
const doubleClickDelay = 300; // 双击时间阈值(ms)
let clickTimer = null;
// 點擊影片播放/暫停
video.addEventListener('pointerdown',(e)=>{
  const now = Date.now();

  // 判断是否在阈值内连续点击
  if (now - lastClick < doubleClickDelay) {
    if(isMobile){
      e.preventDefault();
      e.stopPropagation();
      clearTimeout(clickTimer);
      togglePlayPause();
      handleMouseMovement();
    }
    lastClick = 0; // 重置避免多击
  } else {
    lastClick = now;
  }
  if(!isMobile){
    togglePlayPause();
    handleMouseMovement();
  }else if(lastClick>0){
    e.preventDefault();
    e.stopPropagation();
    clickTimer = setTimeout(()=>{
      if(videoBottomArea.classList.contains('hidden')){
        showControlAreas();
        console.log(2);
        handleMouseMovement();
      }
      else{
        console.log(1);
        hideControlAreas();
      }
    },doubleClickDelay);
  }
});

// 側邊欄切換
toggleSidebarBtn.addEventListener('click', ()=>{
  sidebar.classList.toggle('expanded');
  updateVideoPanelWidth();
  //updateDanmuContainerSize();
  showControlAreas();
});

// 手動更新video-panel寬度
function updateVideoPanelWidth() {
  if (sidebar.classList.contains('expanded')) {
    videoPanel.style.width = 'calc(100vw - 300px)';
  } else {
    videoPanel.style.width = '100vw';
  }
}

// 倍速控制
playbackSpeed.addEventListener('change', ()=>{
  video.playbackRate = parseFloat(playbackSpeed.value);
});

// 视频播放时的处理
video.addEventListener('play', ()=>{
  playPauseBtn.textContent = '❚❚';
  // 播放时启动隐藏计时器（但鼠标一动就会立即显示）
  hideControlsTimer = setTimeout(hideControlAreas, 1500);
});

// 视频暂停时强制显示鼠标和控制区
video.addEventListener('pause', ()=>{
  playPauseBtn.textContent = '▶';
  showControlAreas(); // 暂停时显示控制区和鼠标
});

// 1. 進度條更新（包含圓點位置）
video.addEventListener('timeupdate', updateProgress);

function updateProgress() {
  if (!progressFill || isDragging) return; // 拖動時跳過自動更新
  
  const percent = (video.currentTime / (video.duration || 1)) * 100;
  progressFill.style.width = `${percent}%`;
  progressHandle.style.left = `${percent}%`; // 1. 更新圓點位置
  
  const currentTime = formatTime(video.currentTime);
  const duration = video.duration ? formatTime(video.duration) : '00:00';
  timeDisplay.textContent = `${currentTime} / ${duration}`;
}

// 時間格式化
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

volumeControl.addEventListener('keydown', (e)=>{
  e.preventDefault();
});
// 音量控制
volumeControl.addEventListener('input',updateVolume);
function updateVolume(){
  video.volume = volumeControl.value;
  volumeControl.style.background = `linear-gradient(to right, #888 ${volumeControl.value*100}%, #333 ${volumeControl.value*100}%)`;
  showControlAreas();
  save_status();
}

// 彈幕開關
toggleDanmu.addEventListener('click', toggleDanmuDisplay);

function toggleDanmuDisplay() {
  isDanmuEnabled = !isDanmuEnabled;
  toggleDanmu.textContent = `彈幕: ${isDanmuEnabled ? '開' : '關'}`;
  
  // 保存状态到全局，供danmu.js使用
  window.isDanmuEnabled = isDanmuEnabled;
  window.danmu_add_class();
  save_status();
}

// 全屏功能
fullscreenBtn.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
    fullscreenBtn.textContent = '退出全屏';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    fullscreenBtn.textContent = '全螢幕';
  }
  showControlAreas();
}

// 監聽全屏狀態變化
document.addEventListener('fullscreenchange', updateFullscreenUI);
document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

function updateFullscreenUI() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    fullscreenBtn.textContent = '退出全屏';
  } else {
    fullscreenBtn.textContent = '全螢幕';
  }
  updateVideoPanelWidth();
  //updateDanmuContainerSize();
}

// 彈幕設置面板切換
toggleDanmuSettings.addEventListener('click', ()=>{
  danmuSettings.style.display = danmuSettings.style.display === 'block' ? 'none' : 'block';
  showControlAreas();
});

// 同步設置值顯示
danmuSpeed.addEventListener('input', ()=>{
  const speed = parseFloat(danmuSpeed.value).toFixed(1);
  speedValue.textContent = `${speed}x`;
  updateDanmuAnimationSpeed();
  save_status();
});

danmuSize.addEventListener('input', ()=>{
  sizeValue.textContent = `${danmuSize.value}px`;
  save_status();
});

danmuOpacity.addEventListener('input',()=>{
  updateOpacityDisplay();
  save_status();
});

function updateOpacityDisplay() {
  const opacity = parseFloat(danmuOpacity.value);
  const percent = Math.round(opacity * 100);
  opacityValue.textContent = `${percent}%`;
  if (window.updateDanmuOpacity) {
    updateDanmuOpacity();
  }
}

danmuRange.addEventListener('input', ()=>{
  rangeValue.textContent = `${danmuRange.value}%`;
  save_status();
});

danmuLimit.addEventListener('input', ()=>{
  limitValue.textContent = `${danmuLimit.value}條`;
  updateDanmuAnimationSpeed();
  save_status();
});

folderInput.addEventListener('change', (e)=>{
  if (!e.target.files || e.target.files.length === 0) {
    // 用户取消选择或未选择任何文件，不执行任何操作
    return;
  }
  videos = [];
  videoList.innerHTML='';
  const files = Array.from(e.target.files);
  
  const mp4Files = files.filter(f => f.name.endsWith('.mp4'));
  mp4Files.forEach(mp4=>{
    const xml = files.find(f=>f.name.replace('.xml','')===mp4.name.replace('.mp4','') && f.name.endsWith('.xml'));
    videos.push({mp4, xml});
    const li = document.createElement('li');
    li.innerText = mp4.name;
    li.addEventListener('click', ()=>{
      playVideo({mp4, xml});
    });
    videoList.appendChild(li);
  });
});

// 视频加载时确保弹幕容器可见
function playVideo({mp4, xml}){
  const url = URL.createObjectURL(mp4);
  video.src = url;
  window.isDanmuEnabled = isDanmuEnabled;
  window.danmuContainer = danmuContainer;
  video.play().then(()=>{
    playPauseBtn.textContent = '❚❚';
    const title = mp4.name.replace('.mp4', '');
    videoTitle.textContent = title;
    showControlAreas();
  }).catch(err => console.log('播放失敗:', err));
  if(xml){
    // 确保loadDanmuXML函数可用
    if (window.loadDanmuXML) {
      window.loadDanmuXML(xml);
    } else {
      console.error('loadDanmuXML函数未定义');
    }
  }else{
    window.clearDanmus && window.clearDanmus();
  }
}
function updateDanmuContainerSize() {
  if (danmuContainer) {
    danmuContainer.style.width = `${videoPanel.offsetWidth}px`;
    danmuContainer.style.height = `${videoPanel.offsetHeight}px`;
  }
}
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.target!=volumeControl)&&(e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) {
      return;
    }

    switch(e.key) {
      case ' ':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowRight':
        e.preventDefault();
        video.currentTime = Math.min(video.currentTime + 5, video.duration || 0);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        video.currentTime = Math.max(video.currentTime - 5, 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        volumeControl.value = Math.min(1, Number(volumeControl.value) + 0.05);
        updateVolume();
        break;
      case 'ArrowDown':
        e.preventDefault();
        volumeControl.value = Math.max(0, Number(volumeControl.value) - 0.05);
        updateVolume();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'd':
      case 'D':
        e.preventDefault();
        toggleDanmuDisplay();
        break;
      case 'Tab':
        e.preventDefault();
        break;
    }
  });
}
function save_status(){
  localStorage.setItem("isDanmuEnabled", isDanmuEnabled);
  localStorage.setItem("volume", volumeControl.value);
  localStorage.setItem("danmuSpeed", danmuSpeed.value);
  localStorage.setItem("danmuSize", danmuSize.value);
  localStorage.setItem("danmuOpacity", danmuOpacity.value);
  localStorage.setItem("danmuRange", danmuRange.value);
  localStorage.setItem("danmuLimit", danmuLimit.value);
}