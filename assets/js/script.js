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
const toggleButton = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const LIGHT_MODE_CLASS = 'light-mode';
const WHATSAPP_NUMBER = '5551996299252';

function applyTheme(isLight) {
    if (isLight) {
        body.classList.add(LIGHT_MODE_CLASS);
        localStorage.setItem('theme', 'light');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        body.classList.remove(LIGHT_MODE_CLASS);
        localStorage.setItem('theme', 'dark');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    applyTheme(true);
} else {
    applyTheme(false);
}

toggleButton.addEventListener('click', () => {
    const isLight = body.classList.contains(LIGHT_MODE_CLASS);
    applyTheme(!isLight);
});

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

// ATUALIZADO: Seleciona tanto os cards de serviço quanto os cards de preço para o mouse follow.
function setupCardGlowEffect() {
    // Seletor unificado para cards de serviço e cards de preço
    const cardSelectors = '.service-card, .card-padrao, .card-destaque';
    const cards = document.querySelectorAll(cardSelectors);

    cards.forEach(card => {
        const glowOverlay = card.querySelector('.card-glow-overlay');
        
        // Define transform-style para cards de preço que não o possuem
        card.style.transformStyle = 'preserve-3d'; 

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xCenter = rect.width / 2;
            const yCenter = rect.height / 2;
            
            // Mouse Follow para a luz (só se existir)
            if (glowOverlay) {
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                glowOverlay.style.setProperty('--mouse-x', `${xPercent}%`);
                glowOverlay.style.setProperty('--mouse-y', `${yPercent}%`);
            }

            // Parallax 3D sutil do card
            const rotateX = ((y - yCenter) / yCenter) * -5; // Rotação de -5deg a 5deg
            const rotateY = ((x - xCenter) / xCenter) * 5; // Rotação de -5deg a 5deg

            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                z: 10, // Move 10px para frente (efeito 3D)
                duration: 0.5,
                ease: "power2.out",
                overwrite: true
            });
        });

        card.addEventListener('mouseenter', () => {
            // Animação de escala já existe, mantida
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
        // Animação de entrada dos cards
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
        
        // Efeito Parallax sutil: move os cards um pouco para cima e para baixo durante o scroll
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
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const section = document.getElementById('sobre');
    if (!section) return;

    const terminalContainer = section.querySelector('[data-gsap-target="terminal"]');
    const textContainer = section.querySelector('[data-gsap-target="text"]');
    const terminalCode = section.querySelector('[data-gsap-terminal="true"]');

    // Usando uma cor mais próxima do fundo para o efeito de "limpeza"
    const TERMINAL_BACKGROUND_COLOR = '#030712'; // Cor do body/section

    gsap.from(terminalContainer, {
        x: 50,
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

    terminalCode.style.visibility = 'visible';
    const cover = document.createElement('div');
    cover.style.cssText = `position: absolute; inset: 0; background-color: ${TERMINAL_BACKGROUND_COLOR}; border-radius: 10px;`;
    
    const terminalWindow = terminalCode.closest('.terminal-window');
    const coverClone = cover.cloneNode(true);
    terminalWindow.appendChild(coverClone);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: terminalContainer,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
            delay: 0.5
        }
    });

    // Animação de varredura do código
    tl.to(coverClone, {
        scaleX: 0, // Encolhe horizontalmente (esquerda para direita)
        transformOrigin: "right center",
        duration: 2.5,
        ease: "power2.inOut",
        delay: 0.5
    })
    .to(coverClone, {
        opacity: 0,
        duration: 0.1,
        onComplete: function () {
            coverClone.remove();
        }
    }, ">");
}

// CORRIGIDO: Garante que os cards apareçam corretamente.
function setupResultsAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof window.innerWidth === 'undefined') return;

    const resultsGrid = document.getElementById('results-grid');
    const resultCards = gsap.utils.toArray('[data-gsap-result="true"]');

    if (!resultsGrid || resultCards.length === 0) return;

    // Função para animar o contador
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

    // Garante que os cards estejam na posição inicial correta antes da animação
    gsap.set(resultCards, { opacity: 0, y: 100, rotation: 5 });

    // Animação de entrada dos cards
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

    // Parallax de Fundo
    gsap.to('#results-background-magic', {
        y: -100, // Move o fundo 100px para cima ao longo do scroll
        ease: "none",
        scrollTrigger: {
            trigger: '#resultados',
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
        }
    });
}


