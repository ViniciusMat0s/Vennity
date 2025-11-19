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

        // Move o elemento de brilho
        glowElement.style.left = `${x}px`;
        glowElement.style.top = `${y}px`;

        // Controla a opacidade (mantém ativo se estiver sobre o canvas)
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
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        const glowOverlay = card.querySelector('.card-glow-overlay');
        if (!glowOverlay) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            glowOverlay.style.setProperty('--mouse-x', `${xPercent}%`);
            glowOverlay.style.setProperty('--mouse-y', `${yPercent}%`);

            gsap.to(card, {
                x: (x - rect.width / 2) * 0.05,
                y: (y - rect.height / 2) * 0.05,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
        });

        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.02, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
        });
    });
}

function setupCardScrollAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        const cards = document.querySelectorAll('[data-gsap-card="true"]');
        cards.forEach(card => {
            card.classList.add('fade-in-on-scroll');
        });
        return;
    }

    const cards = document.querySelectorAll('[data-gsap-card="true"]');

    cards.forEach((card, index) => {
        gsap.set(card, {
            opacity: 0,
            y: 50,
            rotationX: -90,
            transformOrigin: "center top"
        });

        ScrollTrigger.create({
            trigger: card,
            start: "top 90%",
            end: "bottom 20%",
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1.2,
                    delay: 0.1 * index,
                    ease: "elastic.out(1, 0.5)"
                });
            },
            once: true
        });
    });
}

