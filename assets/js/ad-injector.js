// Ad Injector Utility (shared across pages/modals)
// Provides shared round-robin rotation, 1-minute cooldown on unfilled slots,
// parameterized size, safe push retries, and fallback across slots.
(function(){
  const w = (typeof window !== 'undefined') ? window : globalThis;

  // init shared rotation and cooldown registries
  if (!w.__modalAdRotation) {
    w.__modalAdRotation = {
      slots: ['7254578915', '7331282728', '6018201052', '9244892982'],
      idx: 0
    };
  }
  if (!w.__adSlotCooldown) {
    // map: slotId -> lastUnfilledTs (ms)
    w.__adSlotCooldown = {};
  }

  function now(){ return Date.now(); }

  function nextUsableSlot() {
    const state = w.__modalAdRotation;
    const cooldown = w.__adSlotCooldown;
    const n = state.slots.length;
    for (let i = 0; i < n; i++) {
      const slot = state.slots[(state.idx + i) % n];
      const lastFail = cooldown[slot] || 0;
      if ((now() - lastFail) >= 60 * 1000) {
        state.idx = (state.idx + i + 1) % n; // advance past chosen slot
        return slot;
      }
    }
    // all cooled: pick the next by index anyway (will likely be cooled but we return something)
    const slot = state.slots[state.idx % n];
    state.idx = (state.idx + 1) % n;
    return slot;
  }

  function markUnfilled(slot) {
    if (!slot) return;
    w.__adSlotCooldown[slot] = now();
  }

  function injectAdInto(containerEl, opts){
    // opts: { width, height, className, marginTop, tryWindows?: number[] (ms) }
    if (!containerEl) return null;
    const width = (opts && opts.width) || 728;
    const height = (opts && opts.height) || 90;
    const cls = (opts && opts.className) || '';
    const marginTop = (opts && typeof opts.marginTop === 'number') ? opts.marginTop : 16;
    const windows = (opts && opts.tryWindows) || [1000, 1500, 2000, 2500, 4000, 6000];
    const aggressiveRemoveMs = (opts && typeof opts.aggressiveRemoveMs === 'number') ? opts.aggressiveRemoveMs : 600;

    const wrap = document.createElement('div');
    wrap.className = cls || 'inline-ad-wrap';
    wrap.style.cssText = `margin:${marginTop}px 0 0 0; display:flex; justify-content:center; align-items:center;`;

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'inline-block';
    ins.style.width = width + 'px';
    ins.style.height = height + 'px';
    ins.setAttribute('data-ad-client', 'ca-pub-5862324369257695');
    // Rotation disabled: always use the first slot only  //         switchSlot();
    let currentSlot = (w.__modalAdRotation && w.__modalAdRotation.slots && w.__modalAdRotation.slots[0]) || '7254578915';
    ins.setAttribute('data-ad-slot', currentSlot);

    wrap.appendChild(ins);
    containerEl.appendChild(wrap);

    // 실시간 감시: unfilled 표시 또는 iframe 미생성 상태를 빠르게 처리
    let mo = null;
    try {
      mo = new MutationObserver(() => {
        const hasFrame = !!ins.querySelector('iframe');
        const status = ins.getAttribute('data-ad-status');
        if (status === 'unfilled' && !hasFrame) {
          markUnfilled(currentSlot);
          if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
          if (mo) { try { mo.disconnect(); } catch(_){} mo = null; }
        }
        if (hasFrame) {
          // 렌더 성공 시 감시 중단
          if (mo) { try { mo.disconnect(); } catch(_){} mo = null; }
        }
      });
      mo.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'], childList: true, subtree: true });
    } catch(_) { /* noop */ }

    // 매우 빠른 초기 정리: 짧은 시간 내 iframe이 없으면 바로 제거해 공백 체감 최소화
    setTimeout(() => {
      if (!ins || !wrap || !wrap.parentNode) return;
      const hasFrame = !!ins.querySelector('iframe');
      if (!hasFrame) {
        markUnfilled(currentSlot);
        if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if (mo) { try { mo.disconnect(); } catch(_){} mo = null; }
      }
    }, aggressiveRemoveMs);

    const tryPush = () => {
      if (!ins || ins.dataset.pushed === '1') return;
      const isVisible = ins.offsetParent !== null; // fairly robust for modals
      const widthOk = ins.offsetWidth >= Math.min(300, width);
      if (isVisible && widthOk){
        try { (adsbygoogle = window.adsbygoogle || []).push({}); ins.dataset.pushed = '1'; } catch(_){ /* ignore */ }
      } else {
        if (!ins.__retryCount) ins.__retryCount = 0;
        if (ins.__retryCount < 10){ ins.__retryCount++; setTimeout(tryPush, 120); }
      }
    };
    setTimeout(tryPush, 80);

    // Disable switching: on failure, just clean up immediately (no rotation)
    let remainingSwitches = 0;
    const switchSlot = () => {
      const hasFrame = !!ins.querySelector('iframe');
      if (!hasFrame) {
        markUnfilled(currentSlot);
        if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }
      return;
    };

    const checkAndFallback = () => {
      const status = ins.getAttribute('data-ad-status');
      const hasFrame = !!ins.querySelector('iframe');
      if (status === 'unfilled' || !hasFrame){
        // No rotation: remove immediately
        switchSlot();
      }
    };
    windows.forEach(t => setTimeout(checkAndFallback, t));

    // 최종 클린업: 마지막 확인 시점 이후에도 iframe이 없으면 래퍼 제거하여 빈칸 방지
    const lastWindow = windows.length ? Math.max.apply(null, windows) : 2000;
    setTimeout(() => {
      const hasFrame = !!ins.querySelector('iframe');
      if (!hasFrame) {
        markUnfilled(currentSlot);
        if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }
    }, lastWindow + 800);

    return { wrap, ins };
  }

  // Public API
  w.ModalAdInjector = {
    injectAdInto,
    nextUsableSlot,
    markUnfilled
  };
})();
