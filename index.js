document.addEventListener('mousemove', (e) => {
    const circle = document.getElementById('circle');
    circle.style.left = `${e.pageX - 20}px`;
    circle.style.top = `${e.pageY - 20}px`;
});

function toggleNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Particle.js Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 50,
            density: { enable: true, value_area: 800 }
        },
        color: { value: "#ffffff" },
        shape: {
            type: "circle",
            stroke: { width: 0, color: "#000" }
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1 }
        },
        size: {
            value: 5,
            random: true,
            anim: { enable: true, speed: 40, size_min: 0.1 }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out"
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" }
        }
    },
    retina_detect: true
});