// CORRIGIDO: Removida a altura fixa 'min-h-[450px]' via JS
function setupReviewsGridAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    const reviewsGrid = document.getElementById('reviews-carousel');
    const reviewCards = gsap.utils.toArray('.review-card-full');
    const backgroundEffect = document.getElementById('reviews-background-effect');

    if (!reviewsGrid || reviewCards.length === 0) return;

    // Remove a limitação de altura da div que contém o carrossel, 
    // permitindo que o movimento parallax dos cards não seja cortado.
    // O min-h-[450px] está no HTML, o CSS do reviews-container deve ser ajustado.
    
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
        // Aumentando a distância de movimento para garantir que o corte seja evitado 
        // e o efeito seja mais visível/dramático.
        const moveDistance = (i % 2 === 0) ? 100 : -100; // Movimento maior
        
        // Aplicando o scrub (parallax)
        gsap.to(card, {
            y: moveDistance,
            ease: "none",
            scrollTrigger: {
                trigger: '#depoimentos', // Usando a seção pai para o trigger de início/fim
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5, // Scrub mais lento
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
    if (!section) return;

    const textBlock = section.querySelector('[data-gsap-contact="text"]');
    const formBlock = section.querySelector('#contact-form-interactive');
    const formFields = gsap.utils.toArray('[data-gsap-field]');

    const tlMain = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
        }
    });

    tlMain.from(textBlock, {
        opacity: 0,
        x: -80,
        duration: 1,
        ease: "power3.out"
    }, 0)
        .from(formBlock, {
            opacity: 0,
            x: 80,
            duration: 1,
            ease: "power3.out"
        }, 0);


    gsap.set(formFields, { opacity: 0, y: 20 });

    gsap.to(formFields, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
            trigger: formBlock,
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

// NOVO: Função para o Text Reveal nos títulos de seção
function setupTextReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Seleciona todos os títulos das seções (excluindo o Hero)
    const titles = gsap.utils.toArray(
        '#servicos-wrapper h2, #processo h2, #resultados h2, #depoimentos h2, #precos h2, #sobre h2, #contato h2'
    );

    titles.forEach(title => {
        // Envolve o texto em um span para aplicar a animação (simulando um split text)
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden'; // Cria a máscara
        title.parentNode.insertBefore(wrapper, title);
        wrapper.appendChild(title);
        
        // Estado inicial
        gsap.set(title, { y: '100%', opacity: 0 }); 

        gsap.to(title, {
            y: '0%', 
            opacity: 1,
            duration: 1, 
            ease: "power4.out",
            scrollTrigger: {
                trigger: wrapper,
                start: "top 90%", // Revela quando o topo da div está 90% na tela
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
    const shapeCount = 10;
    const shapes = [
        new THREE.TorusGeometry(3, 1.5, 3, 100),
        new THREE.DodecahedronGeometry(5, 0),
        new THREE.IcosahedronGeometry(4, 0),
    ];

    const shapeMaterial = new THREE.MeshPhongMaterial({
        color: COLOR_SECONDARY,
        emissive: COLOR_PRIMARY,
        emissiveIntensity: 0.1,
        shininess: 100,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    for (let i = 0; i < shapeCount; i++) {
        const shapeGeometry = shapes[Math.floor(Math.random() * shapes.length)];
        const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial);

        mesh.position.set(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300 - 100
        );

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        scene.add(mesh);
        floatingObjects.push(mesh);
    }

    techCylinders = [];
    const cylinderCount = 8;
    const cylinderMaterial = new THREE.MeshBasicMaterial({
        color: COLOR_PRIMARY,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });

    for (let i = 0; i < cylinderCount; i++) {
        const radius = Math.random() * 8 + 3;
        const height = Math.random() * 20 + 10;
        const radialSegments = Math.floor(Math.random() * 8) + 4;
        const heightSegments = Math.floor(Math.random() * 5) + 2;

        const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments);
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

        cylinderMesh.position.set(
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400 - 200
        );

        cylinderMesh.rotation.x = Math.random() * Math.PI;
        cylinderMesh.rotation.y = Math.random() * Math.PI;
        cylinderMesh.rotation.z = Math.random() * Math.PI;

        scene.add(cylinderMesh);
        techCylinders.push(cylinderMesh);
    }

    reactiveParticles = [];
    const reactiveParticleCount = 300;
    const reactiveParticleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const reactiveParticleMaterial = new THREE.MeshBasicMaterial({
        color: COLOR_PRIMARY,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < reactiveParticleCount; i++) {
        const particle = new THREE.Mesh(reactiveParticleGeometry, reactiveParticleMaterial.clone());
        particle.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200 - 50
        );
        particle.initialOpacity = particle.material.opacity;
        scene.add(particle);
        reactiveParticles.push(particle);
    }

    networkPoints = [];
    const networkGeometry = new THREE.BufferGeometry();
    const networkLineMaterial = new THREE.LineBasicMaterial({
        color: COLOR_PRIMARY,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
    });
    const maxDistance = 30;

    for (let i = 0; i < DENSITY; i++) {
        const point = new THREE.Vector3(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200 - 100
        );
        networkPoints.push(point);
    }
    const maxLines = DENSITY * DENSITY;
    const positionsLines = new Float32Array(maxLines * 3 * 2);
    networkGeometry.setAttribute('position', new THREE.BufferAttribute(positionsLines, 3).setUsage(THREE.DynamicDrawUsage));
    networkLines = new THREE.LineSegments(networkGeometry, networkLineMaterial);
    scene.add(networkLines);

    dataPanels = [];
    const panelCount = 5;
    const panelMaterial = new THREE.MeshBasicMaterial({
        color: COLOR_PRIMARY,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });

    for (let i = 0; i < panelCount; i++) {
        const panelGeometry = new THREE.PlaneGeometry(20, 10, 10, 5);
        const panelMesh = new THREE.Mesh(panelGeometry, panelMaterial.clone());
        panelMesh.position.set(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300 - 50
        );
        panelMesh.rotation.x = Math.random() * Math.PI;
        panelMesh.rotation.y = Math.random() * Math.PI;
        dataPanels.push(panelMesh);
        scene.add(panelMesh);
    }

    energySpheres = [];
    const pulseLight = new THREE.PointLight(COLOR_SECONDARY, 5, 100);
    pulseLight.position.set(0, 0, -150);
    scene.add(pulseLight);

    for (let i = 0; i < ENERGY_SPHERE_COUNT; i++) {
        const sphereGeometry = new THREE.IcosahedronGeometry(8, 1);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            emissive: COLOR_SECONDARY,
            emissiveIntensity: 0.2,
            shininess: 10
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200 - 150
        );
        energySpheres.push(sphere);
        scene.add(sphere);
    }

    dataStreamParticles = [];
    const streamGeometry = new THREE.BoxGeometry(1, 1, 1);
    const streamMaterial = new THREE.MeshBasicMaterial({ color: COLOR_PRIMARY });

    for (let i = 0; i < DATA_STREAM_COUNT; i++) {
        const particle = new THREE.Mesh(streamGeometry, streamMaterial.clone());
        particle.position.set(100, 0, -100);
        particle.speed = 1.0 + Math.random() * 0.5;
        particle.t = Math.random() * 100;
        dataStreamParticles.push(particle);
        scene.add(particle);
    }

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

        bgPoints.rotation.y += 0.0005;
        bgPoints.rotation.x += 0.0002;

        floatingObjects.forEach((mesh, index) => {
            mesh.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
            mesh.rotation.y += 0.0015 * (index % 3 === 0 ? 1 : -1);
            mesh.position.y += Math.sin(Date.now() * 0.0003 + index) * 0.03;
            mesh.position.x += Math.cos(Date.now() * 0.0002 + index) * 0.03;
        });

        techCylinders.forEach((mesh, index) => {
            mesh.rotation.x += 0.0007 * (index % 2 === 0 ? 1 : -1);
            mesh.rotation.y += 0.0009 * (index % 3 === 0 ? 1 : -1);
            mesh.position.z += Math.sin(Date.now() * 0.0004 + index) * 0.02;
        });

        reactiveParticles.forEach(particle => {
            const distance = particle.position.distanceTo(backgroundCamera.position);
            const maxDistance = 150;
            const effectFactor = Math.max(0, 1 - (distance / maxDistance));

            particle.material.opacity = particle.initialOpacity + (effectFactor * 0.2);
            particle.position.x += (mouseX * effectFactor * 0.01);
            particle.position.y += (mouseY * effectFactor * 0.01);
        });

        let vertexptr = 0;
        let p = networkPoints.length;
        const positions = networkLines.geometry.attributes.position.array;

        for (let i = 0; i < p; i++) {
            networkPoints[i].y += Math.sin(time * 0.5 + i) * 0.05;
            networkPoints[i].x += Math.cos(time * 0.3 + i) * 0.05;

            for (let j = i + 1; j < p; j++) {
                const distance = networkPoints[i].distanceTo(networkPoints[j]);
                const maxDistance = 30;
                if (distance < maxDistance) {
                    positions[vertexptr++] = networkPoints[i].x;
                    positions[vertexptr++] = networkPoints[i].y;
                    positions[vertexptr++] = networkPoints[i].z;

                    positions[vertexptr++] = networkPoints[j].x;
                    positions[vertexptr++] = networkPoints[j].y;
                    positions[vertexptr++] = networkPoints[j].z;
                }
            }
        }
        networkLines.geometry.attributes.position.needsUpdate = true;
        networkLines.geometry.setDrawRange(0, vertexptr / 3);

        dataPanels.forEach((mesh, index) => {
            mesh.rotation.x += 0.0005 * (index % 2 === 0 ? 1 : -1);
            mesh.rotation.y += 0.001;

            mesh.material.opacity = 0.05 + (Math.sin(time * 2 + index) * 0.03);
        });

        energySpheres.forEach((sphere, index) => {
            const pulse = 0.5 + Math.sin(time * 1.5 + index) * 0.5;
            sphere.material.emissiveIntensity = 0.2 + pulse * 0.5;
            sphere.scale.set(1 + pulse * 0.05, 1 + pulse * 0.05, 1 + pulse * 0.05);
        });
        pulseLight.intensity = 5 + Math.sin(time * 1.5) * 3;

        dataStreamParticles.forEach((particle, index) => {
            particle.t += 0.01 * particle.speed;
            const t = particle.t;

            particle.position.x = 80 * Math.sin(t * 0.5);
            particle.position.y = 50 * Math.cos(t * 0.3 + index * 0.2);
            particle.position.z = (t * -10) % 600 - 300;

            particle.material.opacity = 0.6 + Math.sin(t * 2) * 0.4;
        });


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
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const parentContainer = canvas.parentElement;
    const width = parentContainer.clientWidth;
    const height = parentContainer.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const tempPositions = [];

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 400;
        const z = (Math.random() - 0.5) * 400;

        positions.push(x, y, z);
        tempPositions.push({ x, y, z, vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1, vz: (Math.random() - 0.5) * 0.1 });
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.8,
        color: COLOR_SECONDARY,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 200;

    function animate() {
        requestAnimationFrame(animate);
        const positionsArray = geometry.attributes.position.array;
        const time = Date.now() * 0.0001;

        points.rotation.y = time * 0.2;
        points.rotation.x = time * 0.1;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            tempPositions[i].x += tempPositions[i].vx * 0.1;
            tempPositions[i].y += tempPositions[i].vy * 0.1;
            tempPositions[i].z += tempPositions[i].vz * 0.1;

            positionsArray[i3] = positionsArray[i3] + Math.sin(time * 5 + i) * 0.05;
            positionsArray[i3 + 1] = positionsArray[i3 + 1] + Math.cos(time * 3 + i) * 0.05;

            if (positionsArray[i3] > 400 || positionsArray[i3] < -400) positionsArray[i3] = (positionsArray[i3] < 0) ? 400 : -400;
        }

        geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const newWidth = parentContainer.clientWidth;
        const newHeight = parentContainer.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    }, false);
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

    const h1Text = "VENNITY.";
    const subtitleText = "PÁGINAS E GESTÃO DE ALTA PERFORMANCE";

    const heroH1Element = document.getElementById('hero-h1');
    const heroH1Text = heroH1Element ? "VENNITY." : h1Text;

    const heroPElement = document.querySelector('[data-gsap-hero="subtitle"] p');
    const heroPText = heroPElement ? "DESENVOLVA SEU LEGADO." : subtitleText;


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
        
        // NOVO: Garantir que o fallback desapareça e o texto 3D apareça
        // Efeito de entrada para o texto 3D (opcional, mas bom para sincronizar)
        gsap.to(textMesh.position, {
            y: "+=0.1", 
            duration: 1.5,
            ease: "elastic.out(1, 0.5)", 
            delay: 0.5 
        });


    },
        function (xhr) {
            console.log('Three.js Font load progress: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened loading the Three.js font:', error);
            document.getElementById('hero-h1-text-fallback').querySelector('span').style.opacity = 1;
            canvas.style.display = 'none';
        });

}

