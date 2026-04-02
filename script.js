const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const generateBtn = document.getElementById('generate-btn');

let uploadedFiles = [];

// Handle File Selection
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    uploadedFiles = [...uploadedFiles, ...files];
    renderFiles();
});

function renderFiles() {
    fileList.innerHTML = '';
    uploadedFiles.forEach(file => {
        const div = document.createElement('div');
        div.className = 'file-card';
        div.innerHTML = `
            <div class="file-preview">📄</div>
            <p>${file.name}</p>
        `;
        fileList.appendChild(div);
    });
}

// Generate Logic
generateBtn.addEventListener('click', () => {
    if (uploadedFiles.length === 0) {
        alert("Please upload files first!");
        return;
    }
    
    generateBtn.innerText = "Processing...";
    
    // Simulate AI Processing
    setTimeout(() => {
        alert("Metadata Generated Successfully!");
        generateBtn.innerText = "Generate";
    }, 2000);
});

// API Modal Logic
document.getElementById('open-api-modal').onclick = () => {
    document.getElementById('api-modal').classList.remove('hidden');
};

document.getElementById('save-keys').onclick = () => {
    const key = document.getElementById('gemini-key').value;
    localStorage.setItem('gemini_key', key);
    document.getElementById('api-modal').classList.add('hidden');
    alert("API Key Saved!");
};