function setupProcessTimelineAnimation() {
    if (typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') {
        console.warn("GSAP ou ScrollTrigger não estão carregados. A animação da timeline não será iniciada.");
        return;
    }

    const timeline = document.getElementById('timeline-line');
    const progressLine = document.getElementById('timeline-progress');
    const steps = document.querySelectorAll('.process-step-item');
    const dots = document.querySelectorAll('.timeline-dot');

    if (!timeline || steps.length === 0) return;

    // 1. Animação da Linha de Progresso Principal
    gsap.to(progressLine, {
        height: "100%", // Cresce de 0 para 100%
        ease: "power1.inOut",
        scrollTrigger: {
            trigger: timeline,
            start: "top center", // Começa quando o topo da linha atinge o centro da tela
            end: "bottom center", // Termina quando o final da linha atinge o centro da tela
            scrub: true, // Liga a animação à rolagem
        }
    });

    // 2. Animação de Revelação de Cada Passo (Intercalada)
    steps.forEach((step, index) => {
        const isEven = index % 2 === 0; // Para passos pares (0, 2, 4...) -> à esquerda
        const startX = isEven ? -100 : 100; // Começa da esquerda (negativo) ou direita (positivo)

        const stepDot = dots[index]; // O ponto correspondente na timeline

        gsap.fromTo(step, {
            opacity: 0,
            y: 50, // Sempre começa um pouco abaixo
            x: startX, // Movimento lateral intercalado
        }, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: step,
                start: "top 80%", // Quando o passo entra na tela
                toggleActions: "play none none none",
                once: true,
                onEnter: () => {
                    // Animação do número do passo (PASSO 1, PASSO 2...)
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

                    // Animação do ponto na timeline
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

        // 3. Animação de Pulso dos Pontos quando no centro da tela
        if (stepDot) {
            gsap.to(stepDot, {
                scale: 1.5,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.8)", // Sombra roxa mais destacada
                duration: 0.3,
                yoyo: true, // Volta ao tamanho original
                repeat: 1, // Repete uma vez para ter o efeito de pulso
                ease: "none",
                scrollTrigger: {
                    trigger: step,
                    start: "center center", // Quando o passo está bem no centro da tela
                    toggleActions: "play reverse play reverse", // Play ao entrar, reverse ao sair do centro
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

    // O Terminal está dentro de .bg-gray-900 (que é #111827).
    const TERMINAL_BACKGROUND_COLOR = '#111827'; 
    
    // 1. Animação de Entrada dos Blocos (Terminal e Texto)
    gsap.from(terminalContainer, {
        x: 50,
        opacity: 0,
        duration: 1,
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
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
        }
    });

    // 2. Efeito de Digitação (Typewriter Effect)
    // Garante que o código é visível para o GSAP ler o HTML, mas coberto para o efeito.
    terminalCode.style.visibility = 'visible';
    const cover = document.createElement('div');
    // Corrigido para usar o fundo do terminal
    cover.style.cssText = `position: absolute; inset: 0; background-color: ${TERMINAL_BACKGROUND_COLOR};`;
    terminalCode.parentElement.appendChild(cover);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: terminalContainer,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
            delay: 0.5
        }
    });

    // Anima o cover de 100% de largura para 0%, revelando o código por baixo.
    tl.to(cover, {
        width: "0%",
        duration: 2.5,
        ease: "none",
        delay: 0.5
    })
        .to(terminalCode, {
            duration: 0.1,
            onComplete: function () {
                cover.remove();
            }
        });
}

function setupReviewsGridAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP ou ScrollTrigger não estão carregados. A animação da grade de reviews não será iniciada.");
        return;
    }

    const reviewsGrid = document.getElementById('reviews-grid');
    const reviewCards = gsap.utils.toArray('.review-grid-item');
    const backgroundEffect = document.getElementById('reviews-background-effect');

    if (!reviewsGrid || reviewCards.length === 0) return;

    // 1. Animação de Entrada dos Cards (Skewed Staggered Entry)
    gsap.from(reviewCards, {
        opacity: 0,
        y: 150,
        skewY: 5, // Inclina o eixo Y
        rotation: 3, // Rotação sutil
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.15, // Atraso entre cada card
        scrollTrigger: {
            trigger: reviewsGrid,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
        }
    });

    // 2. Animação Parallax para cada Card (movimento vertical constante)
    reviewCards.forEach((card, i) => {
        // Define a distância de movimento vertical no Parallax (mais notável que antes)
        const moveDistance = (i % 2 === 0) ? 60 : -60; 

        gsap.to(card, {
            y: moveDistance, 
            ease: "none",
            scrollTrigger: {
                trigger: card,
                start: "top bottom", // Começa quando o topo do card entra na tela
                end: "bottom top",   // Termina quando o fundo do card sai da tela
                scrub: 1.2,          // Parallax suave
            }
        });
    });

    // 3. Animação Parallax para o Fundo da Seção de Reviews (opcional, mas AWWWARDS)
    if (backgroundEffect) {
        gsap.to(backgroundEffect, {
            yPercent: -10, // Move o background para cima 10% do seu próprio tamanho
            ease: "none",
            scrollTrigger: {
                trigger: reviewsGrid,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8, // Movimento mais suave que os cards
            }
        });

        // Adiciona um gradiente radial no background como um toque AWWWARDS
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

    // 0. Define o estado inicial para TODOS os cards ANTES do ScrollTrigger ser criado.
    gsap.set(priceCards, {
        opacity: 0, 
        y: 80, 
        visibility: "hidden" 
    });


    // 1. Animação de Entrada dos Cards (Staggered Fade-in)
    gsap.to(priceCards, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        visibility: "visible", // Torna visível ao final da animação
        scrollTrigger: {
            trigger: pricingGrid,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
        }
    });

    // 2. Animação de Rotação 3D sutil para o Card de Destaque no scroll
    if (destaqueCard) {
        gsap.to(destaqueCard, {
            rotationY: 1, // Gira sutilmente 1 grau
            y: -10, // Move 10px para cima
            ease: "sine.inOut",
            repeat: -1, // Loop infinito
            yoyo: true, // Vai e volta
            duration: 5,
        });

        // Adiciona um hover dinâmico que para a animação de fundo GSAP
        destaqueCard.addEventListener('mouseenter', () => {
             // Garante que o CSS hover scale entre em vigor
        });
        destaqueCard.addEventListener('mouseleave', () => {
             // Reinicia a animação GSAP no mouseleave
             gsap.to(destaqueCard, { rotationY: 1, y: -10, duration: 5, ease: "sine.inOut", repeat: -1, yoyo: true });
        });
    }
}

// NOVA FUNÇÃO: Aplica o brilho do mouse na seção de Preços
function setupPricingMouseGlow() {
    const glowElement = document.getElementById('mouse-glow-precos');
    const targetElement = document.getElementById('pricing-container-interactive');
    
    if (!glowElement || !targetElement) return;

    // Define a opacidade inicial do glow como 0, apenas ativa no hover
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

        // Move o elemento de brilho
        glowElement.style.left = `${x}px`;
        glowElement.style.top = `${y}px`;
    });
}


// ----------------------------------------------------
// CÓDIGO THREE.JS (VARS GLOBAIS E CONSTANTES)
// ----------------------------------------------------
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

const DENSITY = 15;
const DATA_STREAM_COUNT = 30;
const ENERGY_SPHERE_COUNT = 3;


