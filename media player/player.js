const container = document.getElementById('container');
// video panel
const videoPanel = document.getElementById('video-panel');
const video = document.getElementById('myVideo');

const videoTopArea = document.getElementById('videoTopArea');
const videoTitle = document.getElementById('videoTitle');
const toggleSidebarBtn = document.getElementById('toggleSidebar');

const videoBottomArea = document.getElementById('videoBottomArea');
const progressContainer = document.getElementById('progressContainer');
const waveformCanvas = document.getElementById('waveformCanvas');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const timeDisplay = document.getElementById('timeDisplay');
const progressPreview = document.getElementById('progressPreview');
const previewCanvas = document.getElementById('previewCanvas');
const previewTimeEl = document.getElementById('previewTime');
const previewVideoEl = document.getElementById('previewVideoEl');

const playPauseBtn = document.getElementById('playPauseBtn');
const currentSpeedDisplay = document.getElementById('currentSpeedDisplay');
const playbackSpeed = document.getElementById('playbackSpeed');

const toggleDanmu = document.getElementById('toggleDanmu');
const toggleDanmuSettings = document.getElementById('toggleDanmuSettings');

const volumeControl = document.getElementById('volume-control');
const volume_btn = document.getElementById('volume_btn');
const volume_max = document.getElementById('volume_max');
const volume_mid = document.getElementById('volume_mid');
const volume_min = document.getElementById('volume_min');
const volume_bar = document.getElementById('volume_bar');

const fullscreenBtn = document.getElementById('fullscreenBtn');
const flsc_btn1 = document.getElementById('flsc_btn1');
const flsc_btn2 = document.getElementById('flsc_btn2');

const videoList = document.getElementById('videoList');
const videoInfo = document.getElementById('info');
const customFileBtn = document.getElementById('customFileBtn');
const refreshBtn = document.getElementById('refreshBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const toggleContinuous = document.getElementById('toggleContinuous');
const fileNumber = document.getElementById('fileNumber');
const folderInput = document.getElementById('folderInput');
const sidebar = document.getElementById('sidebar');
const danmuSettings = document.getElementById('danmuSettings');
const volumeInput = document.getElementById('volume_input');
const skipTimeShow = document.getElementById('skipTimeShow');
const nameEl = videoInfo.querySelector('.video-name');
const pathEl = videoInfo.querySelector('.video-path');
const widthEl = videoInfo.querySelector('.video-width');
const heightEl = videoInfo.querySelector('.video-height');
const sizeEl = videoInfo.querySelector('.video-size');
const durationEl = videoInfo.querySelector('.video-duration');
// danmu settings
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

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

let lastSavedTime = null;
let lastSavedAt = null;
let previewCtx = null;
let previewSeekPending = false;
let previewPendingTime = null;
let lastCurrentTime = -1;
let stalledCount = 0;
let isWatchdogRecovering = false;
let isRetryingPlay = false;
let lastSaveTime = 0;
let currentPlaybackRate = 1.0;
let timeoutId = null;
let lastSpeed = null;
let lastKeyTime = null;
let currentVideoUrl = null;
let videos = [];
let isDanmuPaused = false;
let danmuStateBeforePip = null;
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
  isPointerInVolumeBar = false,
  isPointerInMiddleArea = false;
const saved_isDanmuEnabled = (localStorage.getItem("isDanmuEnabled") ?? "true") === "true";
const saved_isMuted = localStorage.getItem("isMuted") === "true";
const saved_volume = parseFloat(localStorage.getItem("volume")) || 1.0;
const saved_danmuSpeed = parseFloat(localStorage.getItem("danmuSpeed")) || 1.0;
const saved_danmuSize = parseFloat(localStorage.getItem("danmuSize")) || 24;
const saved_danmuOpacity = parseFloat(localStorage.getItem("danmuOpacity")) || 1.0;
const saved_danmuRange = parseFloat(localStorage.getItem("danmuRange")) || 75;
const saved_danmuLimit = parseInt(localStorage.getItem("danmuLimit")) || 100;

const watchdog = setInterval(() => {
  if (video.paused || isNaN(video.duration)) return;

  if (video.currentTime === lastCurrentTime) {
    stalledCount++;
    console.warn(`卡住偵測 ${stalledCount}次, currentTime=${video.currentTime}`);

    if ((stalledCount >= 2 && !isMobileDevice) || (stalledCount >= 5 && isMobileDevice)) {
      stalledCount = 0;
      isWatchdogRecovering = true;
      retryPlay();
      setTimeout(() => isWatchdogRecovering = false, 3000);
    }
  } else {
    stalledCount = 0;
  }

  lastCurrentTime = video.currentTime;
}, 500);

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  danmuContainer = document.getElementById('danmu-container');
  volume = saved_volume;
  video.volume = volume;
  danmuSpeed.value = saved_danmuSpeed;
  danmuSize.value = saved_danmuSize;
  danmuOpacity.value = saved_danmuOpacity;
  danmuRange.value = saved_danmuRange;
  danmuLimit.value = saved_danmuLimit;
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
  initProgressPreview();
  initVideoPause();
  initOtherEvents();
  initDragAndDrop();
});

