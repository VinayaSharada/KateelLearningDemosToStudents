/* Demo Rating System - KateelLearningDemos */
/* Usage: Add class="demo-rating" with data-demo-id to any element */

(function() {
    // Initialize ratings on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        const ratingWidgets = document.querySelectorAll('.demo-rating');
        
        ratingWidgets.forEach(function(widget) {
            const demoId = widget.getAttribute('data-demo-id');
            const stars = widget.querySelectorAll('.rating-stars span');
            const averageEl = widget.querySelector('.average');
            const countEl = widget.querySelector('.count');
            
            // Load rating from localStorage
            const ratingKey = 'demo_rating_' + demoId;
            const ratings = JSON.parse(localStorage.getItem(ratingKey) || '[]');
            
            // Calculate average
            const avg = ratings.length > 0 
                ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                : '0.0';
            
            // Update display
            averageEl.textContent = avg;
            countEl.textContent = `(${ratings.length} ${ratings.length === 1 ? 'rating' : 'ratings'})`;
            
            // Set star colors based on average
            const avgNum = parseFloat(avg);
            stars.forEach((star, i) => {
                star.style.color = i < Math.round(avgNum) ? '#fbbf24' : '#4b5563';
            });
            
            // Add click handlers
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const value = parseInt(this.getAttribute('data-value'));
                    
                    // Check if already rated
                    if (!ratings.includes(value)) {
                        ratings.push(value);
                        localStorage.setItem(ratingKey, JSON.stringify(ratings));
                        
                        // Update display
                        const newAvg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
                        averageEl.textContent = newAvg;
                        countEl.textContent = `(${ratings.length} ${ratings.length === 1 ? 'rating' : 'ratings'})`;
                        
                        // Animate stars
                        stars.forEach((s, i) => {
                            s.style.color = i < Math.round(parseFloat(newAvg)) ? '#fbbf24' : '#4b5563';
                            s.style.transform = 'scale(1.2)';
                            setTimeout(() => s.style.transform = 'scale(1)', 200);
                        });
                        
                        // Show thank you
                        widget.innerHTML += '<div class="thank-you" style="color: #4ade80; font-size: 0.875rem; margin-top: 0.5rem;">Thank you for rating! ⭐</div>';
                        setTimeout(() => {
                            const el = widget.querySelector('.thank-you');
                            if (el) el.remove();
                        }, 2000);
                    }
                });
                
                // Hover effects
                star.addEventListener('mouseenter', function() {
                    const value = parseInt(this.getAttribute('data-value'));
                    stars.forEach((s, i) => {
                        s.style.color = i < value ? '#fbbf24' : '#4b5563';
                    });
                });
                
                star.addEventListener('mouseleave', function() {
                    const avgNum = parseFloat(avg);
                    stars.forEach((s, i) => {
                        s.style.color = i < Math.round(avgNum) ? '#fbbf24' : '#4b5563';
                    });
                });
            });
        });
    });
})();