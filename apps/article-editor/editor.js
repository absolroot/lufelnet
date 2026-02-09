/**
 * Article Editor - Full Featured
 */

// ============================================
// State
// ============================================

const state = {
    currentLang: 'kr',
    currentMode: 'visual', // 'visual' or 'code'
    images: [],
    thumbnail: null,
    existingThumbnailPath: null,
    modified: false,
    rootHandle: null,
    selectedImage: null,
    guides: [],
    drafts: [],
    currentDraftId: null,
    draggedImage: null
};

// ============================================
// DOM
// ============================================

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const dom = {
    sidebar: $('sidebar'),
    btnMenu: $('btn-menu'),
    btnCloseSidebar: $('btn-close-sidebar'),
    guidesList: $('guides-list'),
    draftsList: $('drafts-list'),
    draftsCount: $('drafts-count'),
    btnRefreshGuides: $('btn-refresh-guides'),
    filename: $('filename'),
    status: $('status'),
    langBtns: $$('.lang-btn'),
    modeBtns: $$('.mode-btn'),
    toolBtns: $$('.tool-btn'),
    editors: { kr: $('editor-kr'), en: $('editor-en'), jp: $('editor-jp') },
    codeEditors: { kr: $('code-editor-kr'), en: $('code-editor-en'), jp: $('code-editor-jp') },
    editorTitle: $('editor-title'),
    editorArea: $('editor-area'),
    titleKr: $('title-kr'),
    titleEn: $('title-en'),
    titleJp: $('title-jp'),
    metaSlug: $('meta-slug'),
    metaDate: $('meta-date'),
    metaAuthor: $('meta-author'),
    metaCategory: $('meta-category'),
    metaTags: $('meta-tags'),
    excerptKr: $('excerpt-kr'),
    excerptEn: $('excerpt-en'),
    excerptJp: $('excerpt-jp'),
    thumbnailArea: $('thumbnail-area'),
    thumbnailPlaceholder: $('thumbnail-placeholder'),
    thumbnailPreview: $('thumbnail-preview'),
    thumbnailRemove: $('thumbnail-remove'),
    thumbnailInput: $('thumbnail-input'),
    imageDrop: $('image-drop'),
    imageList: $('image-list'),
    imageInput: $('image-input'),
    fileInput: $('file-input'),
    toastContainer: $('toast-container'),
    modalOverlay: $('modal-overlay'),
    modalTitle: $('modal-title'),
    modalBody: $('modal-body'),
    modalFooter: $('modal-footer'),
    modalClose: $('modal-close'),
    imageResizePopup: $('image-resize-popup'),
    resizeWidth: $('resize-width'),
    resizeApply: $('resize-apply'),
    resizeDelete: $('resize-delete'),
    btnNew: $('btn-new'),
    btnOpen: $('btn-open'),
    btnExport: $('btn-export'),
    btnSaveDraft: $('btn-save-draft'),
    btnSaveGuide: $('btn-save-guide')
};

// ============================================
// Utilities
// ============================================

function toast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    dom.toastContainer.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function setModified(val) {
    state.modified = val;
    dom.status.className = val ? 'status modified' : 'status';
    dom.status.textContent = val ? 'Modified' : '';
}

function autoSave() {
    if (!state.modified) return;
    const hasContent = dom.editors.kr.textContent.trim() ||
                       dom.editors.en.textContent.trim() ||
                       dom.editors.jp.textContent.trim() ||
                       dom.titleKr.value || dom.titleEn.value || dom.titleJp.value;
    if (!hasContent) return;
    saveDraft(true);
}

function slugify(text) {
    return text.toLowerCase()
        .replace(/[가-힣]+/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50) || 'untitled';
}

function formatDate(date) {
    const d = new Date(date);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} +0900`;
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ============================================
// Modal
// ============================================

function showModal(title, bodyHtml, buttons = []) {
    dom.modalTitle.textContent = title;
    dom.modalBody.innerHTML = bodyHtml;
    dom.modalFooter.innerHTML = '';

    buttons.forEach(btn => {
        const b = document.createElement('button');
        b.className = btn.primary ? 'btn-primary' : 'btn-small';
        b.textContent = btn.text;
        b.onclick = () => {
            if (btn.action) btn.action();
            hideModal();
        };
        dom.modalFooter.appendChild(b);
    });

    dom.modalOverlay.classList.add('active');
}

function hideModal() {
    dom.modalOverlay.classList.remove('active');
}

// ============================================
// Sidebar Toggle
// ============================================

function toggleSidebar() {
    const app = document.querySelector('.app');
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
        app.classList.toggle('sidebar-open');
    } else {
        app.classList.toggle('sidebar-collapsed');
    }
}

// ============================================
// Categories (Auto-loaded)
// ============================================

async function loadCategories() {
    try {
        const response = await fetch('../guides/data/categories.json?v=' + Date.now());
        if (!response.ok) return;
        const categories = await response.json();
        const select = dom.metaCategory;
        const currentVal = select.value;
        select.innerHTML = '';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = `${cat.labels.kr} / ${cat.labels.en}`;
            select.appendChild(opt);
        });
        if (currentVal) select.value = currentVal;
    } catch (e) {
        console.warn('Could not load categories:', e);
    }
}

// ============================================
// Guides List (Auto-loaded)
// ============================================

async function loadGuidesList() {
    try {
        const response = await fetch('../guides/data/guides-list.json');
        if (!response.ok) throw new Error('Not found');
        state.guides = await response.json();
        renderGuidesList();
    } catch (e) {
        console.warn('Could not load guides:', e);
        dom.guidesList.innerHTML = '<div class="posts-empty">No guides found</div>';
    }
}

function renderGuidesList() {
    if (state.guides.length === 0) {
        dom.guidesList.innerHTML = '<div class="posts-empty">No guides found</div>';
        return;
    }

    // Sort by date descending
    const sorted = [...state.guides].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    dom.guidesList.innerHTML = sorted.map((guide, i) => `
        <div class="post-item" data-id="${guide.id}">
            <div class="post-item-title">${guide.titles?.kr || guide.id}</div>
            <div class="post-item-date">${guide.date}</div>
            <div class="post-item-actions">
                <button class="post-item-action delete" data-id="${guide.id}" title="Delete guide">Del</button>
            </div>
        </div>
    `).join('');

    dom.guidesList.querySelectorAll('.post-item').forEach(item => {
        item.onclick = async (e) => {
            if (e.target.classList.contains('delete')) return;
            const id = item.dataset.id;
            await loadGuideById(id);
        };
    });

    dom.guidesList.querySelectorAll('.post-item-action.delete').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            deleteGuide(btn.dataset.id);
        };
    });
}

function generatePageHtml(guideData) {
    const title = guideData.titles?.kr || guideData.id;
    const desc = guideData.excerpts?.kr || '';
    const thumb = guideData.thumbnail || '/assets/img/home/seo.png';
    const safeTitle = title.includes("'") ? `"${title} - 루페르넷"` : `${title} - 루페르넷`;
    return `---
layout: default
custom_css: []
custom_js: []
permalink: /article/${guideData.id}/
language: kr
title: ${safeTitle}
description: ${desc}
image: ${thumb}
---

<head>
    <link rel="stylesheet" href="/apps/guides/guides.css">
    <script src="/apps/guides/guides.js"></script>
</head>