function initDragAndDrop() {
  const dropZone = videoList.parentElement;
  let li = null;
  let dragCounter = 0;

  const removeLiWithAnimation = (targetLi) => {
    if (!targetLi) return;
    targetLi.classList.add('collapsed');

    targetLi.addEventListener('transitionend', () => {
      if (targetLi.parentNode === videoList) {
        videoList.removeChild(targetLi);
      }
    }, { once: true });
  };

  dropZone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;

    if (dragCounter === 1) {
      if (li && videoList.contains(li)) {
        li.classList.remove('collapsed');
      } else {
        li = document.createElement('li');
        li.classList.add('dropping');
        li.innerText = "+";
        videoList.appendChild(li);
        requestAnimationFrame(() => {
          videoList.scrollTo({
            top: videoList.scrollHeight,
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
      li = null;
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

      const file = item.getAsFile();
      if (file && file.size > 0) {
        allFiles.push(file);
        continue;
      }

      const entry = item.webkitGetAsEntry?.();
      if (entry) {
        await readEntry(entry, allFiles);
      }
    }

    handleFiles(allFiles);
  });

  async function readEntry(entry, allFiles) {
    console.log("讀取項目：", entry);

    if (entry.isFile) {
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
            readBatch();
          }, (err) => {
            console.error("readEntries 錯誤：", err);
            resolve();
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
    if (isNaN(video.duration)) return;
    if (document.hidden) {
      saveVideoProgress(video.name, video.currentTime, video.duration);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (lastSpeed !== null) {
        video.playbackRate = lastSpeed;
        lastSpeed = null;
      }
    } else {
      if (!isWatchdogRecovering && !video.paused) {
        setTimeout(() => {
          if (!video.paused && video.currentTime === lastCurrentTime) {
            console.log("分頁喚醒後偵測到凍結，強制恢復...");
            isWatchdogRecovering = true;
            retryPlay();
            setTimeout(() => isWatchdogRecovering = false, 1000);
          }
        }, 800);
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
      const isInPip = document.pictureInPictureElement === video;
      if (isInPip || document.visibilityState === 'visible') {
        video.play();
      } else {
        console.log('頁面在背景且非PIP，已忽略耳機播放指令');
      }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      video.pause();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      const isInPip = document.pictureInPictureElement === video;
      if (isInPip || document.visibilityState === 'visible') {
        previousVideo();
      } else {
        console.log('頁面在背景且非PIP，已忽略上一首指令');
      }
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      const isInPip = document.pictureInPictureElement === video;
      if (isInPip || document.visibilityState === 'visible') {
        nextVideo();
      } else {
        console.log('頁面在背景且非PIP，已忽略下一首指令');
      }
    });
  }
  document.querySelectorAll('.switch input[type="checkbox"]').forEach(input => {
    input.addEventListener('keydown', (e) => {
      e.preventDefault();
      document.activeElement.blur();
    });
  });
  window.addEventListener('pagehide', () => {
    if (isNaN(video.duration) || !video.name) return;
    saveVideoProgress(video.name, video.currentTime, video.duration);
  });
}

function retryPlay() {
  if (isRetryingPlay) {
    console.log("恢復流程已在進行中，略過本次觸發");
    return;
  }
  isRetryingPlay = true;
  video.pause();
  console.log("播放失敗，嘗試強制重載資源...");

  const savedTime = video.currentTime;
  let handled = false;

  const seekAfterLoad = () => {
    if (handled) return;
    handled = true;
    video.currentTime = savedTime;
    video.removeEventListener('loadedmetadata', seekAfterLoad);
    video.removeEventListener('canplay', seekAfterLoad);
    video.play().then(() => {
      console.log("喚醒成功");
      isRetryingPlay = false;
    }).catch(err => {
      console.log("喚醒失敗：", err);
      isRetryingPlay = false;
      setTimeout(() => retryPlay(), 2000);
    });
  };

  video.addEventListener('loadedmetadata', seekAfterLoad);
  video.addEventListener('canplay', seekAfterLoad);
  video.load();

  if (!isMobileDevice && previewVideoEl && currentVideoUrl) {
    previewVideoEl.src = currentVideoUrl;
    previewVideoEl.load();
    previewSeekPending = false;
    previewPendingTime = null;
  }
}

function initVideoControlAreas() {
  showControlAreas();

  danmuSettings.addEventListener('mouseleave', (e) => {
    setTimeout(() => {
      danmuSettings.style.display = "none";
    }, 500);
  });

  videoPanel.addEventListener('mousemove', (e) => {
    if (videoBottomArea.contains(e.target) || videoTopArea.contains(e.target) || danmuSettings.contains(e.target)) {
      showControlAreas();
      isPointerInMiddleArea = false;
      return;
    }
    handleMouseMovement();
    isPointerInMiddleArea = true;
  });
  sidebar.addEventListener('mousemove', (e) => {
    handleMouseMovement();
  });
  document.addEventListener('mouseleave', (e) => {
    delayHideControlAreas();
  });

  videoTopArea.addEventListener('click', (e) => {
    e.stopPropagation();
    isPointerInMiddleArea = false;
  });
  videoTopArea.addEventListener('mousemove', (e) => {
    showControlAreas();
    isPointerInMiddleArea = false;
  });

  videoBottomArea.addEventListener('click', (e) => {
    e.stopPropagation();
    isPointerInMiddleArea = false;
  });
  videoBottomArea.addEventListener('mousemove', (e) => {
    showControlAreas();
    isPointerInMiddleArea = false;
  });
}

function initProgressBarDrag() {
  progressContainer.addEventListener('pointerdown', (e) => {
    isDraggingBar = true;
    updateProgressFromMouse(e);
    showControlAreas();
    e.preventDefault();
    e.stopPropagation();
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
      adjustVideoTime(skippingTime);
      skipTimeShow.style.opacity = 0;
      togglePlayPause();
    }
    canDraggingVideo = false;
  });
  document.addEventListener('pointermove', (e) => {
    if (isDraggingBar) {
      e.preventDefault();
      updateProgressFromMouse(e);
      showControlAreas();
    }
  });
  document.addEventListener('pointerup', () => {
    isDraggingBar = false;
    isDraggingVideo = false;
    hidePreview();
  });

  progressContainer.addEventListener('pointermove', (e) => {
    if (isDraggingBar) return;
    if (e.pointerType === 'touch' || isMobileDevice) return;
    if (isNaN(video.duration) || !video.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = pos * video.duration;
    showPreviewAt(e.clientX, time);
  });
  progressContainer.addEventListener('pointerleave', (e) => {
    if (isDraggingBar) return;
    hidePreview();
  });
}

function updateProgressFromMouse(e) {
  const rect = progressBar.getBoundingClientRect();
  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const newTime = pos * (video.duration || 0);

  video.currentTime = newTime;

  progressFill.style.width = `${pos * 100}%`;
  progressHandle.style.left = `${pos * 100}%`;

  const currentTime = formatTime(newTime);
  const duration = video.duration ? formatTime(video.duration) : '00:00';
  timeDisplay.textContent = `${currentTime} / ${duration}`;

  if (!isMobileDevice && e.pointerType !== 'touch') {
    showPreviewAt(e.clientX, newTime);
  }
}

function initProgressPreview() {
  if (isMobileDevice) {
    if (progressPreview) progressPreview.remove();
    if (previewVideoEl) previewVideoEl.remove();
    return;
  }

  if (!progressPreview || !previewCanvas || !previewVideoEl) return;
  previewCtx = previewCanvas.getContext('2d');

  previewVideoEl.addEventListener('seeked', () => {
    drawPreviewFrame();
    previewSeekPending = false;
    if (previewPendingTime !== null) {
      const nextTime = previewPendingTime;
      previewPendingTime = null;
      seekPreviewTo(nextTime);
    }
  });

  previewVideoEl.addEventListener('error', () => {
    previewSeekPending = false;
    previewPendingTime = null;
  });
}

function drawPreviewFrame() {
  if (isMobileDevice || !previewCtx) return;
  const cw = previewCanvas.width;
  const ch = previewCanvas.height;
  try {
    const vw = previewVideoEl.videoWidth;
    const vh = previewVideoEl.videoHeight;

    previewCtx.fillStyle = '#000';
    previewCtx.fillRect(0, 0, cw, ch);

    if (!vw || !vh) return;

    const scale = Math.min(cw / vw, ch / vh);
    const drawW = vw * scale;
    const drawH = vh * scale;
    const offsetX = (cw - drawW) / 2;
    const offsetY = (ch - drawH) / 2;

    previewCtx.drawImage(previewVideoEl, offsetX, offsetY, drawW, drawH);
  } catch (err) {
    // 影片尚未就緒時忽略
  }
}

function seekPreviewTo(time) {
  if (isMobileDevice || !previewVideoEl || !previewVideoEl.src) return;
  if (isNaN(previewVideoEl.duration) || !previewVideoEl.duration) return;
  const safeTime = Math.max(0, Math.min(time, previewVideoEl.duration - 0.05));

  if (previewSeekPending) {
    previewPendingTime = safeTime;
    return;
  }
  previewSeekPending = true;
  previewVideoEl.currentTime = safeTime;
}

function showPreviewAt(clientX, time) {
  if (isMobileDevice || !progressPreview) return;
  if (!video.duration || isNaN(video.duration)) return;

  const containerRect = progressContainer.getBoundingClientRect();
  const previewWidth = progressPreview.offsetWidth || 160;
  const minLeft = previewWidth / 2 + 4;
  const maxLeft = containerRect.width - previewWidth / 2 - 4;
  let left = clientX - containerRect.left;
  left = Math.max(minLeft, Math.min(maxLeft, left));

  progressPreview.style.left = `${left}px`;
  progressPreview.classList.add('show');
  previewTimeEl.textContent = formatTime(time);

  seekPreviewTo(time);
}

function hidePreview() {
  if (isMobileDevice || !progressPreview) return;
  progressPreview.classList.remove('show');
}

function updateProgressFromTouch(e) {
  const rect = video.getBoundingClientRect();
  let newx = e.clientX - rect.left;
  const xpos = Math.max(0, Math.min(1, (Math.abs(newx - DraggingVideoX)) / rect.width));
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
  const pos = Math.max(0, Math.min(1, newTime / (video.duration || 1)));

  progressFill.style.width = `${pos * 100}%`;
  progressHandle.style.left = `${pos * 100}%`;

  const currentTime = formatTime(newTime);
  const duration = video.duration ? formatTime(video.duration) : '00:00';
  timeDisplay.textContent = `${currentTime} / ${duration}`;
  skipTimeShow.textContent = `${currentTime} / ${duration}\n${(skippingTime >= 0) ? '+' : '-'}${formatTime(Math.abs(skippingTime))}`;
}

function handleMouseMovement() {
  showControlAreas();
  delayHideControlAreas();
}

function showControlAreas() {
  clearTimeout(hideControlsTimer);
  videoTopArea.classList.remove('hidden');
  videoBottomArea.classList.remove('hidden');
  videoPanel.style.cursor = 'default';
}

function delayHideControlAreas(t = 1000) {
  clearTimeout(hideControlsTimer);
  hideControlsTimer = setTimeout(hideControlAreas, t);
}

function hideControlAreas() {
  danmuSettings.style.display = "none";
  if (isNaN(video.duration) || video.videoHeight === 0) return;
  videoTopArea.classList.add('hidden');
  videoBottomArea.classList.add('hidden');
  videoPanel.style.cursor = 'none';
}

function togglePlayPause() {
  if (isNaN(video.duration)) return;
  video.paused ? video.play() : video.pause();
}

async function togglePictureInPicture() {
  if (!document.pictureInPictureEnabled) {
    console.warn('瀏覽器不支援 PIP');
    return;
  }
  try {
    if (document.pictureInPictureElement === video) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  } catch (err) {
    console.warn('PIP 切換失敗:', err);
  }
}

video.addEventListener('enterpictureinpicture', () => {
  danmuStateBeforePip = isDanmuEnabled;
  if (isDanmuEnabled) setDanmuEnabled(false);
});
video.addEventListener('leavepictureinpicture', () => {
  if (danmuStateBeforePip) setDanmuEnabled(true);
  danmuStateBeforePip = null;
});

function initVideoPause() {
  playPauseBtn.addEventListener('click', togglePlayPause);
  let lastClick = 0;
  const doubleClickDelay = 300;
  let clickTimer = null;

  video.addEventListener('pointerdown', (e) => {
    const isTouch = e.pointerType === 'touch';
    const now = Date.now();

    if (now - lastClick < doubleClickDelay) {
      if (isTouch) {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(clickTimer);
        togglePlayPause();
        handleMouseMovement();
      }
      lastClick = 0;
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
          handleMouseMovement();
        }
        else {
          hideControlAreas();
        }
      }, doubleClickDelay);
    }
  });
}

toggleSidebarBtn.addEventListener('click', () => {
  toggleSidebar();
});
function toggleSidebar(a) {
  const isExpanded = (a === undefined) ? !sidebar.classList.contains('expanded') : !!a;

  sidebar.classList.toggle('expanded', isExpanded);
  toggleSidebarBtn.classList.toggle('flipped', isExpanded);

  updateVideoPanelWidth();
  handleMouseMovement();
}

function updateVideoPanelWidth() {
  if (sidebar.classList.contains('expanded')) {
    videoPanel.classList.add('expanded');
  } else {
    videoPanel.classList.remove('expanded');
  }
}

playbackSpeed.addEventListener('change', () => {
  video.playbackRate = parseFloat(playbackSpeed.value);
});

video.addEventListener('ratechange', () => {
  const rate = video.playbackRate;
  currentPlaybackRate = rate;
  currentSpeedDisplay.innerText = rate.toFixed(2).replace(/0$/, '') + 'x';

  playbackSpeed.value = rate.toString();

  if (playbackSpeed.value === '') {
    playbackSpeed.selectedIndex = -1;
  }
});

video.addEventListener('play', () => {
  playPauseBtn.textContent = '❚❚';
  delayHideControlAreas();
});

video.addEventListener('pause', () => {
  playPauseBtn.textContent = '▶';
  showControlAreas();
  delayHideControlAreas(1500);
  saveVideoProgress(video.name, video.currentTime, video.duration);
});

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
  if (Date.now() - lastSaveTime > 3000) {
    lastSaveTime = Date.now();
    saveVideoProgress(video.name, t, d);
  }
});

