// ===== CONFIGURAÇÕES E CONSTANTES =====
const CONFIG = {
    THEME_KEY: 'portfolio-theme',
    ANIMATION_DURATION: 300,
    SCROLL_OFFSET: 80
};

// ===== CLASSE PRINCIPAL DO PORTFÓLIO =====
class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initTheme();
        this.initScrollAnimations();
        this.initSmoothScrolling();
        this.initContactForm();
        this.initTypingEffect();
    }

    // ===== GERENCIAMENTO DE TEMA =====
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');

        // Verificar preferência salva ou do sistema
        const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            body.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            themeIcon.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem(CONFIG.THEME_KEY, isDark ? 'dark' : 'light');
            
            // Animação suave do ícone
            themeIcon.style.transform = 'scale(0.8)';
            setTimeout(() => {
                themeIcon.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // ===== ANIMAÇÕES DE SCROLL =====
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    if (entry.target.classList.contains('about-stats')) {
                        this.animateStats();
                    }
                    
                    if (entry.target.classList.contains('skill-category')) {
                        this.animateSkills(entry.target);
                    }
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.about, .skills, .projects, .experience, .contact, .skill-category, .project-card, .timeline-item');
        animatedElements.forEach(el => observer.observe(el));
    }

    // ===== ANIMAÇÃO DAS ESTATÍSTICAS =====
    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + '+';
            }, 30);
        });
    }

    // ===== ANIMAÇÃO DAS HABILIDADES =====
    animateSkills(skillCategory) {
        const skillTags = skillCategory.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(20px)';
                tag.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }

    // ===== SCROLL SUAVE PARA NAVEGAÇÃO =====
    initSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - CONFIG.SCROLL_OFFSET;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        this.initActiveNavigation();
    }

    // ===== NAVEGAÇÃO ATIVA =====
    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + CONFIG.SCROLL_OFFSET + 50;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // ===== EFEITO DE DIGITAÇÃO NO HERO =====
    initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const highlight = heroTitle.querySelector('.highlight');
        const highlightText = highlight ? highlight.textContent : '';
        
        if (highlight) {
            highlight.style.opacity = '0';
            setTimeout(() => {
                this.typeWriter(highlight, highlightText, 100);
            }, 1000);
        }
    }

    typeWriter(element, text, speed) {
        element.style.opacity = '1';
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                element.style.borderRight = '2px solid var(--color-primary)';
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }

    // ===== FORMULÁRIO DE CONTATO =====
    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        this.clearFieldError(field);

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um e-mail válido';
                }
                break;
            case 'text':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'O nome deve ter pelo menos 2 caracteres';
                }
                break;
            default:
                if (field.tagName === 'TEXTAREA' && value.length < 10) {
                    isValid = false;
                    errorMessage = 'A mensagem deve ter pelo menos 10 caracteres';
                }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            errorElement.style.display = 'block';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const inputs = form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Por favor, corrija os erros no formulário.', 'error');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
    setupEventListeners() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(CONFIG.THEME_KEY)) {
                document.body.classList.toggle('dark-mode', e.matches);
                document.querySelector('.theme-icon').textContent = e.matches ? '☀️' : '🌙';
            }
        });

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ===== MANIPULADORES DE EVENTOS =====
    handleResize() {
        console.log('Window resized');
    }

    handleScroll() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        }
    }

    // ===== UTILITÁRIOS =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

// ===== ADICIONAR ESTILOS CSS DINÂMICOS =====
const dynamicStyles = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .nav-link.active {
        color: var(--color-primary) !important;
        font-weight: 600;
    }
    
    .notification {
        font-family: var(--font-family, 'Inter', sans-serif);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hero {
        transition: transform 0.1s ease-out;
    }
    
    .theme-toggle .theme-icon {
        transition: transform 0.2s ease;
    }
    
    .skill-tag {
        transition: all 0.3s ease;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);
