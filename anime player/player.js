const video = document.getElementById('myVideo');
const videoList = document.getElementById('videoList');
const customFileBtn = document.getElementById('customFileBtn');
const fileNumber = document.getElementById('fileNumber');
const folderInput = document.getElementById('folderInput');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const toggleDanmuSettings = document.getElementById('toggleDanmuSettings');
const danmuSettings = document.getElementById('danmuSettings');
const videoPanel = document.getElementById('video-panel');
const volumeControl = document.getElementById('volume');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const skipTimeShow = document.getElementById('skipTimeShow');
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
let isDraggingBar = false;
let canDraggingVideo=false,
    isDraggingVideo = false,
    DraggingVideoX=null,
    skippingTime=0;
let hasWatchedVideos={};
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
const save_hasWatchedVideos = JSON.parse(localStorage.getItem("hasWatchedVideos")) || {};    //預設{}
// 初始化
document.addEventListener('DOMContentLoaded', () => {
  danmuContainer = document.getElementById('danmu-container');
  volumeControl.value=saved_volume;
  danmuSpeed.value=saved_danmuSpeed;
  danmuSize.value=saved_danmuSize;
  danmuOpacity.value=saved_danmuOpacity;
  danmuRange.value=saved_danmuRange;
  danmuLimit.value=saved_danmuLimit;
  hasWatchedVideos=save_hasWatchedVideos;
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
  videos = [];
  videoList.innerHTML='';
  updateOpacityDisplay();
  initKeyboardShortcuts();
  initVideoControlAreas();
  initProgressBarDrag();
  initVideoPause();
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
  //in container
  progressContainer.addEventListener('pointerdown', (e) => {
    isDraggingBar = true;
    updateProgressFromMouse(e);
    handleMouseMovement();
    e.preventDefault(); // 阻止默认行为
    e.stopPropagation(); // 阻止事件冒泡
  });
  video.addEventListener('pointerdown', (e) => {
    if(isDraggingBar||!isMobile)return;
    const rect = video.getBoundingClientRect();
    DraggingVideoX=e.clientX - rect.left;
    const yPercent = (e.clientY - rect.top) / rect.height;
    if (yPercent < 0.2 || yPercent > 0.8) {
      return;
    }
    canDraggingVideo=true;
  });
  video.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // 阻止右键菜单（桌面端）和长按菜单（移动端）
    e.stopPropagation();
  });
  video.addEventListener('pointermove', (e) => {
    if(!canDraggingVideo)return;
    const rect = video.getBoundingClientRect();
    let newx=e.clientX - rect.left;
    if(isDraggingVideo==false&&Math.abs(newx-DraggingVideoX)<20)return;
    isDraggingVideo=true;
    skipTimeShow.style.opacity=1;
    if(!video.paused)togglePlayPause();
    e.preventDefault();
    e.stopPropagation();
    updateProgressFromTouch(e);
    handleMouseMovement();
  });
  video.addEventListener('pointerup', (e) => {
    if(isDraggingVideo){
      isDraggingVideo=false;
      video.currentTime=video.currentTime+skippingTime;
      skipTimeShow.style.opacity=0;
      togglePlayPause();
    }
    canDraggingVideo=false;
  });
  document.addEventListener('pointermove', (e) => {
    if (isDraggingBar) {
      e.preventDefault();
      updateProgressFromMouse(e);
      handleMouseMovement();
    }
  });
  document.addEventListener('pointerup', () => {
    isDraggingBar = false;
    isDraggingVideo = false;
  });
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
  
}
function updateProgressFromTouch(e) {
  const rect = video.getBoundingClientRect();
  let newx=e.clientX - rect.left;
  const xpos = Math.max(0, Math.min(1, (Math.abs(newx-DraggingVideoX)) / rect.width)); // 限制在0-1之间
  const t = xpos * 120;
  if(newx-DraggingVideoX>0){
    if(video.currentTime+t>video.duration){
      skippingTime=video.duration-video.currentTime;
    }else{
      skippingTime=t;
    }
  }else{
    if(video.currentTime-t<0){
      skippingTime=-video.currentTime;
    }else{
      skippingTime=-t;
    }
  }
  const newTime=video.currentTime+skippingTime
  const pos = Math.max(0, Math.min(1, newTime/ (video.duration || 1))); // 限制在0-1之间

  // 手动更新进度条更新时间显示显示（避免视频timeupdate延迟）
  progressFill.style.width = `${pos * 100}%`;
  progressHandle.style.left = `${pos * 100}%`;
  
  // 更新时间显示
  const currentTime = formatTime(newTime);
  const duration = video.duration ? formatTime(video.duration) : '00:00';
  timeDisplay.textContent = `${currentTime} / ${duration}`;
  skipTimeShow.textContent = `${currentTime} / ${duration}\n${(skippingTime>=0)?'+':'-'}${formatTime(Math.abs(skippingTime))}`;
  
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
function initVideoPause(){
  playPauseBtn.addEventListener('click', togglePlayPause);
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
          handleMouseMovement();
        }
        else{
          hideControlAreas();
        }
      },doubleClickDelay);
    }
  });
}

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
video.addEventListener('timeupdate',()=>{
  updateProgress();
  const li=videoList.querySelector('.playing');
  let d=video.duration;
  let t=video.currentTime;
  if(isNaN(d))return;
  if(t/d>0.9){
    li.classList.add('finished');
  }else{
    li.classList.remove('finished');
  }
  li.innerText = `${li.name}\n${formatTime(t)} / ${formatTime(d)}`;
  hasWatchedVideos[video.name].time=video.currentTime;
  localStorage.setItem("hasWatchedVideos", JSON.stringify(hasWatchedVideos));
});