<div class="main-wrapper">
    <div class="guide-view-container" id="guide-view-container">
        <div class="guides-loading">Loading guide</div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    Navigation.load('article');
    VersionChecker.check();
    Guides.loadGuide('${guideData.id}');
});
</script>
`;
}

async function saveGuidePage(guidesHandle, guideData) {
    try {
        const pagesHandle = await guidesHandle.getDirectoryHandle('pages', { create: true });
        const pageHandle = await pagesHandle.getFileHandle(`${guideData.id}.html`, { create: true });
        const writable = await pageHandle.createWritable();
        await writable.write(generatePageHtml(guideData));
        await writable.close();
    } catch (e) {
        console.warn('Could not save page:', e);
    }
}

async function deleteGuidePage(guidesHandle, id) {
    try {
        const pagesHandle = await guidesHandle.getDirectoryHandle('pages');
        await pagesHandle.removeEntry(`${id}.html`);
    } catch (e) {
        console.warn('Could not delete page:', e);
    }
}

async function deleteGuide(id) {
    if (!confirm(`Delete guide "${id}"?`)) return;

    if (!state.rootHandle) {
        try {
            state.rootHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        } catch (e) {
            if (e.name !== 'AbortError') toast('Failed to select folder', 'error');
            return;
        }
    }

    try {
        const appsHandle = await state.rootHandle.getDirectoryHandle('apps');
        const guidesHandle = await appsHandle.getDirectoryHandle('guides');
        const dataHandle = await guidesHandle.getDirectoryHandle('data');
        const postsHandle = await dataHandle.getDirectoryHandle('posts');

        // Delete guide JSON file
        try {
            await postsHandle.removeEntry(`${id}.json`);
        } catch (e) {
            console.warn('Could not delete guide file:', e);
        }

        // Delete assets folder
        try {
            const assetsHandle = await dataHandle.getDirectoryHandle('assets');
            await assetsHandle.removeEntry(id, { recursive: true });
        } catch (e) {
            console.warn('Could not delete assets folder:', e);
        }

        // Delete page HTML
        await deleteGuidePage(guidesHandle, id);

        // Remove from guides-list.json
        state.guides = state.guides.filter(g => g.id !== id);
        const listHandle = await dataHandle.getFileHandle('guides-list.json', { create: true });
        const writable = await listHandle.createWritable();
        await writable.write(JSON.stringify(state.guides, null, 2));
        await writable.close();

        renderGuidesList();
        toast(`Deleted "${id}"`, 'success');
    } catch (e) {
        console.error('Delete error:', e);
        toast('Failed to delete guide', 'error');
    }
}

async function loadGuideById(id) {
    try {
        const response = await fetch(`../guides/data/posts/${id}.json`);
        if (!response.ok) throw new Error('Not found');
        const content = await response.text();
        await loadGuideJson(content, `${id}.json`);
        state.currentDraftId = null;
    } catch (e) {
        console.error('Error loading guide:', e);
        toast('Failed to load guide', 'error');
    }
}

// ============================================
// Drafts (LocalStorage)
// ============================================

const DRAFTS_KEY = 'article-editor-drafts';

function loadDrafts() {
    try {
        const stored = localStorage.getItem(DRAFTS_KEY);
        state.drafts = stored ? JSON.parse(stored) : [];
    } catch (e) {
        state.drafts = [];
    }
    renderDraftsList();
}

function saveDrafts() {
    try {
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(state.drafts));
    } catch (e) {
        console.error('Failed to save drafts:', e);
    }
}

function saveDraft(silent = false) {
    const slug = dom.metaSlug.value || slugify(dom.titleKr.value || dom.titleEn.value || 'untitled');
    const now = new Date().toISOString();

    // Sync code editors if in code mode
    if (state.currentMode === 'code') {
        syncCodeToVisual();
    }

    const draftData = {
        id: state.currentDraftId || `draft-${Date.now()}`,
        slug: slug,
        titles: {
            kr: dom.titleKr.value || '',
            en: dom.titleEn.value || '',
            jp: dom.titleJp.value || ''
        },
        contents: {
            kr: dom.editors.kr.innerHTML,
            en: dom.editors.en.innerHTML,
            jp: dom.editors.jp.innerHTML
        },
        excerpts: {
            kr: dom.excerptKr.value || '',
            en: dom.excerptEn.value || '',
            jp: dom.excerptJp.value || ''
        },
        meta: {
            date: dom.metaDate.value,
            author: dom.metaAuthor.value,
            category: dom.metaCategory.value,
            tags: dom.metaTags.value
        },
        thumbnailData: state.thumbnail?.dataUrl || null,
        thumbnailName: state.thumbnail?.name || null,
        updatedAt: now,
        createdAt: state.currentDraftId ?
            (state.drafts.find(d => d.id === state.currentDraftId)?.createdAt || now) : now
    };

    // Update or add draft
    const existingIdx = state.drafts.findIndex(d => d.id === draftData.id);
    if (existingIdx >= 0) {
        state.drafts[existingIdx] = draftData;
    } else {
        state.drafts.unshift(draftData);
    }

    state.currentDraftId = draftData.id;
    saveDrafts();

    if (silent) {
        // Auto-save: update list but don't change modified state
        renderDraftsList();
        dom.status.textContent = 'Auto-saved';
        dom.status.className = 'status autosaved';
        setTimeout(() => {
            if (state.modified) {
                dom.status.textContent = 'Modified';
                dom.status.className = 'status modified';
            }
        }, 3000);
    } else {
        renderDraftsList();
        setModified(false);
        toast('Draft saved locally');
    }
}

function renderDraftsList() {
    // Update count badge
    if (dom.draftsCount) {
        dom.draftsCount.textContent = state.drafts.length;
        dom.draftsCount.classList.toggle('has-items', state.drafts.length > 0);
    }

    if (state.drafts.length === 0) {
        dom.draftsList.innerHTML = '<div class="posts-empty">No drafts saved</div>';
        return;
    }

    // Sort by updatedAt descending
    const sorted = [...state.drafts].sort((a, b) =>
        new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    dom.draftsList.innerHTML = sorted.map(draft => {
        const title = draft.titles?.kr || draft.slug || 'Untitled';
        const date = new Date(draft.updatedAt).toLocaleDateString();
        return `
            <div class="post-item draft" data-id="${draft.id}">
                <div class="post-item-title">
                    ${title}
                    <span class="post-item-badge">Draft</span>
                </div>
                <div class="post-item-date">${date}</div>
                <div class="post-item-actions">
                    <button class="post-item-action load" data-id="${draft.id}">Load</button>
                    <button class="post-item-action delete" data-id="${draft.id}">Delete</button>
                </div>
            </div>
        `;
    }).join('');

    // Bind events
    dom.draftsList.querySelectorAll('.post-item-action.load').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            loadDraft(btn.dataset.id);
        };
    });

    dom.draftsList.querySelectorAll('.post-item-action.delete').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            deleteDraft(btn.dataset.id);
        };
    });
}

function loadDraft(id) {
    const draft = state.drafts.find(d => d.id === id);
    if (!draft) return;

    // Confirm if modified
    if (state.modified) {
        if (!confirm('You have unsaved changes. Discard them?')) return;
    }

    // Load draft data
    dom.metaSlug.value = draft.slug || '';
    dom.metaDate.value = draft.meta?.date || new Date().toISOString().split('T')[0];
    dom.metaAuthor.value = draft.meta?.author || 'AbsolRoot';
    dom.metaCategory.value = draft.meta?.category || 'growth';
    dom.metaTags.value = draft.meta?.tags || 'guide';

    dom.excerptKr.value = draft.excerpts?.kr || '';
    dom.excerptEn.value = draft.excerpts?.en || '';
    dom.excerptJp.value = draft.excerpts?.jp || '';

    dom.titleKr.value = draft.titles?.kr || '';
    dom.titleEn.value = draft.titles?.en || '';
    dom.titleJp.value = draft.titles?.jp || '';
    dom.editorTitle.textContent = dom.titleKr.value;

    dom.editors.kr.innerHTML = draft.contents?.kr || '<p><br></p>';
    dom.editors.en.innerHTML = draft.contents?.en || '<p><br></p>';
    dom.editors.jp.innerHTML = draft.contents?.jp || '<p><br></p>';

    // Sync to code editors
    syncVisualToCode();

    // Load thumbnail
    if (draft.thumbnailData && draft.thumbnailName) {
        state.thumbnail = { name: draft.thumbnailName, dataUrl: draft.thumbnailData };
        dom.thumbnailPreview.src = draft.thumbnailData;
        dom.thumbnailPreview.classList.remove('hidden');
        dom.thumbnailPlaceholder.classList.add('hidden');
        dom.thumbnailRemove.classList.remove('hidden');
    } else {
        removeThumbnail();
    }

    state.currentDraftId = id;
    state.images = [];
    renderImageList();
    dom.filename.textContent = `${draft.slug || 'draft'} (Draft)`;
    setModified(false);
    toast('Draft loaded');
}

function deleteDraft(id) {
    if (!confirm('Delete this draft?')) return;

    state.drafts = state.drafts.filter(d => d.id !== id);
    saveDrafts();
    renderDraftsList();

    if (state.currentDraftId === id) {
        state.currentDraftId = null;
    }

    toast('Draft deleted');
}

// ============================================
// Code Mode
// ============================================

function switchMode(mode) {
    if (state.currentMode === mode) return;

    // Sync content before switching
    if (state.currentMode === 'visual' && mode === 'code') {
        syncVisualToCode();
    } else if (state.currentMode === 'code' && mode === 'visual') {
        syncCodeToVisual();
    }

    state.currentMode = mode;

    // Update button states
    dom.modeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Update editor visibility
    document.querySelectorAll('.editor-wrapper').forEach(wrapper => {
        const wrapperMode = wrapper.dataset.mode;
        const wrapperLang = wrapper.dataset.lang;
        const isActive = wrapperMode === mode && wrapperLang === state.currentLang;
        wrapper.classList.toggle('active', isActive);
    });

    // Show/hide toolbar in code mode
    document.querySelector('.toolbar').style.opacity = mode === 'code' ? '0.5' : '1';
    document.querySelector('.toolbar').style.pointerEvents = mode === 'code' ? 'none' : 'auto';
}

function syncVisualToCode() {
    dom.codeEditors.kr.value = formatHtml(dom.editors.kr.innerHTML);
    dom.codeEditors.en.value = formatHtml(dom.editors.en.innerHTML);
    dom.codeEditors.jp.value = formatHtml(dom.editors.jp.innerHTML);
}

function syncCodeToVisual() {
    dom.editors.kr.innerHTML = dom.codeEditors.kr.value || '<p><br></p>';
    dom.editors.en.innerHTML = dom.codeEditors.en.value || '<p><br></p>';
    dom.editors.jp.innerHTML = dom.codeEditors.jp.value || '<p><br></p>';
}

function formatHtml(html) {
    // Simple HTML formatting for readability
    if (!html) return '';

    // Replace self-closing and void elements
    let formatted = html
        .replace(/>\s+</g, '>\n<')
        .replace(/<(\/?(h[1-6]|p|div|table|thead|tbody|tr|ul|ol|li|blockquote|pre|hr))/gi, '\n<$1')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    return formatted;
}

// ============================================
// Thumbnail
// ============================================

function handleThumbnailUpload(file) {
    if (!file || !file.type.startsWith('image/')) return;

    readFileAsDataUrl(file).then(dataUrl => {
        state.thumbnail = { name: file.name, dataUrl, file };
        dom.thumbnailPreview.src = dataUrl;
        dom.thumbnailPreview.classList.remove('hidden');
        dom.thumbnailPlaceholder.classList.add('hidden');
        dom.thumbnailRemove.classList.remove('hidden');
        setModified(true);
    });
}

function removeThumbnail() {
    state.thumbnail = null;
    state.existingThumbnailPath = null;
    dom.thumbnailPreview.src = '';
    dom.thumbnailPreview.classList.add('hidden');
    dom.thumbnailPlaceholder.classList.remove('hidden');
    dom.thumbnailRemove.classList.add('hidden');
    setModified(true);
}

// ============================================
// Images
// ============================================

async function addImages(files) {
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const dataUrl = await readFileAsDataUrl(file);
        state.images.push({ name: file.name, dataUrl, file });
    }
    renderImageList();
    setModified(true);
    toast(`${files.length} image(s) added`);
}

function renderImageList() {
    if (state.images.length === 0) {
        dom.imageList.innerHTML = '';
        return;
    }

    dom.imageList.innerHTML = state.images.map((img, i) => `
        <div class="image-item" data-index="${i}" title="${img.name}">
            <img src="${img.dataUrl}" alt="${img.name}">
            <div class="image-item-actions">
                <button class="image-item-btn insert" data-index="${i}" title="Insert">+</button>
                <button class="image-item-btn delete" data-index="${i}" title="Delete">&times;</button>
            </div>
        </div>
    `).join('');

    // Insert buttons
    dom.imageList.querySelectorAll('.image-item-btn.insert').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            insertImageToEditor(state.images[idx]);
        };
    });

    // Delete buttons
    dom.imageList.querySelectorAll('.image-item-btn.delete').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            state.images.splice(idx, 1);
            renderImageList();
            setModified(true);
            toast('Image removed');
        };
    });
}

function insertImageToEditor(img) {
    const editor = dom.editors[state.currentLang];
    editor.focus();

    const imgEl = document.createElement('img');
    imgEl.src = img.dataUrl;
    imgEl.alt = img.name;
    imgEl.dataset.filename = img.name;
    imgEl.style.maxWidth = '100%';

    const selection = window.getSelection();
    if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(imgEl);

        // Move cursor after image
        range.setStartAfter(imgEl);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        editor.appendChild(imgEl);
    }

    // Add line break after
    const br = document.createElement('br');
    imgEl.parentNode.insertBefore(br, imgEl.nextSibling);

    setModified(true);
    toast('Image inserted');
}

// ============================================
// Image Resize
// ============================================

function showImageResize(img, e) {
    state.selectedImage = img;
    img.classList.add('selected');

    const popup = dom.imageResizePopup;
    popup.classList.remove('hidden');

    // Position popup near image
    const rect = img.getBoundingClientRect();
    popup.style.left = rect.left + 'px';
    popup.style.top = (rect.bottom + 10) + 'px';

    dom.resizeWidth.value = img.width || img.naturalWidth;
}

function hideImageResize() {
    if (state.selectedImage) {
        state.selectedImage.classList.remove('selected');
        state.selectedImage = null;
    }
    dom.imageResizePopup.classList.add('hidden');
}

function applyImageResize() {
    if (!state.selectedImage) return;
    const width = parseInt(dom.resizeWidth.value);
    if (width > 0) {
        state.selectedImage.style.width = width + 'px';
        state.selectedImage.style.height = 'auto';
        setModified(true);
    }
    hideImageResize();
}

function deleteSelectedImage() {
    if (!state.selectedImage) return;
    state.selectedImage.remove();
    hideImageResize();
    setModified(true);
    toast('Image deleted');
}

// ============================================
// Image Drag & Drop (in-editor reorder)
// ============================================

let dropIndicator = null;

function getOrCreateDropIndicator() {
    if (!dropIndicator) {
        dropIndicator = document.createElement('div');
        dropIndicator.className = 'drop-indicator';
    }
    return dropIndicator;
}

function updateDropIndicator(editor, clientY) {
    const indicator = getOrCreateDropIndicator();
    const children = Array.from(editor.children).filter(
        c => c !== indicator && c !== state.draggedImage
    );

    let target = null;
    for (const child of children) {
        const rect = child.getBoundingClientRect();
        if (clientY < rect.top + rect.height / 2) {
            target = child;
            break;
        }
    }

    if (target) {
        editor.insertBefore(indicator, target);
    } else {
        editor.appendChild(indicator);
    }
}

function removeDropIndicator() {
    if (dropIndicator && dropIndicator.parentNode) {
        dropIndicator.remove();
    }
}

function getDropTarget(editor, clientY) {
    const children = Array.from(editor.children).filter(
        c => c !== dropIndicator && c !== state.draggedImage
    );
    for (const child of children) {
        const rect = child.getBoundingClientRect();
        if (clientY < rect.top + rect.height / 2) {
            return child;
        }
    }
    return null;
}

// ============================================
// Toolbar Actions
// ============================================

function execAction(action) {
    const editor = dom.editors[state.currentLang];
    editor.focus();

    switch (action) {
        case 'h1':
            document.execCommand('formatBlock', false, 'h1');
            break;
        case 'h2':
            document.execCommand('formatBlock', false, 'h2');
            break;
        case 'h3':
            document.execCommand('formatBlock', false, 'h3');
            break;
        case 'bold':
            document.execCommand('bold', false, null);
            break;
        case 'italic':
            document.execCommand('italic', false, null);
            break;
        case 'underline':
            document.execCommand('underline', false, null);
            break;
        case 'strike':
            document.execCommand('strikeThrough', false, null);
            break;
        case 'ul':
            document.execCommand('insertUnorderedList', false, null);
            break;
        case 'ol':
            document.execCommand('insertOrderedList', false, null);
            break;
        case 'quote':
            document.execCommand('formatBlock', false, 'blockquote');
            break;
        case 'code':
            wrapWithCode();
            break;
        case 'link':
            insertLinkModal();
            break;
        case 'image':
            showImageModal();
            break;
        case 'table':
            showTableModal();
            break;
        case 'hr':
            document.execCommand('insertHorizontalRule', false, null);
            break;
    }

    setModified(true);
}

function wrapWithCode() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText.includes('\n')) {
            // Code block
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.textContent = selectedText || 'code here';
            pre.appendChild(code);
            range.deleteContents();
            range.insertNode(pre);
        } else {
            // Inline code
            const code = document.createElement('code');
            code.textContent = selectedText || 'code';
            range.deleteContents();
            range.insertNode(code);
        }
    }
}

function insertLinkModal() {
    const selection = window.getSelection();
    const selectedText = selection.toString();

    showModal('Insert Link', `
        <div class="modal-field">
            <label>Text</label>
            <input type="text" id="link-text" value="${selectedText}" placeholder="Link text">
        </div>
        <div class="modal-field">
            <label>URL</label>
            <input type="text" id="link-url" placeholder="https://...">
        </div>
    `, [
        { text: 'Cancel' },
        { text: 'Insert', primary: true, action: () => {
            const text = $('link-text').value || 'link';
            const url = $('link-url').value;
            if (url) {
                const editor = dom.editors[state.currentLang];
                editor.focus();
                const a = document.createElement('a');
                a.href = url;
                a.textContent = text;
                document.execCommand('insertHTML', false, a.outerHTML);
                setModified(true);
            }
        }}
    ]);
}

function showImageModal() {
    let imagesHtml = '<div class="posts-empty">No images uploaded yet</div>';
    if (state.images.length > 0) {
        imagesHtml = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">' +
            state.images.map((img, i) => `
                <img src="${img.dataUrl}" alt="${img.name}"
                     style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:4px;cursor:pointer;border:2px solid transparent;"
                     onclick="this.style.borderColor=this.style.borderColor?'':'var(--accent)';window._selectedImgIdx=${i}">
            `).join('') + '</div>';
    }

    showModal('Insert Image', `
        <p style="margin-bottom:12px;color:var(--text-secondary);">Select from uploaded images or enter URL:</p>
        ${imagesHtml}
        <div class="modal-field" style="margin-top:16px;">
            <label>Or enter image URL</label>
            <input type="text" id="image-url" placeholder="https://...">
        </div>
    `, [
        { text: 'Cancel' },
        { text: 'Insert', primary: true, action: () => {
            const url = $('image-url').value;
            const editor = dom.editors[state.currentLang];
            editor.focus();

            if (url) {
                const img = document.createElement('img');
                img.src = url;
                img.style.maxWidth = '100%';
                document.execCommand('insertHTML', false, img.outerHTML + '<br>');
            } else if (typeof window._selectedImgIdx === 'number') {
                insertImageToEditor(state.images[window._selectedImgIdx]);
                delete window._selectedImgIdx;
            }
            setModified(true);
        }}
    ]);
}

function showTableModal() {
    showModal('Insert Table', `
        <div style="display:flex;gap:16px;">
            <div class="modal-field" style="flex:1;">
                <label>Rows</label>
                <input type="number" id="table-rows" value="3" min="1" max="20">
            </div>
            <div class="modal-field" style="flex:1;">
                <label>Columns</label>
                <input type="number" id="table-cols" value="3" min="1" max="10">
            </div>
        </div>
        <div class="modal-field">
            <label><input type="checkbox" id="table-header" checked> Include header row</label>
        </div>
    `, [
        { text: 'Cancel' },
        { text: 'Insert', primary: true, action: () => {
            const rows = parseInt($('table-rows').value) || 3;
            const cols = parseInt($('table-cols').value) || 3;
            const hasHeader = $('table-header').checked;

            const table = document.createElement('table');

            for (let r = 0; r < rows; r++) {
                const tr = document.createElement('tr');
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement(r === 0 && hasHeader ? 'th' : 'td');
                    cell.textContent = r === 0 && hasHeader ? `Header ${c + 1}` : `Cell`;
                    tr.appendChild(cell);
                }
                table.appendChild(tr);
            }

            const editor = dom.editors[state.currentLang];
            editor.focus();
            document.execCommand('insertHTML', false, table.outerHTML + '<p><br></p>');
            setModified(true);
        }}
    ]);
}

// ============================================
// Language Switch
// ============================================

function switchLanguage(lang) {
    state.currentLang = lang;

    dom.langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update editor wrapper visibility based on both language and mode
    document.querySelectorAll('.editor-wrapper').forEach(wrapper => {
        const wrapperMode = wrapper.dataset.mode;
        const wrapperLang = wrapper.dataset.lang;
        const isActive = wrapperMode === state.currentMode && wrapperLang === lang;
        wrapper.classList.toggle('active', isActive);
    });

    // Update title
    const titles = { kr: dom.titleKr.value, en: dom.titleEn.value, jp: dom.titleJp.value };
    if (titles[lang]) {
        dom.editorTitle.textContent = titles[lang];
    }
}

// ============================================
// New / Reset
// ============================================

function newArticle() {
    if (state.modified) {
        if (!confirm('You have unsaved changes. Discard them?')) return;
    }

    dom.metaSlug.value = '';
    dom.metaDate.value = new Date().toISOString().split('T')[0];
    dom.metaAuthor.value = 'AbsolRoot';
    dom.metaCategory.value = 'growth';
    dom.metaTags.value = 'guide';
    dom.excerptKr.value = '';
    dom.excerptEn.value = '';
    dom.excerptJp.value = '';
    dom.titleKr.value = '';
    dom.titleEn.value = '';
    dom.titleJp.value = '';
    dom.editorTitle.textContent = '';
    dom.editors.kr.innerHTML = '';
    dom.editors.en.innerHTML = '';
    dom.editors.jp.innerHTML = '';

    // Clear code editors too
    dom.codeEditors.kr.value = '';
    dom.codeEditors.en.value = '';
    dom.codeEditors.jp.value = '';

    state.images = [];
    state.thumbnail = null;
    state.existingThumbnailPath = null;
    state.currentDraftId = null;
    removeThumbnail();
    renderImageList();
    dom.filename.textContent = 'New Article';
    setModified(false);
}

// ============================================
// HTML to Markdown
// ============================================

function htmlToMarkdown(el) {
    const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const tag = node.tagName;
        const children = Array.from(node.childNodes).map(processNode).join('');

        switch (tag) {
            case 'H1': return `# ${children}\n\n`;
            case 'H2': return `## ${children}\n\n`;
            case 'H3': return `### ${children}\n\n`;
            case 'P': return `${children}\n\n`;
            case 'BR': return '\n';
            case 'STRONG':
            case 'B': return `**${children}**`;
            case 'EM':
            case 'I': return `*${children}*`;
            case 'U': return `<u>${children}</u>`;
            case 'STRIKE':
            case 'S': return `~~${children}~~`;
            case 'A': return `[${children}](${node.href})`;
            case 'CODE':
                if (node.parentNode.tagName === 'PRE') return children;
                return `\`${children}\``;
            case 'PRE': return `\`\`\`\n${node.textContent}\n\`\`\`\n\n`;
            case 'BLOCKQUOTE':
                return children.split('\n').filter(l => l.trim()).map(l => `> ${l}`).join('\n') + '\n\n';
            case 'UL':
                return Array.from(node.children).map(li => `- ${processNode(li).trim()}`).join('\n') + '\n\n';
            case 'OL':
                return Array.from(node.children).map((li, i) => `${i + 1}. ${processNode(li).trim()}`).join('\n') + '\n\n';
            case 'LI': return children;
            case 'HR': return '---\n\n';
            case 'IMG':
                // Use original path if available (from loaded post)
                const originalPath = node.dataset.originalPath;
                const filename = node.dataset.filename || 'image';
                const slug = dom.metaSlug.value || slugify(dom.titleKr.value || 'untitled');
                const width = node.style.width ? ` style="width:${node.style.width}"` : '';

                if (originalPath) {
                    // Keep original path for existing images
                    return `<img src="${originalPath}"${width}>\n\n`;
                } else if (node.src.startsWith('data:')) {
                    // New image uploaded via editor
                    return `<img src="/apps/article/asset/${slug}/${filename}"${width}>\n\n`;
                }
                return `<img src="${node.src}"${width}>\n\n`;
            case 'TABLE':
                return processTable(node);
            case 'DIV':
            case 'SPAN':
                return children;
            default:
                return children;
        }
    };

    let md = '';
    Array.from(el.childNodes).forEach(node => {
        md += processNode(node);
    });

    return md.replace(/\n{3,}/g, '\n\n').trim();
}

