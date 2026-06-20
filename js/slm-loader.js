/* Browser SLM Loading Indicator - KateelLearningDemos */
/* Usage: Include this script in demos that use browser-based SLMs */

(function() {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'slm-loading-overlay';
    overlay.innerHTML = `
        <div class="slm-loading-content">
            <div class="slm-loading-spinner"></div>
            <h3 style="color: #fff; margin-bottom: 1rem;">Loading AI Model</h3>
            <p style="color: #94a3b8; margin-bottom: 1rem;">Please wait while the model downloads and initializes. This may take 1-3 minutes depending on your connection.</p>
            <div class="slm-model-info">
                <div class="label">Model Size</div>
                <div class="value" id="modelSize">~400MB</div>
            </div>
            <div class="slm-progress">
                <div class="slm-progress-bar" id="progressBar"></div>
            </div>
            <div class="slm-warning">⚠️ Large model download - please be patient</div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Progress tracking
    let progress = 0;
    const progressBar = document.getElementById('progressBar');
    
    function updateProgress(percent) {
        progress = percent;
        progressBar.style.width = percent + '%';
    }
    
    // Simulate initial progress
    let initProgress = 0;
    const initInterval = setInterval(() => {
        initProgress += Math.random() * 5;
        if (initProgress > 30) {
            clearInterval(initInterval);
        }
        updateProgress(initProgress);
    }, 500);
    
    // Function to hide the loader
    window.hideSLMLoader = function() {
        clearInterval(initInterval);
        overlay.classList.add('hidden');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };
    
    // Function to update progress from external scripts
    window.updateSLMProgress = function(percent, modelSize) {
        updateProgress(percent);
        if (modelSize) {
            document.getElementById('modelSize').textContent = modelSize;
        }
    };
    
    // Auto-hide after 5 minutes (fallback)
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            console.warn('SLM loader timeout - hiding');
            window.hideSLMLoader();
        }
    }, 300000);
})();