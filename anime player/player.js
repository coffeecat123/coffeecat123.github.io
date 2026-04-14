const video = document.getElementById('myVideo');
const videoList = document.getElementById('videoList');
const videoInfo = document.getElementById('info');
const customFileBtn = document.getElementById('customFileBtn');
const fileNumber = document.getElementById('fileNumber');
const folderInput = document.getElementById('folderInput');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const toggleDanmuSettings = document.getElementById('toggleDanmuSettings');
const danmuSettings = document.getElementById('danmuSettings');
const videoPanel = document.getElementById('video-panel');
const volumeInput = document.getElementById('volume_input');
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
const flsc_btn1 = document.getElementById('flsc_btn1');
const flsc_btn2 = document.getElementById('flsc_btn2');
const volume_max = document.getElementById('volume_max');
const volume_mid = document.getElementById('volume_mid');
const volume_min = document.getElementById('volume_min');
const volume_btn = document.getElementById('volume_btn');
const volume_bar = document.getElementById('volume_bar');
const volumeControl = document.getElementById('volume-control');
const nameEl = videoInfo.querySelector('.video-name');
const pathEl = videoInfo.querySelector('.video-path');
const widthEl = videoInfo.querySelector('.video-width');
const heightEl = videoInfo.querySelector('.video-height');
const sizeEl = videoInfo.querySelector('.video-size');
const durationEl = videoInfo.querySelector('.video-duration');
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

let currentVideoUrl = null;
let videos = [];
let isDanmuPaused = false;
let isDanmuEnabled = true;
let isMuted = false;
let volume = 1.0;
let danmuContainer;
let hideControlsTimer;
let isDraggingBar = false;
let canDraggingVideo = false,
  isDraggingVideo = false,
  DraggingVideoX = null,
  skippingTime = 0,
  hideVolumeBarTimer = null,
  isPointerInVolumeBar = false;
let hasWatchedVideos = {};

const saved_isDanmuEnabled = (localStorage.getItem("isDanmuEnabled") ?? "true") === "true";
const saved_isMuted = localStorage.getItem("isMuted") === "true";
const saved_volume = parseFloat(localStorage.getItem("volume")) || 1.0;   // 預設音量 1.0
const saved_danmuSpeed = parseFloat(localStorage.getItem("danmuSpeed")) || 1.0; // 預設 1.0 倍速
const saved_danmuSize = parseFloat(localStorage.getItem("danmuSize")) || 24;  // 預設 1.0 倍大小
const saved_danmuOpacity = parseFloat(localStorage.getItem("danmuOpacity")) || 1.0; // 預設不透明
const saved_danmuRange = parseFloat(localStorage.getItem("danmuRange")) || 75;   // 預設3/4螢幕範圍
const saved_danmuLimit = parseInt(localStorage.getItem("danmuLimit")) || 100;    //預設50
const save_hasWatchedVideos = JSON.parse(localStorage.getItem("hasWatchedVideos")) || {};    //預設{}
// 初始化
document.addEventListener('DOMContentLoaded', () => {
  danmuContainer = document.getElementById('danmu-container');
  volume = saved_volume;
  danmuSpeed.value = saved_danmuSpeed;
  danmuSize.value = saved_danmuSize;
  danmuOpacity.value = saved_danmuOpacity;
  danmuRange.value = saved_danmuRange;
  danmuLimit.value = saved_danmuLimit;
  hasWatchedVideos = save_hasWatchedVideos;
  isDanmuEnabled = saved_isDanmuEnabled;
  isMuted = saved_isMuted;
  video.muted = isMuted;
  updateVolumeControl();
  toggleDanmu_btn(isDanmuEnabled);
  const speed = parseFloat(danmuSpeed.value);
  speedValue.textContent = `${speed.toFixed(1)}x`;
  updateInputBG(danmuSpeed);
  const size = parseFloat(danmuSize.value);
  sizeValue.textContent = `${size}px`;
  updateInputBG(danmuSize);
  const opacity = parseFloat(danmuOpacity.value);
  opacityValue.textContent = `${Math.round(opacity * 100)}%`;
  updateInputBG(danmuOpacity);
  rangeValue.textContent = `${danmuRange.value}%`;
  updateInputBG(danmuRange);
  limitValue.textContent = `${danmuLimit.value}`;
  updateInputBG(danmuLimit);
  videos = [];
  videoList.innerHTML = '';
  window.updateDanmuOpacity();
  initKeyboardShortcuts();
  initVideoControlAreas();
  initProgressBarDrag();
  initVideoPause();
  initOtherEvents();
  initDragAndDrop();
});