video.addEventListener('ended', (event) => {
  saveVideoProgress(video.name, video.duration, video.duration);
  if (video.dataset.continuous == "true") {
    nextVideo();
  }
});

video.addEventListener('waiting', () => { });
video.addEventListener('stalled', () => {
  console.warn('影片 stalled');
});

function updateProgress() {
  if (!progressFill || isDraggingBar) return;

  const percent = (video.currentTime / (video.duration || 1)) * 100;
  progressFill.style.width = `${percent}%`;
  progressHandle.style.left = `${percent}%`;

  const currentTime = formatTime(video.currentTime);
  const duration = video.duration ? formatTime(video.duration) : '00:00';
  timeDisplay.textContent = `${currentTime} / ${duration}`;
}

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
  showControlAreas();
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
  let lv = "mute";
  if (vl > 80) {
    lv = "max";
  } else if (vl > 0) {
    lv = "mid";
  }
  volume_btn.setAttribute('data-level', lv);
}

toggleDanmu.addEventListener('click', toggleDanmuDisplay);

function toggleDanmuDisplay() {
  setDanmuEnabled(!isDanmuEnabled);
}

function setDanmuEnabled(enabled) {
  isDanmuEnabled = enabled;
  toggleDanmu_btn(isDanmuEnabled);
  window.isDanmuEnabled = isDanmuEnabled;
  window.danmu_add_class();
  save_status();
}

