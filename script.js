// Initialize Lucide Icons
lucide.createIcons();

// State Management
let files = [];
let activeAgency = "General";
let settings = {
    batchSize: 1,
    rpmEnabled: false,
    rpmLimit: 15,
    autoRename: true,
    applyRating: true
};

// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileGrid = document.getElementById('file-grid');
const batchSizeInput = document.getElementById('batch-size');
const batchVal = document.getElementById('batch-val');
const rpmToggle = document.getElementById('rpm-toggle');
const renameToggle = document.getElementById('rename-toggle');
const ratingToggle = document.getElementById('rating-toggle');
const generateBtn = document.getElementById('generate-btn');
const clearBtn = document.getElementById('clear-btn');

// --- Drag and Drop Logic ---
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-[#ff4d00]', 'bg-[#ff4d00]/5');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-[#ff4d00]', 'bg-[#ff4d00]/5');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-[#ff4d00]', 'bg-[#ff4d00]/5');
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(newFiles) {
    Array.from(newFiles).forEach(file => {
        if (!files.find(f => f.name === file.name)) {
            files.push({
                file: file,
                status: 'pending',
                id: Math.random().toString(36).substr(2, 9)
            });
        }
    });
    renderFiles();
}

function renderFiles() {
    fileGrid.innerHTML = '';
    files.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-[#1a1a1a] p-3 rounded-xl border border-[#2a2a2a] relative group';
        card.innerHTML = `
            <div class="aspect-square bg-[#121212] rounded-lg flex items-center justify-center text-slate-700 mb-3 relative overflow-hidden">
                <i data-lucide="${item.file.type.includes('image') ? 'image' : 'file-code'}" class="w-10 h-10"></i>
                <div class="absolute top-2 left-2 flex flex-col gap-1">
                    <span class="bg-[#ff4d00] text-[8px] font-black px-1.5 py-0.5 rounded text-white uppercase">${activeAgency}</span>
                    ${settings.applyRating ? '<span class="bg-yellow-500 text-[8px] font-black px-1.5 py-0.5 rounded text-white flex items-center gap-0.5">5 <i data-lucide="sparkles" class="w-2 h-2"></i></span>' : ''}
                </div>
                ${settings.autoRename ? '<div class="absolute bottom-2 right-2 bg-blue-600 p-1 rounded-full text-white"><i data-lucide="refresh-cw" class="w-2 h-2"></i></div>' : ''}
                ${item.status === 'processing' ? '<div class="absolute inset-0 bg-black/60 flex items-center justify-center"><i data-lucide="refresh-cw" class="w-8 h-8 text-[#ff4d00] animate-spin"></i></div>' : ''}
                ${item.status === 'completed' ? '<div class="absolute inset-0 bg-green-500/20 flex items-center justify-center"><i data-lucide="check" class="w-8 h-8 text-green-500"></i></div>' : ''}
            </div>
            <p class="text-[10px] font-bold text-white truncate mb-1">${item.file.name}</p>
            <div class="flex justify-between items-center">
                <span class="text-[8px] text-slate-500 font-bold uppercase">${(item.file.size / 1024).toFixed(1)} KB</span>
                <span class="text-[8px] text-[#ff4d00] font-bold uppercase">${item.file.name.split('.').pop()}</span>
            </div>
        `;
        fileGrid.appendChild(card);
    });
    lucide.createIcons();
}

// --- Control Logic ---
batchSizeInput.addEventListener('input', (e) => {
    settings.batchSize = e.target.value;
    batchVal.innerText = `${settings.batchSize}x`;
});

rpmToggle.addEventListener('click', () => {
    settings.rpmEnabled = !settings.rpmEnabled;
    rpmToggle.classList.toggle('bg-[#ff4d00]', settings.rpmEnabled);
    rpmToggle.querySelector('.dot').classList.toggle('left-6', settings.rpmEnabled);
    rpmToggle.querySelector('.dot').classList.toggle('left-1', !settings.rpmEnabled);
});

renameToggle.addEventListener('click', () => {
    settings.autoRename = !settings.autoRename;
    renameToggle.classList.toggle('bg-[#ff4d00]', settings.autoRename);
    renameToggle.querySelector('.dot').classList.toggle('left-6', settings.autoRename);
    renameToggle.querySelector('.dot').classList.toggle('left-1', !settings.autoRename);
    renderFiles();
});

ratingToggle.addEventListener('click', () => {
    settings.applyRating = !settings.applyRating;
    ratingToggle.classList.toggle('bg-[#ff4d00]', settings.applyRating);
    ratingToggle.querySelector('.dot').classList.toggle('left-6', settings.applyRating);
    ratingToggle.querySelector('.dot').classList.toggle('left-1', !settings.applyRating);
    renderFiles();
});

// Agency Selection
document.querySelectorAll('.agency-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.agency-btn.active').classList.remove('active');
        btn.classList.add('active');
        activeAgency = btn.dataset.agency;
        renderFiles();
    });
});

// Generate Button
generateBtn.addEventListener('click', async () => {
    if (files.length === 0) return alert("Please upload files!");
    
    generateBtn.disabled = true;
    generateBtn.innerText = "Processing...";

    for (let i = 0; i < files.length; i++) {
        files[i].status = 'processing';
        renderFiles();
        await new Promise(r => setTimeout(r, 1500)); // Simulate AI
        files[i].status = 'completed';
        renderFiles();
    }

    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i data-lucide="zap" class="w-5 h-5"></i> Generate Metadata';
    lucide.createIcons();
});

clearBtn.addEventListener('click', () => {
    files = [];
    renderFiles();
});

// --- API Modal Logic ---
const apiModal = document.getElementById('api-modal');
const openApiBtn = document.getElementById('open-api-btn');
const closeApiBtn = document.getElementById('close-api-btn');
const apiSlotsContainer = document.getElementById('api-slots');

openApiBtn.onclick = () => {
    apiModal.classList.remove('hidden');
    renderApiSlots();
};
closeApiBtn.onclick = () => apiModal.classList.add('hidden');

function renderApiSlots() {
    apiSlotsContainer.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const div = document.createElement('div');
        div.className = 'space-y-2';
        div.innerHTML = `
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gemini Key Slot ${i}</label>
            <input type="password" class="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl py-2.5 px-4 text-white text-sm focus:ring-2 focus:ring-[#ff4d00] outline-none" placeholder="Enter API Key...">
        `;
        apiSlotsContainer.appendChild(div);
    }
}