function initDragAndDrop() {
  const dropZone = videoList.parentElement;
  let li = null;
  let dragCounter = 0;

  // 封裝移除動畫的邏輯
  const removeLiWithAnimation = (targetLi) => {
    if (!targetLi) return;
    targetLi.classList.add('collapsed');

    // 監聽動畫結束事件
    targetLi.addEventListener('transitionend', () => {
      if (targetLi.parentNode === videoList) {
        videoList.removeChild(targetLi);
      }
    }, { once: true }); // 確保只執行一次
  };

  dropZone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;

    if (dragCounter === 1) {
      // 如果剛好正在「消失中」，就直接移除舊的重新創一個，或移除 collapsed
      if (li && videoList.contains(li)) {
        li.classList.remove('collapsed');
      } else {
        li = document.createElement('li');
        li.classList.add('dropping');
        li.innerText = "+";
        videoList.appendChild(li);
        requestAnimationFrame(() => {
          // 取得父容器（有捲軸的那一個，假設是 sidebar 或 videoList.parentElement）
          const container = videoList.parentElement;

          // 滾動到容器的總高度
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        });
      }
    }
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;

    if (dragCounter === 0) {
      removeLiWithAnimation(li);
      li = null; // 清空引用，下次進入創新的
    }
  });

  dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dragCounter = 0;

    removeLiWithAnimation(li);
    li = null;

    const allFiles = [];

    const items = [...e.dataTransfer.items];

    for (const item of items) {
      if (item.kind !== 'file') continue;

      // 優先用標準 getAsFile()（對單檔最可靠）
      const file = item.getAsFile();
      if (file && file.size > 0) {
        allFiles.push(file);
        continue;
      }

      // 備用：如果需要支援資料夾，才用 webkitGetAsEntry
      const entry = item.webkitGetAsEntry?.();
      if (entry) {
        await readEntry(entry, allFiles);
      }
    }

    handleFiles(allFiles);
  });

  // 修改 readEntry，讓它接收 allFiles 並處理 Promise
  async function readEntry(entry, allFiles) {
    console.log("讀取項目：", entry);

    if (entry.isFile) {
      // 這裡改用 Promise 包裝，但 file:// 下仍有風險
      await new Promise((resolve, reject) => {
        entry.file(
          (f) => {
            allFiles.push(f);
            resolve();
          },
          (err) => {
            console.error("entry.file 失敗：", err);
            reject(err);
          }
        );
      });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();

      await new Promise(resolve => {
        const readBatch = () => {
          reader.readEntries(async (entries) => {
            if (entries.length === 0) {
              resolve();
              return;
            }
            for (const sub of entries) {
              await readEntry(sub, allFiles);
            }
            readBatch(); // 遞迴讀下一批
          }, (err) => {
            console.error("readEntries 錯誤：", err);
            resolve(); // 避免完全卡死
          });
        };
        readBatch();
      });
    }
  }
  dropZone.addEventListener('dragover', e => e.preventDefault());
}