function processTable(table) {
    const rows = Array.from(table.querySelectorAll('tr'));
    if (!rows.length) return '';

    let md = '';
    rows.forEach((row, i) => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        const line = '| ' + cells.map(c => c.textContent.trim()).join(' | ') + ' |';
        md += line + '\n';
        if (i === 0) {
            md += '| ' + cells.map(() => '---').join(' | ') + ' |\n';
        }
    });

    return md + '\n';
}

// ============================================
// Generate & Save
// ============================================

function generateMarkdown() {
    const slug = dom.metaSlug.value || slugify(dom.titleKr.value || dom.titleEn.value || 'untitled');
    const date = dom.metaDate.value ? formatDate(dom.metaDate.value) : formatDate(new Date());
    const author = dom.metaAuthor.value || 'AbsolRoot';
    const category = dom.metaCategory.value || 'growth';
    const tags = dom.metaTags.value || 'guide';
    const titleKr = dom.titleKr.value || dom.editorTitle.textContent || '';
    const titleEn = dom.titleEn.value || '';
    const titleJp = dom.titleJp.value || '';
    const thumbnail = state.thumbnail ? `/apps/article/asset/${slug}/${state.thumbnail.name}` : '';

    let frontmatter = `---
layout: article
title: "${titleKr}"
date: ${date}
categories: [${category}]
tags: [${tags}]
author: ${author}`;

    if (thumbnail) {
        frontmatter += `\nthumbnail: ${thumbnail}`;
    }

    frontmatter += `
translations:
  kr:
    title: "${titleKr}"
  en:
    title: "${titleEn}"
  jp:
    title: "${titleJp}"
kramdown:
  parse_block_html: true
---

<div class="content-kr" markdown="1">

${htmlToMarkdown(dom.editors.kr)}

</div>

<div class="content-en" markdown="1">

${htmlToMarkdown(dom.editors.en)}

</div>

<div class="content-jp" markdown="1">

${htmlToMarkdown(dom.editors.jp)}

</div>`;

    return frontmatter;
}