fullscreenBtn.addEventListener('click', () => {
  toggleFullscreen();
  if (!document.fullscreenElement) {
    lockToLandscape();
  }
});

function toggleDanmu_btn(a) {
  toggleDanmu.classList.toggle('is-on', a);
}
function toggleFlsc_btn(a) {
  fullscreenBtn.classList.toggle('is-on', a);
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
  handleMouseMovement();
}
async function lockToLandscape() {
  try {
    await screen.orientation.lock('landscape');
  } catch (err) {
    console.warn("無法鎖定橫向：", err);
  }
}

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

danmuSpeed.addEventListener('input', () => {
  const speed = parseFloat(danmuSpeed.value);
  speedValue.textContent = `${speed.toFixed(1)}x`;
  updateInputBG(danmuSpeed);
  window.updateDanmuAnimationSpeed();
  showControlAreas();
  save_status();
});

danmuSize.addEventListener('input', () => {
  const size = parseFloat(danmuSize.value);
  sizeValue.textContent = `${size}px`;
  updateInputBG(danmuSize);
  showControlAreas();
  save_status();
});

danmuOpacity.addEventListener('input', () => {
  const opacity = parseFloat(danmuOpacity.value);
  opacityValue.textContent = `${Math.round(opacity * 100)}%`;
  updateInputBG(danmuOpacity);
  window.updateDanmuOpacity();
  showControlAreas();
  save_status();
});