function updateProgress() {
  if (!progressFill || isDraggingBar) return; // 拖動時跳過自動更新
  
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
  handleMouseMovement();
  save_status();
});

danmuSize.addEventListener('input', ()=>{
  sizeValue.textContent = `${danmuSize.value}px`;
  handleMouseMovement();
  save_status();
});

danmuOpacity.addEventListener('input',()=>{
  updateOpacityDisplay();
  handleMouseMovement();
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
  handleMouseMovement();
  save_status();
});

danmuLimit.addEventListener('input', ()=>{
  limitValue.textContent = `${danmuLimit.value}條`;
  updateDanmuAnimationSpeed();
  handleMouseMovement();
  save_status();
});
function checkVideoSupport(videoFile) {
  const tempVideo = document.createElement('video');
  // 检测 MIME 类型支持度（返回 ""、"maybe"、"probably"）
  const support = tempVideo.canPlayType(videoFile.type);
  // "probably" 表示高度支持，"maybe" 表示可能支持，"" 表示不支持
  return support !== "";
}
customFileBtn.addEventListener('click', () => {
  folderInput.click();
});
folderInput.addEventListener('change', (e)=>{
  if (!e.target.files || e.target.files.length === 0) {
    // 用户取消选择或未选择任何文件，不执行任何操作
    return;
  }
  const files = Array.from(e.target.files);
  console.log(files);
  const vidFiles = files.filter(f => f.type.startsWith('video/'));
  vidFiles.forEach(vid=>{
    if (!checkVideoSupport(vid))return;
    const isDuplicate = videos.some(item => {
      return item.vid.name === vid.name;
    });
    if(isDuplicate)return;
    const xml = files.find(f=>f.name.replace('.xml','')===vid.name.replace('.mp4','') && f.name.endsWith('.xml'));
    videos.push({vid, xml});
    const li = document.createElement('li');
    li.name=vid.name;
    li.innerText = vid.name;
    if(hasWatchedVideos.hasOwnProperty(vid.name)){
      let d=hasWatchedVideos[vid.name].duration;
      let t=hasWatchedVideos[vid.name].time;
      if(t/d>0.9){
        li.classList.add('finished');
      }
      li.innerText = `${li.name}\n${formatTime(t)} / ${formatTime(d)}`;
    }
    li.addEventListener('click', ()=>{
      if(li.classList.contains('playing'))return;
      videoList.querySelectorAll('li').forEach(item => {
        item.classList.remove('playing');
      });
      li.classList.add("playing");
      playVideo({vid, xml});
    });
    videoList.appendChild(li);
    fileNumber.innerText=`${videoList.querySelectorAll("li").length} videos`;
  });
});

// 视频加载时确保弹幕容器可见
function playVideo({vid, xml}){
  const url = URL.createObjectURL(vid);
  video.src = url;
  video.name=vid.name;
  window.isDanmuEnabled = isDanmuEnabled;
  window.danmuContainer = danmuContainer;
  video.play().then(()=>{
    playPauseBtn.textContent = '❚❚';
    const title = vid.name.replace(/\.[^.]*$/, '');
    videoTitle.textContent = title;
    sidebar.classList.toggle('expanded');
    updateVideoPanelWidth();
    showControlAreas();
    if(hasWatchedVideos.hasOwnProperty(vid.name)){
      video.currentTime=hasWatchedVideos[vid.name].time;
    }else{
      hasWatchedVideos[vid.name]={
        time:0,
        duration:video.duration
      };
    }
    save_status();
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
  localStorage.setItem("hasWatchedVideos", JSON.stringify(hasWatchedVideos));
}