function getFilename() {
    const slug = dom.metaSlug.value || slugify(dom.titleKr.value || dom.titleEn.value || 'untitled');
    const date = dom.metaDate.value || new Date().toISOString().split('T')[0];
    return `${date}-${slug}.md`;
}

async function saveArticle() {
    if (!state.rootHandle) {
        try {
            state.rootHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        } catch (e) {
            if (e.name !== 'AbortError') toast('Failed to select folder', 'error');
            return;
        }
    }

    try {
        const postsHandle = await state.rootHandle.getDirectoryHandle('_posts', { create: true });
        const filename = getFilename();
        const content = generateMarkdown();

        const fileHandle = await postsHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();

        // Save images
        const slug = dom.metaSlug.value || slugify(dom.titleKr.value || 'untitled');
        const appsHandle = await state.rootHandle.getDirectoryHandle('apps', { create: true });
        const articleHandle = await appsHandle.getDirectoryHandle('article', { create: true });
        const assetHandle = await articleHandle.getDirectoryHandle('asset', { create: true });
        const slugHandle = await assetHandle.getDirectoryHandle(slug, { create: true });

        // Save all images
        for (const img of state.images) {
            if (img.file) {
                const imgHandle = await slugHandle.getFileHandle(img.name, { create: true });
                const wr = await imgHandle.createWritable();
                await wr.write(img.file);
                await wr.close();
            }
        }

        // Save thumbnail
        if (state.thumbnail && state.thumbnail.file) {
            const thumbHandle = await slugHandle.getFileHandle(state.thumbnail.name, { create: true });
            const wr = await thumbHandle.createWritable();
            await wr.write(state.thumbnail.file);
            await wr.close();
        }

        dom.filename.textContent = filename;
        setModified(false);
        toast('Saved successfully!');

    } catch (e) {
        console.error(e);
        toast('Save failed: ' + e.message, 'error');
    }
}