function initMouseTracking() {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    function onDocumentMouseMove(event) {
        // Normaliza o movimento do mouse para valores entre -1 e 1
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

    // 1. Geração de Partículas 3D (Estrelas)
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

        // Cores das estrelas baseadas em tons de azul/roxo
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

    // 2. Adicionar Elementos Flutuantes (Geometria Abstrata)
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

    // 3. Cilindros de Linhas Aleatórias (Grid Tech)
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

    // 4. Partículas Reativas (campo de força sutil)
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

    // 5. Linhas de Conexão (Network Graph)
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

    // 6. Painéis de Dados Flutuantes (Abstract UI)
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

    // 7. Esferas de Energia Pulsante (Core Energy)
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

    // 8. Partículas Sequenciais (Flowing Data Stream)
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

    // Iluminação Geral da Cena (para os objetos Three.js)
    const ambientLight = new THREE.AmbientLight(0x1a1a1a, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);


    // 9. Loop de Animação do Fundo
    function animateBackground() {
        requestAnimationFrame(animateBackground);
        const time = Date.now() * 0.001;

        // Movimento de sincronização com o mouse
        backgroundCamera.rotation.x += (mouseY * 0.05 - backgroundCamera.rotation.x) * 0.05;
        backgroundCamera.rotation.y += (mouseX * 0.05 - backgroundCamera.rotation.y) * 0.05;

        // Rotação automática das estrelas
        bgPoints.rotation.y += 0.0005;
        bgPoints.rotation.x += 0.0002;

        // Animação das Formas Abstratas
        floatingObjects.forEach((mesh, index) => {
            mesh.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
            mesh.rotation.y += 0.0015 * (index % 3 === 0 ? 1 : -1);
            mesh.position.y += Math.sin(Date.now() * 0.0003 + index) * 0.03;
            mesh.position.x += Math.cos(Date.now() * 0.0002 + index) * 0.03;
        });

        // Animação dos Cilindros de Linhas
        techCylinders.forEach((mesh, index) => {
            mesh.rotation.x += 0.0007 * (index % 2 === 0 ? 1 : -1);
            mesh.rotation.y += 0.0009 * (index % 3 === 0 ? 1 : -1);
            mesh.position.z += Math.sin(Date.now() * 0.0004 + index) * 0.02;
        });

        // Animação e Interação das Partículas Reativas (Campo de Força)
        reactiveParticles.forEach(particle => {
            const distance = particle.position.distanceTo(backgroundCamera.position);
            const maxDistance = 150;
            const effectFactor = Math.max(0, 1 - (distance / maxDistance));

            particle.material.opacity = particle.initialOpacity + (effectFactor * 0.2);
            particle.position.x += (mouseX * effectFactor * 0.01);
            particle.position.y += (mouseY * effectFactor * 0.01);
        });

        // Atualização da Rede de Conexão
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
                    // Adiciona as coordenadas da linha
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

        // Animação dos Painéis de Dados
        dataPanels.forEach((mesh, index) => {
            mesh.rotation.x += 0.0005 * (index % 2 === 0 ? 1 : -1);
            mesh.rotation.y += 0.001;

            // Pulsação de Opacidade (piscar)
            mesh.material.opacity = 0.05 + (Math.sin(time * 2 + index) * 0.03);
        });

        // Animação das Esferas de Energia
        energySpheres.forEach((sphere, index) => {
            const pulse = 0.5 + Math.sin(time * 1.5 + index) * 0.5;
            sphere.material.emissiveIntensity = 0.2 + pulse * 0.5;
            sphere.scale.set(1 + pulse * 0.05, 1 + pulse * 0.05, 1 + pulse * 0.05);
        });
        pulseLight.intensity = 5 + Math.sin(time * 1.5) * 3;

        // Animação do Fluxo de Dados Sequencial (movimento em onda)
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

    // Resposta ao Redimensionamento
    window.addEventListener('resize', () => {
        const newWidth = canvas.clientWidth;
        const newHeight = canvas.clientHeight;

        backgroundCamera.aspect = newWidth / newHeight;
        backgroundCamera.updateProjectionMatrix();

        bgRenderer.setSize(newWidth, newHeight);
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

    const heroPElement = document.querySelector('#hero-canvas + div p.whitespace-nowrap');
    const heroPText = heroPElement ? "PÁGINAS E GESTÃO DE ALTA PERFORMANCE" : subtitleText;


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

        // **CHAMADA DE RESPONSIVIDADE INICIAL**
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

            textMesh.rotation.y += 0.003;
            textMesh.rotation.x += (mouseY * 0.1 - textMesh.rotation.x) * 0.05;
            textMesh.rotation.y += (mouseX * 0.1 - textMesh.rotation.y) * 0.05;

            subtitleMesh.rotation.y += 0.003;
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

            // **CHAMADA DE RESPONSIVIDADE NO REDIMENSIONAMENTO**
            updateTextSizeAndCamera(parentContainer, camera, textMesh, subtitleMesh);
        }

    },
        function (xhr) {
            console.log('Three.js Font load progress: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened loading the Three.js font:', error);
            document.getElementById('hero-h1').style.opacity = 1;
            canvas.style.display = 'none';
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

            // Vizinho Imediato Anterior
            if (index > 0) {
                dockLinks[index - 1].classList.add('prev-hover');
            }
            // Segundo Vizinho Anterior
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

    initMouseTracking();

    setupBackgroundScene();

    setupThreeJS();

    setupMouseGlow();

    setupDockEffect();

    setupCardGlowEffect();

    setupCardScrollAnimation();

    setupProcessTimelineAnimation();

    setupSobreAnimation();

    setupReviewsGridAnimation();
    
    setupPricingAnimation(); 
    
    setupPricingMouseGlow(); // Chamada adicionada

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