danmuRange.addEventListener('input', () => {
  rangeValue.textContent = `${danmuRange.value}%`;
  updateInputBG(danmuRange);
  showControlAreas();
  save_status();
});

danmuLimit.addEventListener('input', () => {
  limitValue.textContent = `${danmuLimit.value}`;
  updateInputBG(danmuLimit);
  window.updateDanmuAnimationSpeed();
  showControlAreas();
  save_status();
});

function checkVideoSupport(videoFile) {
  const tempVideo = document.createElement('video');
  const support = tempVideo.canPlayType(videoFile.type);
  return support !== "";
}

customFileBtn.addEventListener('click', () => {
  folderInput.click();
});
refreshBtn.addEventListener('click', () => {
  let a = document.querySelector('.playing');
  if (a) {
    a.classList.remove('playing');
    a.click();
  }
});
shuffleBtn.addEventListener('click', () => {
  shuffleChildren('videoList');
  const activeLi = videoList.querySelector('li.playing');
  if (activeLi) {
    activeLi.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }
  handleMouseMovement();
});
toggleContinuous.addEventListener('input', () => {
  video.dataset.continuous = toggleContinuous.checked;
});

function shuffleChildren(parentID) {
  const parent = document.getElementById(parentID);
  const children = Array.from(parent.children);

  for (let i = children.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [children[i], children[j]] = [children[j], children[i]];
  }

  children.forEach(child => parent.appendChild(child));
}

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
  const vidFiles = files.filter(f => f.type.startsWith('video/') || f.type.startsWith('audio/'));

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
      li.classList.add('video-item');

      const savedProgress = loadVideoProgress(vid.name);
      if (savedProgress) {
        let { time: t, duration: d, updatedAt: u } = savedProgress;
        if (t / d > 0.9) li.classList.add('finished');
        li.innerText = `${li.name}\n${formatTime(t)} / ${formatTime(d)}`;
        if (u) {
          li.title = `last updated: ${formatDateTime(u)}`;
        }
      }

      li.addEventListener('click', () => {
        if (li.classList.contains('playing')) return;
        videoList.querySelectorAll('li').forEach(item => item.classList.remove('playing'));
        li.classList.add('playing');
        li.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
        clearAll();
        nameEl.textContent = `${vid.name}`;
        sizeEl.textContent = size;
        pathEl.textContent = `${vid.webkitRelativePath}`;
        playVideo({ vid, xml, size });
      });

      fragment.appendChild(li);
    }

    videoList.appendChild(fragment);
    fileNumber.innerText = `(${videoList.querySelectorAll('li.video-item').length})`;

    await new Promise(resolve => setTimeout(resolve, 0));
  }
  console.log('all files processed');
}