async function exportArticle() {
    const filename = getFilename();
    const content = generateMarkdown();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast('Downloaded!');
}

// ============================================
// Image Helpers
// ============================================

function dataUrlToFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
}

function collectAllImages() {
    const allImages = [...state.images];
    const seen = new Set(allImages.map(img => img.name));

    [dom.editors.kr, dom.editors.en, dom.editors.jp].forEach(editor => {
        editor.querySelectorAll('img[data-filename]').forEach(img => {
            const filename = img.dataset.filename;
            if (filename && img.src.startsWith('data:') && !seen.has(filename)) {
                seen.add(filename);
                const file = dataUrlToFile(img.src, filename);
                allImages.push({ name: filename, dataUrl: img.src, file });
            }
        });
    });

    return allImages;
}

// ============================================
// Save Guide (JSON format)
// ============================================

async function saveGuide() {
    // Require slug
    if (!dom.metaSlug.value.trim()) {
        toast('Slug (URL) is required. Set it in the sidebar.', 'error');
        return;
    }

    if (!state.rootHandle) {
        try {
            state.rootHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        } catch (e) {
            if (e.name !== 'AbortError') toast('Failed to select folder', 'error');
            return;
        }
    }

    try {
        const slug = dom.metaSlug.value.trim();

        // Generate guide data
        const guideData = generateGuideJson(slug);

        // Navigate to guides data folder
        const appsHandle = await state.rootHandle.getDirectoryHandle('apps', { create: true });
        const guidesHandle = await appsHandle.getDirectoryHandle('guides', { create: true });
        const dataHandle = await guidesHandle.getDirectoryHandle('data', { create: true });
        const postsHandle = await dataHandle.getDirectoryHandle('posts', { create: true });

        // Save guide JSON
        const guideFilename = `${slug}.json`;
        const guideFileHandle = await postsHandle.getFileHandle(guideFilename, { create: true });
        const guideWritable = await guideFileHandle.createWritable();
        await guideWritable.write(JSON.stringify(guideData, null, 2));
        await guideWritable.close();

        // Update guides-list.json
        await updateGuidesList(dataHandle, guideData);

        // Save/update page HTML
        await saveGuidePage(guidesHandle, guideData);

        // Save images to /apps/guides/data/assets/[slug]/
        const assetsHandle = await dataHandle.getDirectoryHandle('assets', { create: true });
        const slugAssetsHandle = await assetsHandle.getDirectoryHandle(slug, { create: true });

        // Collect all images: state.images + data URL images from editor HTML
        const allImages = collectAllImages();

        for (const img of allImages) {
            if (img.file) {
                const imgHandle = await slugAssetsHandle.getFileHandle(img.name, { create: true });
                const wr = await imgHandle.createWritable();
                await wr.write(img.file);
                await wr.close();
            }
        }

        // Save thumbnail (handle draft-loaded thumbnails without File object)
        if (state.thumbnail) {
            let thumbFile = state.thumbnail.file;
            if (!thumbFile && state.thumbnail.dataUrl) {
                thumbFile = dataUrlToFile(state.thumbnail.dataUrl, state.thumbnail.name);
            }
            if (thumbFile) {
                const thumbHandle = await slugAssetsHandle.getFileHandle(state.thumbnail.name, { create: true });
                const wr = await thumbHandle.createWritable();
                await wr.write(thumbFile);
                await wr.close();
            }
        }

        dom.filename.textContent = guideFilename;
        setModified(false);

        // Remove draft if this was a draft
        if (state.currentDraftId) {
            state.drafts = state.drafts.filter(d => d.id !== state.currentDraftId);
            saveDrafts();
            renderDraftsList();
            state.currentDraftId = null;
        }

        // Reload guides list
        await loadGuidesList();

        toast('Guide saved successfully!');

    } catch (e) {
        console.error(e);
        toast('Save failed: ' + e.message, 'error');
    }
}

function generateGuideJson(slug) {
    // Sync code editors if in code mode
    if (state.currentMode === 'code') {
        syncCodeToVisual();
    }

    // Convert editor HTML to clean HTML
    const contentKr = cleanHtmlContent(dom.editors.kr.innerHTML, slug);
    const contentEn = cleanHtmlContent(dom.editors.en.innerHTML, slug);
    const contentJp = cleanHtmlContent(dom.editors.jp.innerHTML, slug);

    // Thumbnail: explicit upload > existing path > first content image > empty
    let thumbnailPath = '';
    if (state.thumbnail) {
        thumbnailPath = `/apps/guides/data/assets/${slug}/${state.thumbnail.name}`;
    } else if (state.existingThumbnailPath) {
        thumbnailPath = state.existingThumbnailPath;
    } else {
        // Auto-detect first image from content
        for (const editor of [dom.editors.kr, dom.editors.en, dom.editors.jp]) {
            const firstImg = editor.querySelector('img');
            if (firstImg) {
                if (firstImg.dataset.filename) {
                    thumbnailPath = `/apps/guides/data/assets/${slug}/${firstImg.dataset.filename}`;
                } else if (firstImg.dataset.originalPath) {
                    thumbnailPath = firstImg.dataset.originalPath;
                } else if (firstImg.src && !firstImg.src.startsWith('data:')) {
                    try {
                        thumbnailPath = new URL(firstImg.src).pathname;
                    } catch {
                        thumbnailPath = firstImg.src;
                    }
                }
                break;
            }
        }
    }

    return {
        id: slug,
        titles: {
            kr: dom.titleKr.value || '',
            en: dom.titleEn.value || '',
            jp: dom.titleJp.value || ''
        },
        excerpts: {
            kr: dom.excerptKr.value.trim() || extractExcerpt(contentKr),
            en: dom.excerptEn.value.trim() || extractExcerpt(contentEn),
            jp: dom.excerptJp.value.trim() || extractExcerpt(contentJp)
        },
        searchContent: {
            kr: extractPlainText(contentKr),
            en: extractPlainText(contentEn),
            jp: extractPlainText(contentJp)
        },
        category: dom.metaCategory.value || 'growth',
        tags: dom.metaTags.value ? dom.metaTags.value.split(',').map(t => t.trim()) : ['guide'],
        date: dom.metaDate.value || new Date().toISOString().split('T')[0],
        author: dom.metaAuthor.value || 'AbsolRoot',
        thumbnail: thumbnailPath,
        contents: {
            kr: contentKr,
            en: contentEn,
            jp: contentJp
        }
    };
}

