function getBrowserLanguage() {
    const language = navigator.language || navigator.userLanguage;
    return language.split('-')[0];
}

const supportedLanguages = ['en', 'es', 'fr', 'de', 'it'];

function translatePage(targetLang) {
    if (targetLang === 'pt') return;

    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = targetLang;
        select.dispatchEvent(new Event('change'));
    }
}

const body = document.body;
const WHATSAPP_NUMBER = '5551996299252';

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    const isOpen = menu.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
}

function sendWhatsApp(event) {
    const form = document.getElementById('whatsappForm');
    if (!form.checkValidity()) {
        return true;
    }

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value;

    const templateMensagem =
        `Ol%C3%A1!%20Me%20chamo%20${encodeURIComponent(nome)}%2C%20gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(assunto)}.%0A` +
        `%5BE-mail%20para%20contato%5D%3A%20${encodeURIComponent(email)}%0A` +
        `%0A` +
        `${encodeURIComponent(mensagem)}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${templateMensagem}`;
    window.open(whatsappUrl, '_blank');

    window.location.href = `obrigado.html`;

    return false;
}

function sendWhatsAppPackage(packageName) {
    let message;
    if (packageName === 'BASIC') {
        message = `Olá, gostaria de contratar o *Pacote BASIC* e começar meu projeto de Landing Page e Tráfego Pago. Estou pronto(a) para iniciar o projeto.`;
    } else if (packageName === 'PREMIUM') {
        message = `Olá, quero contratar o *Pacote PREMIUM* para ter a solução completa (Landing Page, Tráfego, Mídia Social e Google Empresas). Estou pronto(a) para iniciar o projeto.`;
    } else if (packageName === 'CUSTOM') {
        message = `Olá, tenho um projeto diferente dos anunciados e gostaria de solicitar uma *Consultoria Custom*. Estou pronto(a) para iniciar o projeto.`;
    } else {
        message = 'Olá, entrei na página de Preços e gostaria de mais informações sobre os pacotes de serviço.';
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    window.location.href = `obrigado.html`;
}

function setupMouseGlow() {
    const glowElement = document.getElementById('mouse-glow');
    const targetElement = document.getElementById('hero-canvas');
    const heroSection = document.getElementById('hero');

    if (!glowElement || !targetElement || !heroSection) return;

    let isMouseOverTarget = false;

    targetElement.addEventListener('mouseenter', () => {
        isMouseOverTarget = true;
        glowElement.classList.add('active');
    });

    targetElement.addEventListener('mouseleave', () => {
        isMouseOverTarget = false;
    });

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        glowElement.style.left = `${x}px`;
        glowElement.style.top = `${y}px`;

        if (isMouseOverTarget && !glowElement.classList.contains('active')) {
            glowElement.classList.add('active');
        } else if (!isMouseOverTarget && glowElement.classList.contains('active')) {
            glowElement.classList.remove('active');
        }
    });

    heroSection.addEventListener('mouseleave', () => {
        glowElement.classList.remove('active');
    });
}

function setupCardGlowEffect() {
    const cardSelectors = '.service-card, .card-padrao, .card-destaque';
    const cards = document.querySelectorAll(cardSelectors);

    cards.forEach(card => {
        const glowOverlay = card.querySelector('.card-glow-overlay');
        
        card.style.transformStyle = 'preserve-3d'; 

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xCenter = rect.width / 2;
            const yCenter = rect.height / 2;
            
            if (glowOverlay) {
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                glowOverlay.style.setProperty('--mouse-x', `${xPercent}%`);
                glowOverlay.style.setProperty('--mouse-y', `${yPercent}%`);
            }

            const rotateX = ((y - yCenter) / yCenter) * -5;
            const rotateY = ((x - xCenter) / xCenter) * 5;

            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                z: 10,
                duration: 0.5,
                ease: "power2.out",
                overwrite: true
            });
        });

        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.02, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                z: 0,
                scale: 1,
                duration: 0.5,
                ease: "power3.out"
            });
        });
    });
}

function setupServiceCardsParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const cards = gsap.utils.toArray('[data-gsap-card="true"]');

    cards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            rotationX: -45, 
            transformOrigin: "center top",
            duration: 1.2,
            delay: 0.1 * index,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true
            }
        });
        
        const isOffset = index % 2 === 1;
        const yValue = isOffset ? 30 : -30;

        gsap.to(card, {
            y: yValue,
            ease: "none",
            scrollTrigger: {
                trigger: '#servicos-wrapper',
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        });
    });
}

function setupProcessTimelineAnimation() {
    if (typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') {
        return;
    }

    const timeline = document.getElementById('timeline-line');
    const progressLine = document.getElementById('timeline-progress');
    const steps = document.querySelectorAll('.process-step-item');
    const dots = document.querySelectorAll('.timeline-dot');

    if (!timeline || steps.length === 0) return;

    gsap.to(progressLine, {
        height: "100%",
        ease: "power1.inOut",
        scrollTrigger: {
            trigger: timeline,
            start: "top center",
            end: "bottom center",
            scrub: true,
        }
    });

    steps.forEach((step, index) => {
        const isEven = index % 2 === 0;
        const startX = isEven ? -100 : 100;

        const stepDot = dots[index];

        gsap.fromTo(step, {
            opacity: 0,
            y: 50,
            x: startX,
        }, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: step,
                start: "top 80%",
                toggleActions: "play none none none",
                once: true,
                onEnter: () => {
                    const stepNumber = step.querySelector('.process-step');
                    if (stepNumber) {
                        gsap.fromTo(stepNumber, {
                            opacity: 0,
                            scale: 0.8
                        }, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.5,
                            ease: "back.out(1.7)"
                        });
                    }

                    if (stepDot) {
                        gsap.fromTo(stepDot, {
                            opacity: 0,
                            scale: 0.5
                        }, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.6,
                            ease: "elastic.out(1, 0.5)"
                        });
                    }
                }
            }
        });

        if (stepDot) {
            gsap.to(stepDot, {
                scale: 1.5,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.8)",
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: step,
                    start: "center center",
                    toggleActions: "play reverse play reverse",
                }
            });
        }
    });
}

function setupSobreAnimation() {
    if (typeof gsap === 'undefined' || typeof TextPlugin === 'undefined') return;

    const section = document.getElementById('sobre');
    if (!section) return;

    const terminalContainer = section.querySelector('[data-gsap-target="terminal"]');
    const textContainer = section.querySelector('[data-gsap-target="text"]');
    const terminalCode = section.querySelector('[data-gsap-terminal="true"]');
    
    const terminalWindow = terminalCode.closest('.terminal-window'); 
    
    if (!terminalWindow) return;

    const rawCodeHTML = terminalCode.innerHTML.trim();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawCodeHTML;

    gsap.from(textContainer, {
        x: -50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
        }
    });
    
    gsap.from(terminalContainer, {
        x: 50,
        opacity: 0.3,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
        }
    });
    
    gsap.set(terminalCode, { autoAlpha: 0 }); 

    const tlTyping = gsap.timeline({
        paused: true,
        onStart: () => {
             terminalCode.innerHTML = '';
             gsap.set(terminalCode, { autoAlpha: 1 }); 
             gsap.to(terminalContainer, { opacity: 1, duration: 0.3 });
        },
        onReverseComplete: () => {
            terminalCode.innerHTML = '';
            gsap.set(terminalCode, { autoAlpha: 0 });
            gsap.to(terminalContainer, { opacity: 0.3, duration: 0.5 });
        }
    });
    
    const originalNodes = Array.from(tempDiv.childNodes).filter(node => node.textContent.trim().length > 0 || node.nodeType === 1);

    originalNodes.forEach(node => {
        const isElement = node.nodeType === 1;
        
        const lineContainer = document.createElement('div'); 
        lineContainer.classList.add('typing-line-container');
        
        let typingTarget; 
        let originalText;

        if (isElement) {
            const targetElement = node.cloneNode(true);
            originalText = targetElement.innerHTML;
            
            targetElement.innerHTML = `<i class="typing-target">${originalText}</i>`;
            typingTarget = targetElement.querySelector('.typing-target');
            typingTarget.innerHTML = ''; 

            lineContainer.appendChild(targetElement);
            
        } else {
            originalText = node.textContent;
            lineContainer.innerHTML = `<i class="typing-target">${originalText}</i>`;
            typingTarget = lineContainer.querySelector('.typing-target');
            typingTarget.innerHTML = ''; 
        }

        terminalCode.appendChild(lineContainer);
        
        tlTyping.from(lineContainer, {
            opacity: 0, 
            duration: 0.01 
        }, ">")
        .to(typingTarget, {
            text: {
                value: originalText,
                speed: 1 
            },
            duration: originalText.length * 0.04,
            ease: "none",
            onStart: () => {
                typingTarget.innerHTML = '';
            }
        });
    });

    terminalWindow.addEventListener('mouseenter', () => {
        if (!tlTyping.isActive() || tlTyping.reversed()) {
            tlTyping.play();
        }
    });

    terminalWindow.addEventListener('mouseleave', () => {
        if (tlTyping.progress() > 0) {
            tlTyping.reverse();
        }
    });
}


function setupResultsAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof window.innerWidth === 'undefined') return;

    const resultsGrid = document.getElementById('results-grid');
    const resultCards = gsap.utils.toArray('[data-gsap-result="true"]');

    if (!resultsGrid || resultCards.length === 0) return;

    function startCounter(targetElement) {
        const valueDisplay = targetElement.querySelector('.counter-value');
        const target = parseFloat(valueDisplay.getAttribute('data-target'));
        const isDecimal = valueDisplay.hasAttribute('data-decimal');
        const startValue = 0;

        gsap.fromTo({ count: startValue }, {
            count: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: function() {
                let displayValue = this.targets()[0].count;
                if (isDecimal) {
                    displayValue = displayValue.toFixed(1);
                } else {
                    displayValue = Math.round(displayValue);
                }
                valueDisplay.textContent = displayValue;
            },
            onComplete: function() {
                valueDisplay.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
            }
        });
    }

    gsap.set(resultCards, { opacity: 0, y: 100, rotation: 5 });

    gsap.to(resultCards, {
        opacity: 1,
        y: 0,
        rotation: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
            trigger: resultsGrid,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
            onEnter: () => {
                resultCards.forEach(startCounter);
            }
        }
    });

    gsap.to('#results-background-magic', {
        y: -100,
        ease: "none",
        scrollTrigger: {
            trigger: '#resultados',
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
        }
    });
}

function setupReviewsGridAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    const reviewsGrid = document.getElementById('reviews-carousel');
    const reviewCards = gsap.utils.toArray('.review-card-full');
    const backgroundEffect = document.getElementById('reviews-background-effect');

    if (!reviewsGrid || reviewCards.length === 0) return;

    gsap.from(reviewCards, {
        opacity: 0,
        y: 150,
        skewY: 5,
        rotation: 3,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
            trigger: reviewsGrid,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
        }
    });

    reviewCards.forEach((card, i) => {
        const moveDistance = (i % 2 === 0) ? 100 : -100;
        
        gsap.to(card, {
            y: moveDistance,
            ease: "none",
            scrollTrigger: {
                trigger: '#depoimentos',
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
            }
        });
    });

    if (backgroundEffect) {
        gsap.to(backgroundEffect, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
                trigger: reviewsGrid,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
            }
        });

        backgroundEffect.style.background = `radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, rgba(3, 7, 18, 0) 70%)`;
        backgroundEffect.style.pointerEvents = 'none';
    }
}

function setupPricingAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const pricingGrid = document.getElementById('pricing-grid');
    const priceCards = gsap.utils.toArray('[data-gsap-price="true"]');
    const destaqueCard = document.querySelector('.card-destaque');

    if (!pricingGrid || priceCards.length === 0) return;

    gsap.set(priceCards, {
        opacity: 0,
        y: 80,
        visibility: "hidden"
    });


    gsap.to(priceCards, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        visibility: "visible",
        scrollTrigger: {
            trigger: pricingGrid,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
        }
    });

    if (destaqueCard) {
        gsap.to(destaqueCard, {
            rotationY: 1,
            y: -10,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            duration: 5,
        });

        destaqueCard.addEventListener('mouseenter', () => {
        });
        destaqueCard.addEventListener('mouseleave', () => {
            gsap.to(destaqueCard, { rotationY: 1, y: -10, duration: 5, ease: "sine.inOut", repeat: -1, yoyo: true });
        });
    }
}

function setupContactAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const section = document.getElementById('contato');
    const mainBlock = section.querySelector('[data-gsap-contact="main"]');
    if (!section || !mainBlock) return;

    const headerBlock = section.querySelector('[data-gsap-contact="header"]');
    const detailsBlock = section.querySelector('[data-gsap-contact="details"]');
    const socialBlock = section.querySelector('[data-gsap-contact="social"]');
    const formFields = gsap.utils.toArray('#whatsappForm > div'); 

    const tlMain = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
        }
    });

    tlMain.from(mainBlock, {
        opacity: 0,
        y: 80, 
        scale: 0.95,
        rotationX: -10,
        transformOrigin: "center center",
        duration: 1.2,
        ease: "power3.out"
    }, 0); 

    gsap.from([headerBlock, detailsBlock], {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    }, 0.5); 

    gsap.set(formFields, { opacity: 0, y: 30, rotationX: -90, transformOrigin: "top center" });

    gsap.to(formFields, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
            trigger: mainBlock,
            start: "top 80%", 
            toggleActions: "play none none none",
            once: true,
        }
    });
    
    gsap.from(socialBlock.querySelectorAll('a'), {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: socialBlock,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
        }
    });
}

function setupPricingMouseGlow() {
    const glowElement = document.getElementById('mouse-glow-precos');
    const targetElement = document.getElementById('pricing-container-interactive');

    if (!glowElement || !targetElement) return;

    glowElement.classList.remove('active');
    glowElement.classList.add('opacity-0');

    targetElement.addEventListener('mouseenter', () => {
        glowElement.classList.add('active', 'opacity-100');
    });

    targetElement.addEventListener('mouseleave', () => {
        glowElement.classList.remove('active', 'opacity-100');
        glowElement.classList.add('opacity-0');
    });

    targetElement.addEventListener('mousemove', (e) => {
        const rect = targetElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        glowElement.style.left = `${x}px`;
        glowElement.style.top = `${y}px`;
    });
}

function setupContactMouseGlow() {
    const glowElement = document.getElementById('mouse-glow-contato');
    const targetElement = document.getElementById('contact-form-interactive');

    if (!glowElement || !targetElement) return;

    glowElement.classList.remove('active');
    glowElement.classList.add('opacity-0');

    targetElement.addEventListener('mouseenter', () => {
        glowElement.classList.add('active', 'opacity-100');
    });

    targetElement.addEventListener('mouseleave', () => {
        glowElement.classList.remove('active', 'opacity-100');
        glowElement.classList.add('opacity-0');
    });

    targetElement.addEventListener('mousemove', (e) => {
        const rect = targetElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        glowElement.style.left = `${x}px`;
        glowElement.style.top = `${y}px`;
    });
}

function setupTextReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const titles = gsap.utils.toArray(
        '#servicos-wrapper h2, #processo h2, #resultados h2, #depoimentos h2, #precos h2, #sobre h2, #contato h2'
    );

    titles.forEach(title => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        title.parentNode.insertBefore(wrapper, title);
        wrapper.appendChild(title);
        
        gsap.set(title, { y: '100%', opacity: 0 }); 

        gsap.to(title, {
            y: '0%', 
            opacity: 1,
            duration: 1, 
            ease: "power4.out",
            scrollTrigger: {
                trigger: wrapper,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true,
            }
        });
    });
}


const COLOR_PRIMARY = 0x60a5fa;
const COLOR_SECONDARY = 0xa855f7;

