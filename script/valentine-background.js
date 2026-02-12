// Valentine's Day Background Animation
(function() {
    const canvas = document.getElementById('valentine-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation state
    let frameCount = 0;
    let isAnimating = true;
    
    // Particle system
    class Particle {
        constructor(x, y, type = 'sparkle') {
            this.x = x;
            this.y = y;
            this.type = type;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = Math.random() * 2 + 1;
            this.life = 0;
            this.maxLife = Math.random() * 3 + 2;
            this.size = Math.random() * 8 + 2;
            this.rotation = Math.random() * Math.PI * 2;
            this.opacity = Math.random() * 0.5 + 0.5;
        }
        
        update() {
            this.x += this.vx;
            this.y -= this.vy;
            this.life += 1 / (this.maxLife * 60);
            this.rotation += 0.1;
            this.vy *= 0.98;
        }
        
        draw(ctx) {
            const alpha = Math.cos(this.life * Math.PI) * this.opacity;
            if (alpha <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            if (this.type === 'petal') {
                this.drawPetal(ctx);
            } else if (this.type === 'sparkle') {
                this.drawSparkle(ctx);
            }
            
            ctx.restore();
        }
        
        drawPetal(ctx) {
            const hue = Math.random() * 20 + 340;
            const saturation = Math.random() * 30 + 70;
            const lightness = Math.random() * 30 + 60;
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 1.5, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        drawSparkle(ctx) {
            const hue = Math.random() * 60;
            const saturation = Math.random() * 100;
            const lightness = Math.random() * 40 + 60;
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            ctx.beginPath();
            
            // Create star-shaped sparkle
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI / 2) * i;
                const x = Math.cos(angle) * this.size;
                const y = Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        isDead() {
            return this.life > 1;
        }
    }
    
    class BokehHeart {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseSize = Math.random() * 80 + 40;
            this.size = this.baseSize;
            this.pulse = Math.random() * Math.PI * 2;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.color = {
                h: Math.random() * 20 + 340,
                s: Math.random() * 30 + 70,
                l: Math.random() * 30 + 50
            };
        }
        
        update() {
            this.pulse += 0.01;
            this.size = this.baseSize * (1 + Math.sin(this.pulse) * 0.2);
        }
        
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity + Math.sin(this.pulse) * 0.15;
            ctx.translate(this.x, this.y);
            
            // Create glow effect
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 0.8)`);
            gradient.addColorStop(0.5, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 0.3)`);
            gradient.addColorStop(1, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw heart shape
            this.drawHeart(ctx);
            
            ctx.restore();
        }
        
        drawHeart(ctx) {
            ctx.fillStyle = `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 0.6)`;
            const s = this.size * 0.3;
            const scale = s / 100;
            
            ctx.beginPath();
            ctx.moveTo(0, -20 * scale);
            ctx.bezierCurveTo(20 * scale, -45 * scale, 45 * scale, -45 * scale, 45 * scale, -20 * scale);
            ctx.bezierCurveTo(45 * scale, 0, 0, 50 * scale, -45 * scale, -20 * scale);
            ctx.bezierCurveTo(-45 * scale, -45 * scale, -20 * scale, -45 * scale, 0, -20 * scale);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    // Particle system
    let particles = [];
    let bokehHearts = [];
    
    // Initialize bokeh hearts
    function initializeBokehHearts() {
        bokehHearts = [];
        const gridSize = Math.max(canvas.width, canvas.height) / 4;
        for (let x = gridSize; x < canvas.width; x += gridSize) {
            for (let y = gridSize; y < canvas.height; y += gridSize) {
                if (Math.random() > 0.3) {
                    bokehHearts.push(new BokehHeart(
                        x + (Math.random() - 0.5) * gridSize,
                        y + (Math.random() - 0.5) * gridSize
                    ));
                }
            }
        }
    }
    
    // Draw gradient background
    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        gradient.addColorStop(0, '#ffe6f0');      // Soft pink
        gradient.addColorStop(0.3, '#ffb3d9');    // Medium pink
        gradient.addColorStop(0.5, '#ff99cc');    // Pastel pink
        gradient.addColorStop(0.7, '#ff6b9d');    // Brighter pink-red
        gradient.addColorStop(1, '#c94a6d');      // Deep rose
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Radial glow overlay
        const radialGradient = ctx.createRadialGradient(
            canvas.width * 0.5, canvas.height * 0.3,
            canvas.width * 0.2,
            canvas.width * 0.5, canvas.height * 0.3,
            canvas.width * 1.2
        );
        
        radialGradient.addColorStop(0, 'rgba(255, 192, 203, 0.3)');
        radialGradient.addColorStop(0.5, 'rgba(255, 182, 193, 0.1)');
        radialGradient.addColorStop(1, 'rgba(199, 74, 109, 0.05)');
        
        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Add particles randomly
    function emitParticles() {
        if (frameCount % 2 === 0) {
            // Sparkles
            for (let i = 0; i < 2; i++) {
                particles.push(new Particle(
                    Math.random() * canvas.width,
                    canvas.height,
                    'sparkle'
                ));
            }
        }
        
        if (frameCount % 3 === 0) {
            // Petals
            for (let i = 0; i < 1; i++) {
                particles.push(new Particle(
                    Math.random() * canvas.width,
                    -20,
                    'petal'
                ));
            }
        }
    }
    
    // Main animation loop
    function animate() {
        frameCount++;
        
        // Draw background
        drawBackground();
        
        // Update and draw bokeh hearts
        for (let heart of bokehHearts) {
            heart.update();
            heart.draw(ctx);
        }
        
        // Emit new particles
        emitParticles();
        
        // Update and draw particles
        particles = particles.filter(p => !p.isDead());
        for (let particle of particles) {
            particle.update();
            particle.draw(ctx);
        }
        
        // Add subtle depth effect
        ctx.fillStyle = 'rgba(255, 240, 245, 0.01)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Continue animation
        if (isAnimating) {
            requestAnimationFrame(animate);
        }
    }
    
    // Initialize and start animation
    initializeBokehHearts();
    animate();
})();