function cleanHtmlContent(html, slug) {
    // Create a temporary element to process HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Convert data URLs to file paths
    temp.querySelectorAll('img').forEach(img => {
        const originalPath = img.dataset.originalPath;
        const filename = img.dataset.filename;

        if (originalPath) {
            // Keep original path
            img.src = originalPath;
        } else if (filename && img.src.startsWith('data:')) {
            // New image - use guide assets path
            img.src = `/apps/guides/data/assets/${slug}/${filename}`;
        }

        // Remove data attributes
        delete img.dataset.originalPath;
        delete img.dataset.filename;
    });

    return temp.innerHTML;
}

function extractExcerpt(html, maxLength = 150) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    const trimmed = text.trim().replace(/\s+/g, ' ');
    return trimmed.length > maxLength
        ? trimmed.substring(0, maxLength) + '...'
        : trimmed;
}

function extractPlainText(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return (temp.textContent || temp.innerText || '').trim().replace(/\s+/g, ' ');
}

async function updateGuidesList(dataHandle, guideData) {
    let guidesList = [];

    // Try to load existing list
    try {
        const listHandle = await dataHandle.getFileHandle('guides-list.json');
        const file = await listHandle.getFile();
        const content = await file.text();
        guidesList = JSON.parse(content);
    } catch (e) {
        // File doesn't exist, start fresh
        guidesList = [];
    }

    // Update or add the guide
    const existingIndex = guidesList.findIndex(g => g.id === guideData.id);
    const listEntry = {
        id: guideData.id,
        titles: guideData.titles,
        excerpts: guideData.excerpts,
        searchContent: guideData.searchContent,
        category: guideData.category,
        date: guideData.date,
        author: guideData.author,
        thumbnail: guideData.thumbnail
    };

    if (existingIndex >= 0) {
        guidesList[existingIndex] = listEntry;
    } else {
        guidesList.push(listEntry);
    }

    // Sort by date descending
    guidesList.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save updated list
    const listHandle = await dataHandle.getFileHandle('guides-list.json', { create: true });
    const writable = await listHandle.createWritable();
    await writable.write(JSON.stringify(guidesList, null, 2));
    await writable.close();
}

// ============================================
// Open / Load
// ============================================

async function openArticle() {
    try {
        const [handle] = await window.showOpenFilePicker({
            types: [
                { description: 'Markdown', accept: { 'text/markdown': ['.md'] } },
                { description: 'JSON Guide', accept: { 'application/json': ['.json'] } }
            ]
        });
        const file = await handle.getFile();
        const content = await file.text();

        if (file.name.endsWith('.json')) {
            await loadGuideJson(content, file.name);
        } else {
            await loadMarkdown(content, file.name);
        }
    } catch (e) {
        if (e.name !== 'AbortError') toast('Failed to open', 'error');
    }
}

async function loadGuideJson(content, filename) {
    try {
        const guide = JSON.parse(content);

        // Set metadata
        dom.metaSlug.value = guide.id || '';
        dom.metaDate.value = guide.date || new Date().toISOString().split('T')[0];
        dom.metaAuthor.value = guide.author || 'AbsolRoot';
        dom.metaCategory.value = guide.category || 'growth';
        dom.metaTags.value = Array.isArray(guide.tags) ? guide.tags.join(', ') : 'guide';

        // Set excerpts
        dom.excerptKr.value = guide.excerpts?.kr || '';
        dom.excerptEn.value = guide.excerpts?.en || '';
        dom.excerptJp.value = guide.excerpts?.jp || '';

        // Set titles
        dom.titleKr.value = guide.titles?.kr || '';
        dom.titleEn.value = guide.titles?.en || '';
        dom.titleJp.value = guide.titles?.jp || '';
        dom.editorTitle.textContent = dom.titleKr.value;

        // Reset images
        state.images = [];
        state.thumbnail = null;
        state.existingThumbnailPath = guide.thumbnail || null;
        removeThumbnail();

        // Load thumbnail
        if (guide.thumbnail && state.rootHandle) {
            await loadImageFromPath(guide.thumbnail, true);
        }

        // Set content (HTML)
        dom.editors.kr.innerHTML = guide.contents?.kr || '<p><br></p>';
        dom.editors.en.innerHTML = guide.contents?.en || '<p><br></p>';
        dom.editors.jp.innerHTML = guide.contents?.jp || '<p><br></p>';

        // Sync to code editors
        syncVisualToCode();

        // Load images from content
        const allContent = (guide.contents?.kr || '') + (guide.contents?.en || '') + (guide.contents?.jp || '');
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
        let imgMatch;
        const imagePaths = new Set();

        while ((imgMatch = imgRegex.exec(allContent)) !== null) {
            if (imgMatch[1] && !imgMatch[1].startsWith('data:')) {
                imagePaths.add(imgMatch[1]);
            }
        }

        if (state.rootHandle && imagePaths.size > 0) {
            toast(`Loading ${imagePaths.size} images...`);
            let loadedCount = 0;
            for (const imgPath of imagePaths) {
                const dataUrl = await loadImageFromPath(imgPath, false);
                if (dataUrl) loadedCount++;
            }
            if (loadedCount > 0) {
                toast(`${loadedCount} images loaded`);
            }
        }

        renderImageList();
        dom.filename.textContent = filename;
        setModified(false);
        toast('Guide loaded!');

    } catch (e) {
        console.error('Error loading guide JSON:', e);
        toast('Failed to parse JSON', 'error');
    }
}