function initOtherEvents() {
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      console.log("頁面重新獲得焦點，檢查影片狀態...");
      console.log("readyState:", video.readyState, "paused:", video.paused);

      // 檢查影片是否處於「播放狀態但畫面不動」的詭異情況
      if (video.readyState < 2) {
        console.log("偵測到分頁喚醒，執行強制恢復機制...");

        // 先暫停再播放，觸發瀏覽器的引擎重新檢查狀態
        video.pause();

        // 嘗試重新非同步播放
        video.play().then(() => {
          console.log("喚醒成功");
        }).catch(err => {
          // 如果連 play 都失敗，這時才考慮使用 load() 作為最後手段
          console.log("播放喚醒失敗，嘗試強制重載資源...");
          const savedTime = video.currentTime;

          const seekAfterLoad = () => {
            video.currentTime = savedTime;
            video.play();
            video.removeEventListener('loadedmetadata', seekAfterLoad);
          };

          video.addEventListener('loadedmetadata', seekAfterLoad);
          video.load();
        });
      }
    }
  });
  let copyTimers = new Map();
  let lastpressed = new Map();
  document.querySelectorAll('.video-item .value').forEach(input => {
    input.addEventListener('pointerdown', (e) => {
      const target = e.target;
      const now = Date.now();
      lastpressed.set(target, now);
    });
    input.addEventListener('pointerup', (e) => {
      const target = e.target;
      const now = Date.now();
      if (copyTimers.has(target)) return;
      if (lastpressed.get(target) && now - lastpressed.get(target) > 150) return;
      const text = target.textContent;

      navigator.clipboard.writeText(text).then(() => {
        const originalText = target.textContent;
        target.textContent = 'Copied!';
        target.classList.add('copied');
        const timer = setTimeout(() => {
          target.textContent = originalText;
          target.classList.remove('copied');
          copyTimers.delete(target);
        }, 500);

        copyTimers.set(target, timer);
      }).catch(err => {
        console.error('複製失敗:', err);
      });
    });
    input.addEventListener('pointerleave', (e) => {
      const target = e.target;
      window.getSelection().removeAllRanges();
    });
  });
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
      // 只有在頁面可見時才響應耳機播放指令
      if (document.visibilityState === 'visible') {
        video.play();
      } else {
        console.log('頁面在背景，已忽略耳機播放指令');
      }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      video.pause();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      previousVideo();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      nextVideo();
    });
  }
}

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
      delayHideControlAreas();
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
    const isTouch = e.pointerType === 'touch';
    if (isDraggingBar || !isTouch) return;
    if (isNaN(video.duration)) return;
    const rect = video.getBoundingClientRect();
    DraggingVideoX = e.clientX - rect.left;
    const yPercent = (e.clientY - rect.top) / rect.height;
    if (yPercent < 0.2 || yPercent > 0.8) {
      return;
    }
    canDraggingVideo = true;
  });
  /*   video.addEventListener('contextmenu', (e) => {
      e.preventDefault(); // 阻止右键菜单（桌面端）和长按菜单（移动端）
      e.stopPropagation();
    }); */
  video.addEventListener('pointermove', (e) => {
    if (!canDraggingVideo) return;
    const rect = video.getBoundingClientRect();
    let newx = e.clientX - rect.left;
    if (isDraggingVideo == false && Math.abs(newx - DraggingVideoX) < 20) return;
    if (!isDraggingVideo) DraggingVideoX = newx * 0.8 + DraggingVideoX * 0.2;
    isDraggingVideo = true;
    skipTimeShow.style.opacity = 1;
    if (!video.paused) togglePlayPause();
    e.preventDefault();
    e.stopPropagation();
    updateProgressFromTouch(e);
    handleMouseMovement();
  });
  video.addEventListener('pointerup', (e) => {
    if (isDraggingVideo) {
      isDraggingVideo = false;
      video.currentTime = video.currentTime + skippingTime;
      skipTimeShow.style.opacity = 0;
      togglePlayPause();
    }
    canDraggingVideo = false;
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
  let newx = e.clientX - rect.left;
  const xpos = Math.max(0, Math.min(1, (Math.abs(newx - DraggingVideoX)) / rect.width)); // 限制在0-1之间
  const t = xpos * 120;
  if (newx - DraggingVideoX > 0) {
    if (video.currentTime + t > video.duration) {
      skippingTime = video.duration - video.currentTime;
    } else {
      skippingTime = t;
    }
  } else {
    if (video.currentTime - t < 0) {
      skippingTime = -video.currentTime;
    } else {
      skippingTime = -t;
    }
  }
  const newTime = video.currentTime + skippingTime
  const pos = Math.max(0, Math.min(1, newTime / (video.duration || 1))); // 限制在0-1之间

  // 手动更新进度条更新时间显示显示（避免视频timeupdate延迟）
  progressFill.style.width = `${pos * 100}%`;
  progressHandle.style.left = `${pos * 100}%`;

  // 更新时间显示
  const currentTime = formatTime(newTime);
  const duration = video.duration ? formatTime(video.duration) : '00:00';
  timeDisplay.textContent = `${currentTime} / ${duration}`;
  skipTimeShow.textContent = `${currentTime} / ${duration}\n${(skippingTime >= 0) ? '+' : '-'}${formatTime(Math.abs(skippingTime))}`;

}
// 处理鼠标移动显示控制区域和鼠标
function handleMouseMovement(e) {
  clearTimeout(hideControlsTimer);
  showControlAreas();
  delayHideControlAreas();
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

function delayHideControlAreas() {
  clearTimeout(hideControlsTimer);
  hideControlsTimer = setTimeout(hideControlAreas, 1000);
}

// 隐藏上下区域并隐藏鼠标
function hideControlAreas() {
  danmuSettings.style.display = "none";
  if (isNaN(video.duration)) return;
  videoTopArea.classList.add('hidden');
  videoBottomArea.classList.add('hidden');
  videoPanel.style.cursor = 'none'; // 隐藏鼠标
}

// 播放/暫停切換
function togglePlayPause() {
  if (isNaN(video.duration)) return;
  video.paused ? video.play() : video.pause();
}
function initVideoPause() {
  playPauseBtn.addEventListener('click', togglePlayPause);
  let lastClick = 0;
  const doubleClickDelay = 300; // 双击时间阈值(ms)
  let clickTimer = null;
  // 點擊影片播放/暫停
  video.addEventListener('pointerdown', (e) => {
    const isTouch = e.pointerType === 'touch';
    const now = Date.now();

    // 判断是否在阈值内连续点击
    if (now - lastClick < doubleClickDelay) {
      if (isTouch) {
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
    if (!isTouch) {
      if (e.button == 0) {
        togglePlayPause();
        handleMouseMovement();
      }
    } else if (lastClick > 0) {
      e.preventDefault();
      e.stopPropagation();
      clickTimer = setTimeout(() => {
        if (videoBottomArea.classList.contains('hidden')) {
          showControlAreas();
          handleMouseMovement();
        }
        else {
          hideControlAreas();
        }
      }, doubleClickDelay);
    }
  });
}

// 側邊欄切換
toggleSidebarBtn.addEventListener('click', () => {
  toggleSidebar();
});
function toggleSidebar(a) {
  const isExpanded = (a === undefined) ? !sidebar.classList.contains('expanded') : !!a;

  sidebar.classList.toggle('expanded', isExpanded);
  toggleSidebarBtn.classList.toggle('flipped', isExpanded);

  updateVideoPanelWidth();
  showControlAreas();
  delayHideControlAreas();
}

// 手動更新video-panel寬度
function updateVideoPanelWidth() {
  if (sidebar.classList.contains('expanded')) {
    videoPanel.classList.add('expanded');
  } else {
    videoPanel.classList.remove('expanded');
  }
}

// 倍速控制
playbackSpeed.addEventListener('change', () => {
  video.playbackRate = parseFloat(playbackSpeed.value);
});

// 视频播放时的处理
video.addEventListener('play', () => {
  playPauseBtn.textContent = '❚❚';
  // 播放时启动隐藏计时器（但鼠标一动就会立即显示）
  delayHideControlAreas();
});

// 视频暂停时强制显示鼠标和控制区
video.addEventListener('pause', () => {
  playPauseBtn.textContent = '▶';
  showControlAreas(); // 暂停时显示控制区和鼠标
});

// 1. 進度條更新（包含圓點位置）
video.addEventListener('timeupdate', () => {
  updateProgress();
  const li = videoList.querySelector('.playing');
  let d = video.duration;
  let t = video.currentTime;
  if (isNaN(d)) return;
  if (t / d > 0.9) {
    li.classList.add('finished');
  } else {
    li.classList.remove('finished');
  }
  li.innerText = `${li.name}\n${formatTime(t)} / ${formatTime(d)}`;
  hasWatchedVideos[video.name].time = video.currentTime;
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
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${String(hours)}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
volume_btn.addEventListener('click', () => {
  isMuted = !isMuted;
  video.muted = isMuted;
  syncVolumeUI();
});
volume_btn.addEventListener('pointerover', show_volume_bar);
volumeControl.addEventListener('pointerover', () => {
  isPointerInVolumeBar = true;
  clearTimeout(hideVolumeBarTimer);
  show_volume_bar();
});
volumeControl.addEventListener('pointerleave', () => {
  isPointerInVolumeBar = false;
  hide_volume_bar();
});
function show_volume_bar() {
  volumeInput.style.width = "100px";
  volume_bar.style.transform = "translateX(-10px)";
  volume_bar.style.padding = "0 10px";
}
function hide_volume_bar() {
  volumeInput.style.width = "0";
  volume_bar.style.transform = "translateX(-20px)";
  volume_bar.style.padding = "0";
}
volumeInput.addEventListener('keydown', (e) => {
  e.preventDefault();
});
// 音量控制
volumeInput.addEventListener('input', () => {
  volume = parseFloat(volumeInput.value);
  video.volume = volume;
  video.muted = false;
  isMuted = (volume === 0);
  document.activeElement.blur();
  syncVolumeUI();
});
function updateVolume(dv = 0) {
  let val = Number(volumeInput.value) + dv;
  volume = Math.max(0, Math.min(1, val));
  video.volume = volume;
  video.muted = false;
  isMuted = (volume === 0);
  syncVolumeUI();
}
function syncVolumeUI() {
  show_volume_bar();
  updateVolumeControl();
  handleMouseMovement();
  save_status();
}
function updateVolumeControl() {
  const vl = (isMuted) ? 0 : volume * 100;
  if (isMuted) {
    volumeInput.value = 0;
  } else {
    volumeInput.value = volume;
  }
  volumeInput.style.background = `linear-gradient(to right, #888 ${vl}%, #333 ${vl}%)`;
  if (vl > 80) {
    volume_max.style.display = "block";
    volume_mid.style.display = "none";
    volume_min.style.display = "none";
  } else if (vl == 0) {
    volume_max.style.display = "none";
    volume_mid.style.display = "none";
    volume_min.style.display = "block";
  } else {
    volume_max.style.display = "none";
    volume_mid.style.display = "block";
    volume_min.style.display = "none";
  }
}
// 彈幕開關
toggleDanmu.addEventListener('click', toggleDanmuDisplay);

function toggleDanmuDisplay() {
  isDanmuEnabled = !isDanmuEnabled;
  toggleDanmu_btn(isDanmuEnabled);

  // 保存状态到全局，供danmu.js使用
  window.isDanmuEnabled = isDanmuEnabled;
  window.danmu_add_class();
  save_status();
}

// 全屏功能
fullscreenBtn.addEventListener('click', () => {
  toggleFullscreen();
  if (!document.fullscreenElement) {
    lockToLandscape();
  }
});

function toggleDanmu_btn(a) {
  if (a) {
    danmu_on.style.display = 'block';
    danmu_off.style.display = 'none';
  } else {
    danmu_on.style.display = 'none';
    danmu_off.style.display = 'block';
  }
}
function toggleFlsc_btn(a) {
  if (a) {
    flsc_btn1.style.display = 'none';
    flsc_btn2.style.display = 'block';
  } else {
    flsc_btn1.style.display = 'block';
    flsc_btn2.style.display = 'none';
  }
}
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
      document.body.webkitRequestFullscreen();
    }
    toggleFlsc_btn(1);
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    toggleFlsc_btn(0);
  }
  showControlAreas();
}
async function lockToLandscape() {
  try {
    await screen.orientation.lock('landscape');
  } catch (err) {
    console.warn("無法鎖定橫向：", err);
  }
}
// 監聽全屏狀態變化
document.addEventListener('fullscreenchange', updateFullscreenUI);
document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

function updateFullscreenUI() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    toggleFlsc_btn(1);
  } else {
    toggleFlsc_btn(0);
  }
  updateVideoPanelWidth();
}

// 彈幕設置面板切換
toggleDanmuSettings.addEventListener('click', () => {
  danmuSettings.style.display = danmuSettings.style.display === 'block' ? 'none' : 'block';
  showControlAreas();
});
function updateInputBG(input_element) {
  const min = parseFloat(input_element.min);
  const max = parseFloat(input_element.max);
  const value = parseFloat(input_element.value);
  const percent = ((value - min) / (max - min)) * 100;
  input_element.style.background = `linear-gradient(to right, #888 ${percent}%, #333 ${percent}%)`;
}
// 同步設置值顯示
danmuSpeed.addEventListener('input', () => {
  const speed = parseFloat(danmuSpeed.value);
  speedValue.textContent = `${speed.toFixed(1)}x`;
  updateInputBG(danmuSpeed);
  window.updateDanmuAnimationSpeed();
  handleMouseMovement();
  save_status();
});

danmuSize.addEventListener('input', () => {
  const size = parseFloat(danmuSize.value);
  sizeValue.textContent = `${size}px`;
  updateInputBG(danmuSize);
  handleMouseMovement();
  save_status();
});

danmuOpacity.addEventListener('input', () => {
  const opacity = parseFloat(danmuOpacity.value);
  opacityValue.textContent = `${Math.round(opacity * 100)}%`;
  updateInputBG(danmuOpacity);
  window.updateDanmuOpacity();
  handleMouseMovement();
  save_status();
});

danmuRange.addEventListener('input', () => {
  rangeValue.textContent = `${danmuRange.value}%`;
  updateInputBG(danmuRange);
  handleMouseMovement();
  save_status();
});

danmuLimit.addEventListener('input', () => {
  limitValue.textContent = `${danmuLimit.value}`;
  updateInputBG(danmuLimit);
  window.updateDanmuAnimationSpeed();
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


function getCleanPath(file) {
  let path = file.webkitRelativePath;
  if (!path) return "";

  const isAndroidSystemUri = path.startsWith('tree/') && path.includes('/document/');

  if (isAndroidSystemUri) {
    try {
      const parts = path.split('/document/');
      let virtualPath = parts[parts.length - 1];

      virtualPath = decodeURIComponent(virtualPath);

      if (virtualPath.includes(':')) {
        virtualPath = virtualPath.split(':').slice(1).join(':');
      }

      return virtualPath;
    } catch (err) {
      console.error("Android 路徑解析出錯", err);
    }
  }
  return path;
}
folderInput.addEventListener('change', (e) => {
  if (!e.target.files || e.target.files.length === 0) {
    return;
  }
  const files = Array.from(e.target.files);
  console.log(files);

  // const fileInfos = files.map(f => ({
  //   file: f,
  //   cleanPath: getCleanPath(f),
  //   name: f.name
  // }));

  // const depths = fileInfos.map(info => info.cleanPath ? info.cleanPath.split('/').length : 1);
  // const maxDepth = Math.max(...depths);
  // if (maxDepth > 2) return;

  handleFiles(files);

});

async function handleFiles(fileObject) {
  const files = Array.from(fileObject);
  const vidFiles = files.filter(f => f.type.startsWith('video/'));

  const BATCH_SIZE = 20;

  for (let i = 0; i < vidFiles.length; i += BATCH_SIZE) {
    const batch = vidFiles.slice(i, i + BATCH_SIZE);
    const fragment = document.createDocumentFragment();

    for (const vid of batch) {
      if (!checkVideoSupport(vid)) continue;
      const isDuplicate = videos.some(item => item.vid.name === vid.name);
      if (isDuplicate) continue;

      const xml = files.find(f =>
        f.name.replace(/\.[^.]+$/, '') === vid.name.replace(/\.[^.]+$/, '') &&
        f.name.endsWith('.xml')
      );

      videos.push({ vid, xml });
      const size = formatSize(vid.size);
      const li = document.createElement('li');
      li.name = vid.name;
      li.innerText = vid.name;

      if (hasWatchedVideos.hasOwnProperty(vid.name)) {
        let d = hasWatchedVideos[vid.name].duration;
        let t = hasWatchedVideos[vid.name].time;
        if (t / d > 0.9) li.classList.add('finished');
        li.innerText = `${li.name}\n${formatTime(t)} / ${formatTime(d)}`;
      }

      li.addEventListener('click', () => {
        if (li.classList.contains('playing')) return;
        videoList.querySelectorAll('li').forEach(item => item.classList.remove('playing'));
        li.classList.add('playing');
        clearAll();
        nameEl.textContent = `${vid.name}`;
        sizeEl.textContent = size;
        pathEl.textContent = `${vid.webkitRelativePath}`;
        playVideo({ vid, xml, size });
      });

      fragment.appendChild(li);
    }

    videoList.appendChild(fragment);
    fileNumber.innerText = `${videoList.querySelectorAll('li').length} videos`;

    // 讓出主執行緒，讓瀏覽器有空渲染畫面
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  console.log('all files processed');
}
function clearAll() {
  if (window.danmusClear) window.danmusClear();
  if (window.clearDanmus) window.clearDanmus();
  video.src = '';
  document.querySelectorAll('.value').forEach(item => {
    item.textContent = '';
  });

  const canvas = document.getElementById('waveformCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
  }
}

function playVideo({ vid, xml }) {
  if (currentVideoUrl) {
    URL.revokeObjectURL(currentVideoUrl);
  }
  const url = URL.createObjectURL(vid);

  video.name = vid.name;
  window.isDanmuEnabled = isDanmuEnabled;
  window.danmuContainer = danmuContainer;

  video.onloadedmetadata = () => {
    widthEl.textContent = video.videoWidth;
    heightEl.textContent = video.videoHeight;
    durationEl.textContent = formatTime(video.duration);
    video.playbackRate = parseFloat(playbackSpeed.value);

    const canvas = document.getElementById('waveformCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
    }

    if (hasWatchedVideos.hasOwnProperty(vid.name)) {
      video.currentTime = hasWatchedVideos[vid.name].time;
    } else {
      hasWatchedVideos[vid.name] = {
        time: 0,
        duration: video.duration
      };
    }
  };

  video.onloadeddata = () => {
    if (xml && window.loadDanmuXML) {
      window.loadDanmuXML(xml);
    }
  };

  video.src = url;

  const startPlay = () => {
    video.play().then(() => {
      playPauseBtn.textContent = '❚❚';
      videoTitle.textContent = vid.name.replace(/\.[^.]*$/, '');
      showControlAreas();
    }).catch(err => console.log('播放失敗:', err));

    video.removeEventListener('canplaythrough', startPlay);
  };

  video.addEventListener('canplaythrough', startPlay);
}
function nextVideo() {
  let p = document.querySelectorAll('#videoList li.playing');
  if (p.length > 0 && p[0].nextElementSibling) p[0].nextElementSibling.click();
}
function previousVideo() {
  let p = document.querySelectorAll('#videoList li.playing');
  if (p.length > 0 && p[0].previousElementSibling) p[0].previousElementSibling.click();
}
function updateDanmuContainerSize() {
  if (danmuContainer) {
    danmuContainer.style.width = `${videoPanel.offsetWidth}px`;
    danmuContainer.style.height = `${videoPanel.offsetHeight}px`;
  }
}
function initKeyboardShortcuts() {
  document.addEventListener('focusin', (event) => {
    const activeEl = document.activeElement;

    const interactiveTags = ['INPUT', 'TEXTAREA', 'OPTION'];

    if (!interactiveTags.includes(activeEl.tagName) && activeEl !== document.body) {
      activeEl.blur();
      document.body.focus();
    }
  }, true);
  document.addEventListener('keydown', (e) => {
    if ((e.target != volumeInput) && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) {
      return;
    }
    let a = isPointerInVolumeBar;
    let b = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
    if (b) return;
    switch (e.key.toLocaleLowerCase()) {
      case ' ':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'arrowright':
        e.preventDefault();
        video.currentTime = Math.min(video.currentTime + 5, video.duration || 0);
        break;
      case 'arrowleft':
        e.preventDefault();
        video.currentTime = Math.max(video.currentTime - 5, 0);
        break;
      case 'arrowup':
        e.preventDefault();
        updateVolume(0.05);
        clearTimeout(hideVolumeBarTimer);
        if (!a) hideVolumeBarTimer = setTimeout(hide_volume_bar, 1000);
        break;
      case 'arrowdown':
        e.preventDefault();
        updateVolume(-0.05);
        clearTimeout(hideVolumeBarTimer);
        if (!a) hideVolumeBarTimer = setTimeout(hide_volume_bar, 1000);
        break;
      case 'f':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'd':
        e.preventDefault();
        toggleDanmuDisplay();
        break;
      case 'm':
        e.preventDefault();
        isMuted = !isMuted;
        video.muted = isMuted;
        syncVolumeUI();
        clearTimeout(hideVolumeBarTimer);
        if (!a) hideVolumeBarTimer = setTimeout(hide_volume_bar, 1000);
        break;
      case 'j':
        e.preventDefault();
        toggleSidebar();
        break;
      case 'o':
        e.preventDefault();
        customFileBtn.click();
        break;
      case 'i':
        e.preventDefault();
        videoInfo.style.display = videoInfo.style.display === 'flex' ? 'none' : 'flex';
        break;
      case '[':
        e.preventDefault();
        previousVideo();
        break;
      case ']':
        e.preventDefault();
        nextVideo();
        break;
    }
  });
}
function save_status() {
  localStorage.setItem("isDanmuEnabled", isDanmuEnabled);
  localStorage.setItem("isMuted", isMuted);
  localStorage.setItem("volume", volume);
  localStorage.setItem("danmuSpeed", danmuSpeed.value);
  localStorage.setItem("danmuSize", danmuSize.value);
  localStorage.setItem("danmuOpacity", danmuOpacity.value);
  localStorage.setItem("danmuRange", danmuRange.value);
  localStorage.setItem("danmuLimit", danmuLimit.value);
  localStorage.setItem("hasWatchedVideos", JSON.stringify(hasWatchedVideos));
}