let mouseX = 0;
let mouseY = 0;
let textMesh;
let subtitleMesh;
let backgroundCamera;
let bgRenderer;
let bgPoints;
let floatingObjects = [];
let techCylinders = [];
let reactiveParticles = [];
let networkPoints = [];
let networkLines;
let dataPanels = [];
let energySpheres = [];
let dataStreamParticles = [];
let tickerAnimation; 

const DENSITY = 15;
const DATA_STREAM_COUNT = 30;
const ENERGY_SPHERE_COUNT = 3;


function initMouseTracking() {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    function onDocumentMouseMove(event) {
        mouseX = ((event.clientX - windowHalfX) * 0.005);
        mouseY = ((event.clientY - windowHalfY) * 0.005);
    }
}

function setupBackgroundScene() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    backgroundCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const bgRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

    bgRenderer.setSize(width, height);
    bgRenderer.setPixelRatio(window.devicePixelRatio);
    bgRenderer.setClearColor(0x000000, 0);

    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 600;
        const y = (Math.random() - 0.5) * 600;
        const z = (Math.random() - 0.5) * 600;

        positions.push(x, y, z);

        const hue = Math.random() * 0.3 + 0.6;
        color.setHSL(hue, 0.5, 0.8);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });

    bgPoints = new THREE.Points(geometry, material);
    scene.add(bgPoints);
    
    floatingObjects = [];
    techCylinders = [];
    reactiveParticles = [];
    networkPoints = [];
    dataPanels = [];
    energySpheres = [];
    dataStreamParticles = [];

    backgroundCamera.position.z = 200;

    const ambientLight = new THREE.AmbientLight(0x1a1a1a, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);


    function animateBackground() {
        requestAnimationFrame(animateBackground);
        const time = Date.now() * 0.001;

        backgroundCamera.rotation.x += (mouseY * 0.05 - backgroundCamera.rotation.x) * 0.05;
        backgroundCamera.rotation.y += (mouseX * 0.05 - backgroundCamera.rotation.y) * 0.05;

        if (bgPoints) {
            bgPoints.rotation.y += 0.0005;
            bgPoints.rotation.x += 0.0002;
        }
        
        bgRenderer.render(scene, backgroundCamera);
    }
    animateBackground();

    window.addEventListener('resize', () => {
        const newWidth = canvas.clientWidth;
        const newHeight = canvas.clientHeight;

        backgroundCamera.aspect = newWidth / newHeight;
        backgroundCamera.updateProjectionMatrix();

        bgRenderer.setSize(newWidth, newHeight);
    }, false);
}

function setupSimpleParticlesScene(canvasId) {
    return;
}

function updateTextSizeAndCamera(container, camera, h1Mesh, pMesh) {
    const isMobile = container.clientWidth < 640;

    camera.position.z = 12;

    if (isMobile) {
        h1Mesh.scale.set(0.35, 0.35, 1);
        pMesh.scale.set(0.35, 0.35, 1);

        h1Mesh.position.y = 0.5;
        pMesh.position.y = -0.25;
    } else {
        h1Mesh.scale.set(1, 1, 1);
        pMesh.scale.set(1, 1, 1);

        h1Mesh.position.y = 0;
        pMesh.position.y = -2;
    }
}

function setupThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const parentContainer = canvas.parentElement;
    const width = parentContainer.clientWidth;
    const height = parentContainer.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    const textRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

    textRenderer.setSize(width, height);
    textRenderer.setPixelRatio(window.devicePixelRatio);
    textRenderer.setClearColor(0x000000, 0);

    const heroH1Text = "VENNITY";
    const heroPText = "DESENVOLVA SEU LEGADO.";

    const fontLoader = new THREE.FontLoader();
    const fontUrl = '/assets/fonts/inter-tight.json';

    fontLoader.load(fontUrl, function (font) {
        const textGeometry = new THREE.TextGeometry(heroH1Text, {
            font: font,
            size: 2,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.001,
            bevelSize: 0.3,
            bevelOffset: 0,
        });

        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshStandardMaterial({
            color: COLOR_PRIMARY,
            metalness: 1,
            roughness: 1,
            transparent: true,
            opacity: 1
        });

        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);

        const subtitleGeometry = new THREE.TextGeometry(heroPText, {
            font: font,
            size: 0.5,
            height: 0.01,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.001,
            bevelSize: 0.03,
            bevelOffset: 0,
        });

        subtitleGeometry.computeBoundingBox();
        subtitleGeometry.center();

        const subtitleMaterial = new THREE.MeshStandardMaterial({
            color: COLOR_SECONDARY,
            metalness: 1,
            roughness: 1,
        });

        subtitleMesh = new THREE.Mesh(subtitleGeometry, subtitleMaterial);

        subtitleMesh.position.y = -2;
        subtitleMesh.position.z = 0.5;

        scene.add(subtitleMesh);


        camera.position.z = 12;

        updateTextSizeAndCamera(parentContainer, camera, textMesh, subtitleMesh);

        const ambientLight = new THREE.AmbientLight(COLOR_SECONDARY, 0.3);
        scene.add(ambientLight);
        const blueLight = new THREE.PointLight(COLOR_PRIMARY, 8, 50);
        blueLight.position.set(-5, 5, 5);
        scene.add(blueLight);
        const purpleLight = new THREE.PointLight(COLOR_SECONDARY, 8, 50);
        purpleLight.position.set(5, -5, 5);
        scene.add(purpleLight);
        const pinkLight = new THREE.PointLight(COLOR_PRIMARY, 8, 50);
        pinkLight.position.set(0, 5, -5);
        scene.add(pinkLight);


        function animate() {
            requestAnimationFrame(animate);

            textMesh.rotation.x += (mouseY * 0.1 - textMesh.rotation.x) * 0.05;
            textMesh.rotation.y += (mouseX * 0.1 - textMesh.rotation.y) * 0.05;

            subtitleMesh.rotation.x += (mouseY * 0.1 - subtitleMesh.rotation.x) * 0.05;
            subtitleMesh.rotation.y += (mouseX * 0.1 - subtitleMesh.rotation.y) * 0.05;

            blueLight.position.x = 5 * Math.sin(Date.now() * 0.0005);
            purpleLight.position.y = 5 * Math.cos(Date.now() * 0.0005);
            pinkLight.position.z = 5 * Math.sin(Date.now() * 0.0007);


            textRenderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            const newWidth = parentContainer.clientWidth;
            const newHeight = parentContainer.clientHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();

            textRenderer.setSize(newWidth, newHeight);

            updateTextSizeAndCamera(parentContainer, camera, textMesh, subtitleMesh);
        }
        
        gsap.to(textMesh.position, {
            y: "+=0.1", 
            duration: 1.5,
            ease: "elastic.out(1, 0.5)", 
            delay: 0.5 
        });


    },
        function (xhr) {
        },
        function (error) {
            document.getElementById('hero-h1').style.display = 'block'; 
            canvas.style.display = 'none';
        });

}

function setupHeroEntranceAnimation() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const h1Fallback = document.getElementById('hero-h1'); 
    const subtitle = document.querySelector('.max-w-1xl.mx-auto');
    const buttons = document.querySelector('.mt-12.flex');
    const logoTicker = document.getElementById('impacto');
    const mainHeader = document.getElementById('main-header');
    
    if (h1Fallback) {
        tl.fromTo(h1Fallback, {
            y: 50,
            opacity: 0,
            scale: 0.95
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)",
            delay: 0.5 
        }, 0);
    }
    
    tl.fromTo(mainHeader, {
        opacity: 0,
        y: -100
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, 0.2); 

    tl.fromTo(subtitle, {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
    }, 0.8); 

    tl.fromTo(buttons, {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
    }, 1.0); 

    tl.fromTo(logoTicker, {
        opacity: 0,
        y: 50,
        scale: 0.95
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
    }, 1.2); 
}

