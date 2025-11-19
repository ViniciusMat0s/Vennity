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
if (savedTheme) {
    applyTheme(savedTheme === 'light');
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme(true);
} else {
    applyTheme(false);
}

toggleButton.addEventListener('click', () => {
    applyTheme(!body.classList.contains(LIGHT_MODE_CLASS));
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
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof TextPlugin === 'undefined') return;

    const section = document.getElementById('sobre');
    if (!section) return;

    const terminalContainer = section.querySelector('[data-gsap-target="terminal"]');
    const textContainer = section.querySelector('[data-gsap-target="text"]');
    const terminalCode = section.querySelector('[data-gsap-terminal="true"]');
    
    // --- CORREÇÃO DE ANIMAÇÃO DE DIGITAÇÃO PARA PRESERVAR CORES ---
    
    // 1. Extrai o conteúdo HTML completo e cria um backup temporário
    const rawCodeHTML = terminalCode.innerHTML.trim();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawCodeHTML;

    // 2. Limpa o terminal para começar a animação, mas mantém o estilo de visibility
    terminalCode.innerHTML = '';
    terminalCode.style.visibility = 'visible';

    // 3. Timeline principal da seção "Sobre"
    const tlMain = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
        }
    });

    // Animação de entrada dos blocos (Texto e Terminal)
    tlMain.from(textContainer, {
        x: -50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
    }, 0)
    .from(terminalContainer, {
        x: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
    }, 0);

    // 4. Animação de digitação do código (Sequencial)
    const tlTyping = gsap.timeline({
        delay: 1.2, // Começa após a animação de entrada da seção
        paused: true
    });
    
    // NodeList que inclui elementos (tags <span>) e nós de texto
    const originalNodes = Array.from(tempDiv.childNodes).filter(node => node.textContent.trim().length > 0 || node.nodeType === 1);

    originalNodes.forEach(node => {
        const isElement = node.nodeType === 1;
        const targetContainer = document.createElement('div');
        
        // Mantemos a quebra de linha usando a div, mas queremos animar o conteúdo
        if (isElement) {
            // Se for um elemento (ex: <span class="text-blue-400">)
            const targetElement = node.cloneNode(true);
            const originalText = targetElement.innerHTML;
            
            // Limpa o conteúdo dentro da <span> de cor e insere um cursor <i> para o GSAP escrever
            targetElement.innerHTML = `<i class="typing-target">${originalText}</i>`;
            const typingTarget = targetElement.querySelector('.typing-target');
            typingTarget.innerHTML = ''; // Limpa o alvo

            targetContainer.appendChild(targetElement);
            terminalCode.appendChild(targetContainer);
            
            tlTyping.from(targetContainer, {
                opacity: 0, 
                duration: 0.01 
            }, ">")
            .to(typingTarget, {
                text: {
                    value: originalText,
                    speed: 1 
                },
                duration: originalText.length * 0.04,
                ease: "none"
            });
            
        } else {
            // Se for um nó de texto puro (espaços ou texto sem cor)
            const textContent = node.textContent;
            targetContainer.innerHTML = `<i class="typing-target">${textContent}</i>`;
            const typingTarget = targetContainer.querySelector('.typing-target');
            typingTarget.innerHTML = ''; 
            
            terminalCode.appendChild(targetContainer);
            
            tlTyping.from(targetContainer, {
                opacity: 0, 
                duration: 0.01 
            }, ">")
            .to(typingTarget, {
                text: {
                    value: textContent,
                    speed: 1 
                },
                duration: textContent.length * 0.04,
                ease: "none"
            });
        }
    });

    // Executa a animação de digitação após a entrada da seção
    tlMain.add(() => tlTyping.play(), "-=0.2"); 
}


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
        // Aumentando a distância de movimento para garantir que o corte seja evitado 
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
    const mainBlock = section.querySelector('[data-gsap-contact="main"]'); // Novo bloco principal (o cartão)
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

    // 1. Animação de entrada do Cartão Principal (Fly-in)
    tlMain.from(mainBlock, {
        opacity: 0,
        y: 80, 
        scale: 0.95,
        rotationX: -10,
        transformOrigin: "center center",
        duration: 1.2,
        ease: "power3.out"
    }, 0); 

    // 2. Animação de entrada dos elementos internos (Staggered)
    gsap.from([headerBlock, detailsBlock], {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    }, 0.5); // Começa após 0.5s

    // 3. Animação dos campos do formulário (Staggered Reveal com rotação)
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
    
    // 4. Animação das redes sociais
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

    // --- CÓDIGO RESTAURADO PARA PARTÍCULAS TIPO GALÁXIA (bgPoints) ---
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
    // --- FIM DO CÓDIGO RESTAURADO ---
    
    floatingObjects = [];
    // REMOVIDO: Objetos flutuantes. Deixamos apenas a declaração da lista vazia.
    /*
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
    */

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

        // --- CÓDIGO RESTAURADO PARA ANIMAÇÃO DA GALÁXIA ---
        if (bgPoints) {
            bgPoints.rotation.y += 0.0005;
            bgPoints.rotation.x += 0.0002;
        }
        // --- FIM DO CÓDIGO RESTAURADO ---

        // REMOVIDO: Animação de objetos flutuantes
        /*
        floatingObjects.forEach((mesh, index) => {
            mesh.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
            mesh.rotation.y += 0.0015 * (index % 3 === 0 ? 1 : -1);
            mesh.position.y += Math.sin(Date.now() * 0.0003 + index) * 0.03;
            mesh.position.x += Math.cos(Date.now() * 0.0002 + index) * 0.03;
        });
        */
        
        // Outras animações de objetos (removidas)
        
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
    // Código de Three.js para partículas simples removido conforme solicitado
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

    const h1Text = "VENNITY";
    const subtitleText = "PÁGINAS E GESTÃO DE ALTA PERFORMANCE";

    const heroH1Element = document.getElementById('hero-h1');
    const heroH1Text = "VENNITY";

    const heroPElement = document.querySelector('.max-w-1xl.mx-auto p');
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
            document.getElementById('hero-h1').style.display = 'block'; // Mostra o H1 do HTML como fallback
            canvas.style.display = 'none';
        });

}