async function loadMarkdown(content, filename) {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) {
        toast('Invalid markdown format', 'error');
        return;
    }

    const frontmatter = match[1];
    let body = match[2];

    // Extract values
    const getValue = (key) => {
        const m = frontmatter.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?`, 'm'));
        return m ? m[1] : '';
    };

    const getArrayValue = (key) => {
        const m = frontmatter.match(new RegExp(`^${key}:\\s*\\[([^\\]]+)\\]`, 'm'));
        return m ? m[1] : '';
    };

    dom.metaAuthor.value = getValue('author');
    dom.metaCategory.value = getArrayValue('categories');
    dom.metaTags.value = getArrayValue('tags');

    const dateMatch = frontmatter.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    if (dateMatch) dom.metaDate.value = dateMatch[1];

    const slugMatch = filename.match(/\d{4}-\d{2}-\d{2}-(.+)\.md$/);
    if (slugMatch) dom.metaSlug.value = slugMatch[1];

    const titleKrMatch = frontmatter.match(/kr:\s*\n\s*title:\s*"([^"]*)"/);
    const titleEnMatch = frontmatter.match(/en:\s*\n\s*title:\s*"([^"]*)"/);
    const titleJpMatch = frontmatter.match(/jp:\s*\n\s*title:\s*"([^"]*)"/);

    dom.titleKr.value = titleKrMatch ? titleKrMatch[1] : getValue('title');
    dom.titleEn.value = titleEnMatch ? titleEnMatch[1] : '';
    dom.titleJp.value = titleJpMatch ? titleJpMatch[1] : '';
    dom.editorTitle.textContent = dom.titleKr.value;

    // Parse frontmatter variables (like img_lv.m1: '<img src="...">')
    const pageVars = parseFrontmatterVars(frontmatter);

    // Replace {{ page.xxx }} variables in body
    let replacedCount = 0;
    let notFoundVars = [];

    // First, find all variables in the body to see what we're looking for
    const allVarsInBody = body.match(/\{\{\s*page\.[a-zA-Z0-9_.]+\s*\}\}/g) || [];
    console.log('Template variables found in body:', allVarsInBody.length, allVarsInBody.slice(0, 5));

    body = body.replace(/\{\{\s*page\.([a-zA-Z0-9_.]+)\s*\}\}/g, (match, varPath) => {
        const value = getNestedValue(pageVars, varPath);
        if (value !== undefined) {
            replacedCount++;
            return value;
        }
        notFoundVars.push(varPath);
        return match;
    });

    console.log(`Replaced ${replacedCount} template variables`);
    if (notFoundVars.length > 0) {
        console.warn('Variables not found:', notFoundVars);
    }

    // Reset images
    state.images = [];
    state.thumbnail = null;
    removeThumbnail();

    // Load thumbnail if exists
    const thumbnailMatch = frontmatter.match(/^thumbnail:\s*(.+)$/m);
    if (thumbnailMatch && state.rootHandle) {
        const thumbPath = thumbnailMatch[1].trim();
        await loadImageFromPath(thumbPath, true);
    }

    // Parse content and collect image paths
    const extractContent = (lang) => {
        const regex = new RegExp(`<div\\s+class="content-${lang}"[^>]*>([\\s\\S]*?)<\\/div>`, 'i');
        const m = body.match(regex);
        return m ? m[1].trim() : '';
    };

    const contentKr = extractContent('kr');
    const contentEn = extractContent('en');
    const contentJp = extractContent('jp');
    const allContent = contentKr + contentEn + contentJp + frontmatter;

    // Find all image paths - multiple patterns
    const imagePaths = new Set();

    // Pattern 1: Markdown images ![alt](path)
    const mdImgRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
    let imgMatch;
    while ((imgMatch = mdImgRegex.exec(allContent)) !== null) {
        if (imgMatch[1] && !imgMatch[1].startsWith('data:')) {
            imagePaths.add(imgMatch[1]);
        }
    }

    // Pattern 2: HTML img tags <img src="path">
    const htmlImgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    while ((imgMatch = htmlImgRegex.exec(allContent)) !== null) {
        if (imgMatch[1] && !imgMatch[1].startsWith('data:')) {
            imagePaths.add(imgMatch[1]);
        }
    }

    // Load images from filesystem
    const imageMap = {};
    if (state.rootHandle && imagePaths.size > 0) {
        toast(`Loading ${imagePaths.size} images...`);
        let loadedCount = 0;
        for (const imgPath of imagePaths) {
            const dataUrl = await loadImageFromPath(imgPath, false);
            if (dataUrl) {
                imageMap[imgPath] = dataUrl;
                loadedCount++;
            }
        }
        if (loadedCount > 0) {
            toast(`${loadedCount} images loaded`);
        }
    }

    // Convert markdown to HTML with loaded images
    dom.editors.kr.innerHTML = markdownToHtml(contentKr, imageMap);
    dom.editors.en.innerHTML = markdownToHtml(contentEn, imageMap);
    dom.editors.jp.innerHTML = markdownToHtml(contentJp, imageMap);

    // Sync to code editors
    syncVisualToCode();

    renderImageList();
    dom.filename.textContent = filename;
    state.currentDraftId = null; // Clear draft association
    setModified(false);
    toast('Loaded!');
}

// Parse frontmatter variables like img_lv.m1: '<img src="...">'
function parseFrontmatterVars(frontmatter) {
    const vars = {};

    // Skip standard keys that we don't need
    const skipKeys = ['layout', 'title', 'date', 'categories', 'tags', 'author', 'thumbnail', 'translations', 'kramdown'];

    // Find all groups that start with img_ (or any custom groups)
    // Pattern: key at start of line (no indentation) followed by colon
    const groupRegex = /^([a-zA-Z_][a-zA-Z0-9_]*):\s*$/gm;
    let groupMatch;
    const groupPositions = [];

    while ((groupMatch = groupRegex.exec(frontmatter)) !== null) {
        const groupName = groupMatch[1];
        if (!skipKeys.includes(groupName)) {
            groupPositions.push({
                name: groupName,
                start: groupMatch.index + groupMatch[0].length,
                end: frontmatter.length
            });
        }
    }

    // Set end positions
    for (let i = 0; i < groupPositions.length - 1; i++) {
        // Find next group start
        const nextGroupRegex = new RegExp(`^[a-zA-Z_][a-zA-Z0-9_]*:\\s*$`, 'gm');
        nextGroupRegex.lastIndex = groupPositions[i].start;
        const nextMatch = nextGroupRegex.exec(frontmatter);
        if (nextMatch) {
            groupPositions[i].end = nextMatch.index;
        }
    }

    // Parse each group's content
    for (const group of groupPositions) {
        vars[group.name] = {};
        const content = frontmatter.substring(group.start, group.end);

        // Match indented key-value pairs: "  key: 'value'" or "  key: value"
        const valueRegex = /^\s+([a-zA-Z_][a-zA-Z0-9_]*):\s*(.+)$/gm;
        let valueMatch;

        while ((valueMatch = valueRegex.exec(content)) !== null) {
            const key = valueMatch[1];
            let value = valueMatch[2].trim();

            // Remove surrounding quotes
            if ((value.startsWith("'") && value.endsWith("'")) ||
                (value.startsWith('"') && value.endsWith('"'))) {
                value = value.slice(1, -1);
            }

            vars[group.name][key] = value;
        }
    }

    console.log('Parsed frontmatter vars:', JSON.stringify(vars, null, 2));
    return vars;
}

// Get nested value from object (like "img_lv.m1" from vars)
function getNestedValue(obj, path) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        } else {
            return undefined;
        }
    }
    return current;
}

async function loadImageFromPath(imgPath, isThumbnail) {
    try {
        const filename = imgPath.split('/').pop();
        let dataUrl = null;
        let file = null;

        // Try fetch first (works when served via HTTP)
        try {
            const response = await fetch(imgPath);
            if (response.ok) {
                const blob = await response.blob();
                file = new File([blob], filename, { type: blob.type });
                dataUrl = await readFileAsDataUrl(file);
            }
        } catch (e) {}

        // Fall back to File System API
        if (!dataUrl && state.rootHandle) {
            let relativePath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
            const parts = relativePath.split('/');
            let handle = state.rootHandle;
            for (let i = 0; i < parts.length - 1; i++) {
                handle = await handle.getDirectoryHandle(parts[i]);
            }
            const fileHandle = await handle.getFileHandle(filename);
            file = await fileHandle.getFile();
            dataUrl = await readFileAsDataUrl(file);
        }

        if (!dataUrl) return null;

        if (isThumbnail) {
            state.thumbnail = { name: filename, dataUrl, file };
            dom.thumbnailPreview.src = dataUrl;
            dom.thumbnailPreview.classList.remove('hidden');
            dom.thumbnailPlaceholder.classList.add('hidden');
            dom.thumbnailRemove.classList.remove('hidden');
        } else {
            if (!state.images.find(img => img.name === filename)) {
                state.images.push({ name: filename, dataUrl, file, originalPath: imgPath });
            }
        }

        return dataUrl;
    } catch (e) {
        console.warn('Could not load image:', imgPath, e);
        return null;
    }
}

// Parse markdown tables line by line for robustness
function parseTablesLineByLine(text) {
    const lines = text.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Check if this line starts a table (starts with |)
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            // Check if next line is separator (| --- | --- |)
            const nextLine = lines[i + 1];
            if (nextLine && /^\|[\s:\-|]+\|$/.test(nextLine.trim())) {
                // This is a table! Parse it
                const tableLines = [line];
                let j = i + 1;

                // Collect all table lines (separator + body)
                while (j < lines.length && lines[j].trim().startsWith('|') && lines[j].trim().endsWith('|')) {
                    tableLines.push(lines[j]);
                    j++;
                }

                // Convert to HTML table
                const tableHtml = convertTableLinesToHtml(tableLines);
                result.push(tableHtml);
                i = j;
                continue;
            }
        }

        result.push(line);
        i++;
    }

    return result.join('\n');
}

function convertTableLinesToHtml(tableLines) {
    if (tableLines.length < 2) return tableLines.join('\n');

    const parseRow = (row) => {
        const trimmed = row.trim();
        // Split by | and filter out empty start/end
        const parts = trimmed.split('|');
        if (parts[0].trim() === '') parts.shift();
        if (parts.length > 0 && parts[parts.length - 1].trim() === '') parts.pop();
        return parts.map(c => c.trim());
    };

    try {
        const headerLine = tableLines[0];
        const separatorLine = tableLines[1];
        const bodyLines = tableLines.slice(2);

        const headers = parseRow(headerLine);
        const headerHtml = headers.map(h => `<th>${h}</th>`).join('');

        let bodyHtml = '';
        for (const row of bodyLines) {
            const cells = parseRow(row);
            // Pad cells if needed
            while (cells.length < headers.length) cells.push('');
            bodyHtml += `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
        }

        return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
    } catch (e) {
        console.warn('Table conversion error:', e);
        return tableLines.join('\n');
    }
}