function setupTickerAnimation() {
    const tickerContainer = document.querySelector('.ticker-container');
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContainer || !tickerContent) return;

    tickerContainer.style.animation = 'none';

    const contentWidth = tickerContent.clientWidth;
    const distance = -contentWidth;
    const duration = 15;

    if (tickerContainer.children.length === 1) {
        const clone = tickerContent.cloneNode(true);
        tickerContainer.appendChild(clone);
    }

    tickerAnimation = gsap.to(tickerContainer, {
        x: distance,
        duration: duration,
        ease: "linear",
        repeat: -1,
        paused: false,
        onRepeat: function() {
            this.set(tickerContainer, {x: 0});
        }
    });

    tickerContainer.addEventListener('mouseenter', () => tickerAnimation.pause());
    tickerContainer.addEventListener('mouseleave', () => tickerAnimation.play());
}


function setupVideoStickyReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const videoSection = document.getElementById('video-mockup');
    const videoMockup = videoSection.querySelector('.relative.w-full.max-w-6xl.mx-auto');

    if (!videoSection || !videoMockup) return;

    ScrollTrigger.create({
        trigger: videoSection,
        start: "top top",
        end: "bottom bottom",
        pin: videoMockup,
        pinSpacing: true,
        scrub: 1,
    });

    gsap.to(videoMockup, {
        rotationX: 1, 
        rotationY: -1,
        ease: "none",
        scrollTrigger: {
            trigger: videoSection,
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
    });
}

function setupDockEffect() {
    const dockLinks = document.querySelectorAll('.dock-link-text');

    function removeHoverClasses() {
        dockLinks.forEach(link => {
            link.classList.remove('prev-hover', 'prev-prev-hover');
        });
    }

    dockLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            removeHoverClasses();

            if (index > 0) {
                dockLinks[index - 1].classList.add('prev-hover');
            }
            if (index > 1) {
                dockLinks[index - 2].classList.add('prev-prev-hover');
            }
        });
    });

    const navULs = document.querySelectorAll('header nav ul.flex');
    navULs.forEach(navUL => {
        navUL.addEventListener('mouseleave', removeHoverClasses);
    });
}

function setupFooterAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#main-footer",
            start: "top 85%", 
            toggleActions: "play none none none",
            once: true,
        }
    });

    tl.from(".footer-title-line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
    })

    .from(".footer-cta-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
    }, "<0.2") 

    .from(".footer-cta-button", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
    }, "<0.2")

    .from(".footer-link-group-left", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
    }, "<0.5")

    .from(".footer-link-group-right", {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
    }, "<0") 

    .from(".footer-link-item", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power1.out",
    }, "<0.2") 

    .from(".footer-copyright", {
        opacity: 0,
        duration: 1,
        ease: "power1.out",
    }, ">-0.5"); 
}


document.addEventListener('DOMContentLoaded', () => {
    
    initMouseTracking();
    setupBackgroundScene(); 
    setupThreeJS();
    setupMouseGlow();
    setupDockEffect();
    
    setupHeroEntranceAnimation();
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof TextPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, TextPlugin); 
    }

    let ctx = gsap.context(() => {
        setupTickerAnimation();
        
        setupVideoStickyReveal();
        setupTextReveal(); 
        setupServiceCardsParallax();
        setupProcessTimelineAnimation();
        setupSobreAnimation();
        setupResultsAnimation(); 
        setupReviewsGridAnimation();
        setupPricingAnimation();
        setupContactAnimation(); 
        
        setupFooterAnimations();
    });

    setupCardGlowEffect();
    setupPricingMouseGlow();
    setupContactMouseGlow();
    

    const mainHeader = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('header-scrolled');
            if (logoContainer && window.innerWidth >= 768) {
                logoContainer.classList.add('header-scrolled');
            }
        } else {
            mainHeader.classList.remove('header-scrolled');
            if (logoContainer && window.innerWidth >= 768) {
                logoContainer.classList.remove('header-scrolled');
            }
        }
    });

    const scrollAnimatedElements = document.querySelectorAll('.fade-in-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                entry.target.classList.remove('fade-in-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    scrollAnimatedElements.forEach(element => {
        if (element.id !== 'hero' && !element.hasAttribute('data-gsap-card')) {
            if (!element.classList.contains('process-step-item')) {
                observer.observe(element);
            }
        }
    });
});