// NOVO: Função para animar a entrada dos elementos do Hero usando GSAP Timeline
function setupHeroEntranceAnimation() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Elementos a animar
    const h1Fallback = document.getElementById('hero-h1'); 
    const subtitle = document.querySelector('.max-w-1xl.mx-auto');
    const buttons = document.querySelector('.mt-12.flex');
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
}

// NOVO: Função para o Ticker com GSAP e Pause on Hover
function setupTickerAnimation() {
    const tickerContainer = document.querySelector('.ticker-container');
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContainer || !tickerContent) return;

    // Remove a animação CSS padrão
    tickerContainer.style.animation = 'none';

    // Clona o conteúdo para o loop infinito
    const contentWidth = tickerContent.clientWidth;
    const distance = -contentWidth;
    const duration = 15; // 15 segundos para um ciclo completo

    // Cria o clone se ainda não existir
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
            // Reinicia a posição para simular o loop infinito
            this.set(tickerContainer, {x: 0});
        }
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

    // O Mockup já tem uma animação de fade-in-up, vamos usar o GSAP para o Pin
    
    ScrollTrigger.create({
        trigger: videoSection,
        start: "top top",
        end: "bottom bottom",
        pin: videoMockup,
        pinSpacing: true,
        // O scrub faz com que a animação (paralaxe) acompanhe o scroll
        scrub: 1,
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

// NOVO: Função de Animação do Footer (AWWWARDS Style)
function setupFooterAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#main-footer",
            start: "top 85%", // Começa a animação quando 85% do footer está visível
            toggleActions: "play none none none",
            once: true,
        }
    });

    // 1. Animação do Título (Texto dividido por linha)
    tl.from(".footer-title-line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
    })

    // 2. Animação da Descrição e Botão
    .from(".footer-cta-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
    }, "<0.2") // Inicia um pouco depois do título

    .from(".footer-cta-button", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
    }, "<0.2")

    // 3. Animação dos Grupos de Links (Staggered Reveal)
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
    }, "<0") // Inicia junto com o grupo esquerdo

    .from(".footer-link-item", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power1.out",
    }, "<0.2") // Inicia um pouco depois dos grupos laterais

    // 4. Animação do Copyright
    .from(".footer-copyright", {
        opacity: 0,
        duration: 1,
        ease: "power1.out",
    }, ">-0.5"); // Termina com o copyright
}


document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuração e Init Three.js / Mouse ---
    initMouseTracking();
    setupBackgroundScene(); // Partículas Three.js reduzidas
    setupThreeJS();
    setupMouseGlow();
    setupDockEffect();
    
    // É importante chamar o Hero Entrance logo no início
    setupHeroEntranceAnimation();
    
    // --- Animações GSAP de Rolagem ---
    
    // Registra Plugins (se já não estiverem no topo do arquivo)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof TextPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, TextPlugin); 
    }

    // Inicializa todas as animações
    let ctx = gsap.context(() => {
        // Hero
        setupTickerAnimation();
        
        // Seções
        setupVideoStickyReveal();
        setupTextReveal(); 
        setupServiceCardsParallax();
        setupProcessTimelineAnimation();
        setupSobreAnimation(); // CORRIGIDA PARA TER TYPEWRITER FUNCIONAL
        setupResultsAnimation(); 
        setupReviewsGridAnimation();
        setupPricingAnimation();
        setupContactAnimation(); // OTIMIZADA PARA O NOVO LAYOUT COMPACTO
        
        // Footer (Novo)
        setupFooterAnimations();
    });

    // --- Efeitos Interativos / Mouse ---
    setupCardGlowEffect();
    setupPricingMouseGlow();
    setupContactMouseGlow();
    // REMOVIDO: Partículas simples dessas seções
    /*
    setupSimpleParticlesScene('video-particles');
    setupSimpleParticlesScene('processo-particles-canvas');
    setupSimpleParticlesScene('resultados-particles-canvas');
    setupSimpleParticlesScene('contato-particles-canvas');
    */


    // --- Lógica de Header e Scroll Genérico (Mantida) ---
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

    // Fallback/Animação genérica para elementos que não usam GSAP dedicado
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