function clearAll() {
  if (!isNaN(video.duration) && video.name) {
    saveVideoProgress(video.name, video.currentTime, video.duration);
  }
  if (window.danmusClear) window.danmusClear();
  if (window.clearDanmus) window.clearDanmus();
  video.src = '';
  document.querySelectorAll('.value').forEach(item => {
    item.textContent = '';
  });

  if (waveformCanvas) {
    const ctx = waveformCanvas.getContext('2d');
    const { width, height } = waveformCanvas;
    ctx.clearRect(0, 0, width, height);
  }
  if (previewCtx && previewCanvas) {
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  }
  hidePreview();
}

function playVideo({ vid, xml }) {
  const oldUrl = currentVideoUrl;

  const url = URL.createObjectURL(vid);
  currentVideoUrl = url;

  hidePreview();
  previewSeekPending = false;
  previewPendingTime = null;

  if (!isMobileDevice && previewVideoEl) {
    previewVideoEl.src = url;
  }

  video.name = vid.name;
  window.isDanmuEnabled = isDanmuEnabled;
  window.danmuContainer = danmuContainer;

  video.onloadedmetadata = () => {
    if (oldUrl) {
      URL.revokeObjectURL(oldUrl);
    }
    widthEl.textContent = video.videoWidth;
    heightEl.textContent = video.videoHeight;
    durationEl.textContent = formatTime(video.duration);
    video.playbackRate = parseFloat(currentPlaybackRate) || 1;

    if (video.dataset.continuous !== "true") {
      const saved = loadVideoProgress(vid.name);
      if (saved) {
        video.currentTime = saved.time;
        lastSavedTime = saved.time;
        lastSavedAt = saved.updatedAt ?? Date.now();
      } else {
        lastSavedTime = 0;
        lastSavedAt = Date.now();
        saveVideoProgress(vid.name, 0, video.duration);
      }
    }
  };

  video.onloadeddata = () => {
    if (xml && window.loadDanmuXML) {
      window.loadDanmuXML(xml);
    }
  };

  video.onerror = (e) => {
    const err = video.error;
    console.error('video error:', err?.code, err?.message);

    if (err?.code === 3 && !isWatchdogRecovering) {
      console.warn("Decoder crash，嘗試恢復...");
      isWatchdogRecovering = true;
      retryPlay();
      setTimeout(() => isWatchdogRecovering = false, 1000);
    }
  };

  video.src = url;

  const startPlay = () => {
    video.play().then(() => {
      playPauseBtn.textContent = '❚❚';
      refreshBtn.disabled = false;
      const nm = vid.name.replace(/\.[^.]*$/, '');
      videoTitle.textContent = nm;
      document.title = nm;
      handleMouseMovement();
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

function adjustVideoTime(seconds) {
  if (!video) return;
  if (isNaN(video.duration)) return;

  let newTime = video.currentTime + seconds;
  const duration = video.duration || 0;

  video.currentTime = Math.min(Math.max(newTime, 0), duration);
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
        if (e.repeat) break;
        togglePlayPause();
        break;
      case 'arrowright':
        e.preventDefault();
        if (timeoutId !== null || lastSpeed !== null) break;
        if (video.paused) {
          adjustVideoTime(5);
          break;
        }
        lastKeyTime = Date.now();
        timeoutId = setTimeout(() => {
          timeoutId = null;
          lastSpeed = video.playbackRate;
          video.playbackRate = 3;
        }, 200);
        break;
      case 'arrowleft':
        e.preventDefault();
        adjustVideoTime(-5);
        break;
      case 'arrowup':
        e.preventDefault();
        updateVolume(0.05);
        clearTimeout(hideVolumeBarTimer);
        if (!a) {
          hideVolumeBarTimer = setTimeout(hide_volume_bar, 1000);
          if (isPointerInMiddleArea) delayHideControlAreas(1500);
        }
        break;
      case 'arrowdown':
        e.preventDefault();
        updateVolume(-0.05);
        clearTimeout(hideVolumeBarTimer);
        if (!a) {
          hideVolumeBarTimer = setTimeout(hide_volume_bar, 1000);
          if (isPointerInMiddleArea) delayHideControlAreas(1500);
        }
        break;
      case 'f':
        e.preventDefault();
        if (e.repeat) break;
        toggleFullscreen();
        break;
      case 'd':
        e.preventDefault();
        if (e.repeat) break;
        toggleDanmuDisplay();
        break;
      case 'm':
        e.preventDefault();
        if (e.repeat) break;
        isMuted = !isMuted;
        video.muted = isMuted;
        syncVolumeUI();
        clearTimeout(hideVolumeBarTimer);
        if (!a) {
          hideVolumeBarTimer = setTimeout(hide_volume_bar, 1000);
          if (isPointerInMiddleArea) delayHideControlAreas(1500);
        }
        break;
      case 'j':
        e.preventDefault();
        if (e.repeat) break;
        toggleSidebar();
        break;
      case 'o':
        e.preventDefault();
        if (e.repeat) break;
        customFileBtn.click();
        break;
      case 'i':
        e.preventDefault();
        if (e.repeat) break;
        videoInfo.style.display = videoInfo.style.display === 'flex' ? 'none' : 'flex';
        break;
      case 'p':
        e.preventDefault();
        if (e.repeat) break;
        togglePictureInPicture();
        break;
      case '[':
        e.preventDefault();
        if (e.repeat) break;
        previousVideo();
        break;
      case ']':
        e.preventDefault();
        if (e.repeat) break;
        nextVideo();
        break;
      case 'q':
        e.preventDefault();
        video.playbackRate = Math.max(0.1, video.playbackRate - 1);
        break;
      case 'w':
        e.preventDefault();
        video.playbackRate = Math.max(0.1, video.playbackRate - 0.1);
        break;
      case 'e':
        e.preventDefault();
        video.playbackRate = video.playbackRate + 0.1;
        break;
      case 'r':
        e.preventDefault();
        video.playbackRate = video.playbackRate + 1;
        break;
      case ',':
        e.preventDefault();
        video.pause();
        adjustVideoTime(-1 / 60);
        break;
      case '.':
        e.preventDefault();
        video.pause();
        adjustVideoTime(1 / 60);
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    if ((e.target != volumeInput) && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) {
      return;
    }
    if (e.key.toLocaleLowerCase() === 'arrowright') {
      if (timeoutId) {
        adjustVideoTime(5);
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (lastSpeed !== null) {
        video.playbackRate = lastSpeed;
        lastSpeed = null;
      }
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
}

function saveVideoProgress(name, time, duration) {
  if (!name) return;
  if (lastSavedTime !== time) {
    lastSavedAt = Date.now();
    lastSavedTime = time;

    const li = videoList.querySelector('.playing');
    if (li && li.name === name) {
      li.title = `last updated: ${formatDateTime(lastSavedAt)}`;
    }
  }
  localStorage.setItem(`video:${name}`, JSON.stringify({ time, duration, updatedAt: lastSavedAt }));
}

function loadVideoProgress(name) {
  if (!name) return null;
  const raw = localStorage.getItem(`video:${name}`);
  return raw ? JSON.parse(raw) : null;
}

function formatDateTime(time) {
  if (!time) return '';
  return new Date(time).toLocaleString(undefined, { hour12: false });
}