function markdownToHtml(md, imageMap = {}) {
    if (!md) return '<p><br></p>';

    // Helper to replace image src with data URL if available
    const replaceImageSrc = (src) => {
        return imageMap[src] || src;
    };

    let html = md;

    // Store images temporarily to avoid regex issues with base64
    const imageStore = [];

    // Process images first - HTML img tags (before table processing can break them)
    html = html.replace(/<img\s+src="([^"]+)"([^>]*)>/gi, (match, src, attrs) => {
        const dataUrl = replaceImageSrc(src);
        const idx = imageStore.length;
        imageStore.push({ src: dataUrl, attrs: attrs || '', origPath: src });
        return `<<<IMG_${idx}>>>`;
    });

    // Process images - markdown syntax
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        const dataUrl = replaceImageSrc(src);
        const idx = imageStore.length;
        imageStore.push({ src: dataUrl, attrs: ` alt="${alt}"`, origPath: src });
        return `<<<IMG_${idx}>>>`;
    });

    // Normalize line endings first
    html = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Tables - line by line parsing for robustness
    html = parseTablesLineByLine(html);

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold/Italic - must be processed carefully
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic with * - use word boundary instead of lookbehind for compatibility
    html = html.replace(/(\s|>)\*([^*\n]+)\*(\s|<|$)/g, '$1<em>$2</em>$3');

    html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');
    html = html.replace(/^---$/gm, '<hr>');

    // Lists - both - and * markers
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Restore images from store
    html = html.replace(/<<<IMG_(\d+)>>>/g, (match, idx) => {
        const img = imageStore[parseInt(idx)];
        if (img) {
            return `<img src="${img.src}" data-original-path="${img.origPath}"${img.attrs}>`;
        }
        return match;
    });

    // Wrap paragraphs
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
        block = block.trim();
        if (!block) return '';
        // Don't wrap if already a block element
        if (/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|table|thead|tbody|tr|th|td|img|div|p)[\s>]/i.test(block)) {
            return block;
        }
        return `<p>${block}</p>`;
    }).join('\n');

    // Clean up extra newlines
    html = html.replace(/\n{3,}/g, '\n\n');

    return html || '<p><br></p>';
}

// ============================================
// Init
// ============================================

function init() {
    // Set default date
    dom.metaDate.value = new Date().toISOString().split('T')[0];

    // Sidebar toggle
    dom.btnMenu.onclick = toggleSidebar;
    dom.btnCloseSidebar.onclick = toggleSidebar;

    // Backdrop click closes sidebar on mobile
    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) {
        backdrop.onclick = () => {
            document.querySelector('.app').classList.remove('sidebar-open');
        };
    }

    // Load drafts from localStorage
    loadDrafts();

    // Load categories and auto-load guides on init
    loadCategories();
    dom.btnRefreshGuides.onclick = loadGuidesList;
    loadGuidesList();

    // Mode switch (visual/code)
    dom.modeBtns.forEach(btn => {
        btn.onclick = () => switchMode(btn.dataset.mode);
    });

    // Code editor change tracking
    Object.values(dom.codeEditors).forEach(editor => {
        editor.oninput = () => setModified(true);
    });

    // Language switch
    dom.langBtns.forEach(btn => {
        btn.onclick = () => switchLanguage(btn.dataset.lang);
    });

    // Toolbar
    dom.toolBtns.forEach(btn => {
        btn.onclick = () => execAction(btn.dataset.action);
    });

    // Title sync
    dom.editorTitle.oninput = () => {
        const lang = state.currentLang;
        const input = { kr: dom.titleKr, en: dom.titleEn, jp: dom.titleJp }[lang];
        input.value = dom.editorTitle.textContent;
        setModified(true);
    };

    [dom.titleKr, dom.titleEn, dom.titleJp].forEach(input => {
        input.oninput = () => {
            if (input.id === `title-${state.currentLang}`) {
                dom.editorTitle.textContent = input.value;
            }
            setModified(true);
        };
    });

    // Auto slug
    dom.titleKr.onblur = () => {
        if (!dom.metaSlug.value && dom.titleKr.value) {
            dom.metaSlug.value = slugify(dom.titleKr.value);
        }
    };

    // Editors
    Object.values(dom.editors).forEach(editor => {
        editor.oninput = () => setModified(true);

        // Image click for resize
        editor.onclick = (e) => {
            if (e.target.tagName === 'IMG') {
                showImageResize(e.target, e);
            } else {
                hideImageResize();
            }
        };

        // Paste images
        editor.onpaste = async (e) => {
            const items = Array.from(e.clipboardData?.items || []);
            const imageItem = items.find(item => item.type.startsWith('image/'));
            if (imageItem) {
                e.preventDefault();
                const file = imageItem.getAsFile();
                if (file) {
                    const timestamp = Date.now();
                    const ext = file.type.split('/')[1] || 'png';
                    const newFile = new File([file], `pasted-${timestamp}.${ext}`, { type: file.type });
                    await addImages([newFile]);
                    insertImageToEditor(state.images[state.images.length - 1]);
                }
            }
        };

        // Image drag-and-drop: make images draggable on mousedown
        editor.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'IMG') {
                e.target.setAttribute('draggable', 'true');
            }
        });

        editor.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                state.draggedImage = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', '');
            }
        });

        editor.addEventListener('dragend', (e) => {
            if (e.target.tagName === 'IMG') {
                e.target.classList.remove('dragging');
                e.target.removeAttribute('draggable');
            }
            state.draggedImage = null;
            removeDropIndicator();
        });

        // Drag over: show drop indicator or allow external file drop
        editor.ondragover = (e) => {
            e.preventDefault();
            if (state.draggedImage) {
                e.dataTransfer.dropEffect = 'move';
                updateDropIndicator(editor, e.clientY);
            }
        };

        editor.ondragleave = (e) => {
            if (!editor.contains(e.relatedTarget)) {
                removeDropIndicator();
            }
        };

        // Drop: handle internal image move or external file drop
        editor.ondrop = async (e) => {
            // Internal image move
            if (state.draggedImage) {
                e.preventDefault();
                e.stopPropagation();
                const target = getDropTarget(editor, e.clientY);
                const img = state.draggedImage;

                // Wrap image in a <p> if it's a bare child
                const wrapper = document.createElement('p');
                const nextSib = img.nextSibling;
                img.remove();
                if (nextSib && nextSib.nodeName === 'BR') nextSib.remove();
                wrapper.appendChild(img);

                if (target) {
                    editor.insertBefore(wrapper, target);
                } else {
                    editor.appendChild(wrapper);
                }

                img.classList.remove('dragging');
                img.removeAttribute('draggable');
                state.draggedImage = null;
                removeDropIndicator();
                setModified(true);
                return;
            }

            // External file drop
            const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'));
            if (files.length) {
                e.preventDefault();
                await addImages(files);
                insertImageToEditor(state.images[state.images.length - 1]);
            }
        };

        // Keyboard shortcuts
        editor.onkeydown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b': e.preventDefault(); execAction('bold'); break;
                    case 'i': e.preventDefault(); execAction('italic'); break;
                    case 'u': e.preventDefault(); execAction('underline'); break;
                    case 'k': e.preventDefault(); execAction('link'); break;
                    case 's': e.preventDefault(); saveGuide(); break;
                }
            }
        };
    });

    // Close image resize when clicking outside
    document.onclick = (e) => {
        if (!dom.imageResizePopup.contains(e.target) &&
            e.target.tagName !== 'IMG' &&
            !dom.imageResizePopup.classList.contains('hidden')) {
            hideImageResize();
        }
    };

    // Image resize controls
    dom.resizeApply.onclick = applyImageResize;
    dom.resizeDelete.onclick = deleteSelectedImage;

    // Thumbnail
    dom.thumbnailArea.onclick = () => dom.thumbnailInput.click();
    dom.thumbnailInput.onchange = (e) => {
        if (e.target.files[0]) handleThumbnailUpload(e.target.files[0]);
        e.target.value = '';
    };
    dom.thumbnailRemove.onclick = (e) => {
        e.stopPropagation();
        removeThumbnail();
    };

    // Image drop
    dom.imageDrop.onclick = () => dom.imageInput.click();
    dom.imageDrop.ondragover = (e) => {
        e.preventDefault();
        dom.imageDrop.classList.add('dragover');
    };
    dom.imageDrop.ondragleave = () => dom.imageDrop.classList.remove('dragover');
    dom.imageDrop.ondrop = (e) => {
        e.preventDefault();
        dom.imageDrop.classList.remove('dragover');
        const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'));
        if (files.length) addImages(files);
    };
    dom.imageInput.onchange = (e) => {
        addImages(Array.from(e.target.files));
        e.target.value = '';
    };

    // File buttons
    dom.btnNew.onclick = newArticle;
    dom.btnOpen.onclick = openArticle;
    dom.btnExport.onclick = exportArticle;
    dom.btnSaveDraft.onclick = saveDraft;
    dom.btnSaveGuide.onclick = saveGuide;

    // Modal close
    dom.modalClose.onclick = hideModal;
    dom.modalOverlay.onclick = (e) => {
        if (e.target === dom.modalOverlay) hideModal();
    };

    // Warn on leave
    window.onbeforeunload = (e) => {
        if (state.modified) {
            e.preventDefault();
            e.returnValue = '';
        }
    };

    // Global keyboard shortcut
    document.onkeydown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveGuide();
        }
    };

    // Auto-save every 30s if modified
    setInterval(autoSave, 30000);

    console.log('Editor initialized');
}

document.addEventListener('DOMContentLoaded', init);