// NOVO: Função para animar a entrada dos elementos do Hero usando GSAP Timeline
function setupHeroEntranceAnimation() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Elementos a animar
    const h1Fallback = document.querySelector('[data-gsap-hero="h1"]'); // Fallback H1 (usado se Three.js falhar)
    const subtitle = document.querySelector('[data-gsap-hero="subtitle"]');
    const buttons = document.querySelector('[data-gsap-hero="buttons"]');
    const logoTicker = document.getElementById('impacto');
    const mainHeader = document.getElementById('main-header');
    
    // 1. Fade-in do H1 (Fallback) e Header (para cobrir Three.js load/fail)
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
            delay: 0.5 // Delay para o fundo carregar
        }, 0);
    }
    
    // Animação do Header
    tl.fromTo(mainHeader, {
        opacity: 0,
        y: -100
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, 0.2); // Começa logo depois do delay inicial

    // 2. Fade-in do Subtítulo
    tl.fromTo(subtitle, {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
    }, 0.8); // Começa 0.8s após o início

    // 3. Fade-in dos Botões
    tl.fromTo(buttons, {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
    }, 1.0); // Começa 1.0s após o início

    // 4. Fade-in do Ticker de Logos
    tl.fromTo(logoTicker, {
        opacity: 0,
        y: 50,
        scale: 0.95
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
    }, 1.2); // Começa 1.2s após o início
    
    // Garante que o Three.js e o fallback não briguem - 
    // O Three.js tem sua própria animação de "on load"
    document.getElementById('hero-h1').style.display = 'none'; // Esconde o H1 que estava sendo usado para o Three.js
}

// NOVO: Função para o Ticker com GSAP e Pause on Hover
function setupTickerAnimation() {
    const tickerContainer = document.querySelector('.ticker-container');
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContainer || !tickerContent) return;

    // Remove a animação CSS padrão
    tickerContainer.style.animation = 'none';

    // Clona o conteúdo para o loop infinito
    const clone = tickerContent.cloneNode(true);
    tickerContainer.appendChild(clone);
    
    const distance = -tickerContent.clientWidth;
    const duration = 15; // 15 segundos para um ciclo completo

    tickerAnimation = gsap.to(tickerContainer, {
        x: distance,
        duration: duration,
        ease: "linear",
        repeat: -1,
        paused: false
    });

    // Pause on Hover
    tickerContainer.addEventListener('mouseenter', () => tickerAnimation.pause());
    tickerContainer.addEventListener('mouseleave', () => tickerAnimation.play());
}


// NOVO: Função para o efeito Sticky Reveal na seção de vídeo
function setupVideoStickyReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const videoSection = document.getElementById('video-mockup');
    const videoMockup = videoSection.querySelector('.relative.w-full.max-w-6xl.mx-auto');

    if (!videoSection || !videoMockup) return;

    const scrollHeight = window.innerHeight * 1.5; 
    videoSection.style.minHeight = `${scrollHeight}px`;

    // 1. Animação de entrada do mockup
    gsap.fromTo(videoMockup, {
        opacity: 0,
        y: 50,
        scale: 0.9
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: videoSection,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true
        }
    });

    // 2. O efeito Sticky/Pin
    ScrollTrigger.create({
        trigger: videoSection,
        start: "top top",
        end: "bottom bottom",
        pin: videoMockup,
        pinSpacing: true,
        // O scrub faz com que a animação (paralaxe) acompanhe o scroll
        scrub: 1,
        onEnter: () => gsap.to(videoMockup, { opacity: 1, duration: 0.3 }),
        onLeave: () => gsap.to(videoMockup, { opacity: 1, duration: 0.3 }),
        onEnterBack: () => gsap.to(videoMockup, { opacity: 1, duration: 0.3 }),
        onLeaveBack: () => gsap.to(videoMockup, { opacity: 1, duration: 0.3 }),
    });

    // Opcional: Paralaxe sutil dentro da seção para o Mockup
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


document.addEventListener('DOMContentLoaded', () => {

    setupHeroEntranceAnimation();
    
    initMouseTracking();

    setupBackgroundScene();

    setupThreeJS();

    setupMouseGlow();

    setupDockEffect();
    
    // Animações de rolagem
    setupServiceCardsParallax();
    setupCardGlowEffect(); // Aplicará o mouse follow nos cards de Serviço e Preço

    setupProcessTimelineAnimation();

    setupSobreAnimation();

    setupResultsAnimation(); 

    setupReviewsGridAnimation();

    setupPricingAnimation();

    setupPricingMouseGlow();

    setupContactAnimation();
    setupContactMouseGlow();
    
    // Chamada das novas funções
    setupTickerAnimation();
    setupVideoStickyReveal();
    setupTextReveal(); // NOVO: Títulos de seção


    setupSimpleParticlesScene('video-particles');
    setupSimpleParticlesScene('processo-particles-canvas');
    setupSimpleParticlesScene('resultados-particles-canvas');
    setupSimpleParticlesScene('contato-particles-canvas');

    const mainHeader = document.getElementById('main-header');
    const logoContainer = document.getElementById('logo-container');

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