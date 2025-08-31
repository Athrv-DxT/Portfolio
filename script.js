document.addEventListener('DOMContentLoaded', () => {
  const greetingElement = document.getElementById('greeting-text');
  const cursorElement = document.getElementById('greeting-cursor');
  const detailsSection = document.getElementById('details-section');
  const modernLoader = document.getElementById('modern-loader');
  const enterButtonContainer = document.getElementById('enter-button-container');
  const enterButton = document.getElementById('enter-button');
  const transitionAnimation = document.getElementById('transition-animation');
  const portfolioSection = document.getElementById('portfolio-section');
  const introSection = document.getElementById('intro-section');
  const neuralNetwork = document.getElementById('neural-network');
  const mobileMessage = document.getElementById('mobile-message');
  const greetings = ['Hello', 'Hola', 'नमस्ते', "I'm"];
  let currentGreetingIndex = 0;
  let finalGreetingShown = false;

  const canvas = document.getElementById('neural-network');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Handle orientation changes for mobile devices
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      resizeCanvas();
      // Recalculate node count and positions after orientation change
      const newNodeCount = getNodeCount();
      if (newNodeCount !== nodeCount) {
        nodes.length = 0;
        for (let i = 0; i < newNodeCount; i++) {
          nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
        }
      }
    }, 100);
  });

  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      // Increase node sizes for better mobile visibility
      const isMobile = window.innerWidth < 768;
      this.size = isMobile ? (Math.random() * 4 + 4) : (Math.random() * 2 + 2);
      this.speed = Math.random() * 0.8 + 0.3;
      this.velocity = {
        x: (Math.random() - 0.5) * this.speed,
        y: (Math.random() - 0.5) * this.speed
      };
      this.directionChangeTime = 0;
      this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
      this.pulseSpeed = Math.random() * 0.03 + 0.015;
      this.originalSize = this.size;
      this.pulseAmount = Math.random() * 1.5 + 1;
    }

    update() {
      if (Date.now() - this.directionChangeTime > Math.random() * 5000 + 3000) {
        this.velocity = {
          x: (Math.random() - 0.5) * this.speed,
          y: (Math.random() - 0.5) * this.speed
        };
        this.directionChangeTime = Date.now();
      }

      this.size += this.pulseDirection * this.pulseSpeed;
      if (this.size > this.originalSize + this.pulseAmount || this.size < this.originalSize - this.pulseAmount) {
        this.pulseDirection *= -1;
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      if (this.x < 0 || this.x > canvas.width) this.velocity.x *= -1;
      if (this.y < 0 || this.y > canvas.height) this.velocity.y *= -1;
    }

    draw() {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.5, 'rgba(255, 235, 59, 0.7)');
      gradient.addColorStop(1, 'rgba(255, 235, 59, 0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  function getNodeCount() {
    const width = window.innerWidth;
    if (width < 480) return Math.min(Math.floor(window.innerWidth * window.innerHeight / 8000), 120);
    else if (width < 768) return Math.min(Math.floor(window.innerWidth * window.innerHeight / 6000), 150);
    else return Math.min(Math.floor(window.innerWidth * window.innerHeight / 8000), 180);
  }

  const nodeCount = getNodeCount();
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const connectionDistance = window.innerWidth < 768 ? 80 : 150;

        if (distance < connectionDistance) {
          const opacity = 1 - distance / connectionDistance;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          // Make connections more visible on mobile
          const connectionOpacity = window.innerWidth < 768 ? opacity * 1.2 : opacity * 0.5;
          ctx.strokeStyle = `rgba(186, 104, 200, ${connectionOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Increase data transfer frequency for mobile devices
          const transferProbability = window.innerWidth < 768 ? 0.015 : 0.002;
          if (Math.random() < transferProbability) {
            animateDataTransfer(nodes[i], nodes[j]);
          }
        }
      }
    }

    nodes.forEach(node => {
      node.update();
      node.draw();
    });

    requestAnimationFrame(animate);
  }

  const dataTransfers = [];

  class DataTransfer {
    constructor(startNode, endNode) {
      this.startNode = startNode;
      this.endNode = endNode;
      this.progress = 0;
      this.speed = Math.random() * 0.015 + 0.015;
      // Increase data transfer particle size on mobile
      const isMobile = window.innerWidth < 768;
      this.size = isMobile ? (Math.random() * 6 + 5) : (Math.random() * 3 + 2);
    }

    update() {
      this.progress += this.speed;
      return this.progress >= 1;
    }

    draw() {
      const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
      const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.size);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(1, 'rgba(111, 134, 214, 0.7)');
      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  function animateDataTransfer(startNode, endNode) {
    dataTransfers.push(new DataTransfer(startNode, endNode));
  }

  function updateDataTransfers() {
    for (let i = dataTransfers.length - 1; i >= 0; i--) {
      if (dataTransfers[i].update()) {
        dataTransfers.splice(i, 1);
      } else {
        dataTransfers[i].draw();
      }
    }

    requestAnimationFrame(updateDataTransfers);
  }

  animate();
  updateDataTransfers();

  // Mobile device detection and message
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  }

  function showMobileMessage() {
    if (isMobileDevice()) {
      mobileMessage.classList.add('show');
      setTimeout(() => {
        mobileMessage.classList.remove('show');
      }, 2000);
    }
  }

  // Show mobile message after a short delay
  setTimeout(showMobileMessage, 1000);

  modernLoader.style.display = 'block';

  typeGreeting(greetings[currentGreetingIndex], () => {
    deleteGreeting(() => {
      cycleGreetings();
    });
  });

  function typeGreeting(greeting, onComplete) {
    let charIndex = 0;
    greetingElement.textContent = '';

    function typeChar() {
      if (charIndex < greeting.length) {
        greetingElement.textContent += greeting.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 70);
      } else {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 800);
      }
    }

    typeChar();
  }

  function deleteGreeting(onComplete) {
    let text = greetingElement.textContent;

    function deleteChar() {
      if (text.length > 0) {
        text = text.substring(0, text.length - 1);
        greetingElement.textContent = text;
        setTimeout(deleteChar, 50);
      } else {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 200);
      }
    }

    deleteChar();
  }

  function cycleGreetings() {
    currentGreetingIndex = (currentGreetingIndex + 1) % greetings.length;

    typeGreeting(greetings[currentGreetingIndex], () => {
      if (currentGreetingIndex === greetings.length - 1) {
        finalGreetingShown = true;
        modernLoader.style.opacity = '0';
        modernLoader.style.transition = 'opacity 0.8s ease';
        introSection.classList.add('expanded');

        setTimeout(() => {
          modernLoader.style.display = 'none';
          detailsSection.style.display = 'block';
          detailsSection.style.opacity = '0';
          detailsSection.style.transform = 'translateY(30px)';
          detailsSection.style.transition = 'opacity 1.2s ease, transform 1.2s ease';

          setTimeout(() => {
            detailsSection.style.opacity = '1';
            detailsSection.style.transform = 'translateY(0)';
            detailsSection.classList.add('visible');

            setTimeout(() => {
              enterButtonContainer.classList.add('visible');
            }, 800);
          }, 100);
        }, 800);
      } else {
        deleteGreeting(() => {
          cycleGreetings();
        });
      }
    });
  }



  enterButton.addEventListener('click', () => {
    document.body.classList.add('portfolio-active');
    neuralNetwork.classList.add('fade');
    introSection.style.opacity = '0';
    transitionAnimation.classList.add('active');

    setTimeout(() => {
      introSection.style.display = 'none';
      transitionAnimation.classList.remove('active');
      portfolioSection.style.display = 'block';

      setTimeout(() => {
        portfolioSection.classList.add('visible');
        // Update browser history to show portfolio page
        window.history.pushState({ page: 'portfolio' }, 'Portfolio', '#portfolio');
        

      }, 100);
    }, 1000);
  });

  window.addEventListener('resize', () => {
    while (nodes.length > getNodeCount()) nodes.pop();
    while (nodes.length < getNodeCount()) {
      nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
    }
  });

  function initPortfolioSection() {
    document.querySelectorAll('.portfolio-nav a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initProjectsSection() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
      button.addEventListener('click', function () {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.animation = 'fadeIn 0.5s ease forwards';
            }, 100);
          } else {
            card.classList.add('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animation = 'none';
          }
        });
      });
    });
  }

  function initializeSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    const techOverlay = document.getElementById('tech-overlay');
    const techContainers = document.querySelectorAll('.tech-container');

    skillCards.forEach(card => {
      card.addEventListener('click', function () {
        const skill = this.getAttribute('data-skill');
        techContainers.forEach(container => container.classList.remove('active'));
        const techContainer = document.getElementById(`${skill}-tech`);
        if (techContainer) techContainer.classList.add('active');
        techOverlay.classList.add('active');
      });
    });

    techOverlay.addEventListener('click', function (e) {
      if (e.target === techOverlay) {
        techOverlay.classList.remove('active');
        techContainers.forEach(container => container.classList.remove('active'));
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && techOverlay.classList.contains('active')) {
        techOverlay.classList.remove('active');
        techContainers.forEach(container => container.classList.remove('active'));
      }
    });
  }

  initPortfolioSection();
  initializeSkillCards();
  initProjectsSection();

  // Certificate Modal Functionality
  const certificateModal = document.getElementById('certificate-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImage = document.getElementById('modal-certificate-image');

  // Function to open modal with certificate image
  function openCertificateModal(imageSrc, isSpecialCertificate = false) {
    modalImage.src = imageSrc;
    
    // Apply special sizing for problematic certificates
    if (isSpecialCertificate) {
      certificateModal.classList.add('special-sizing');
    } else {
      certificateModal.classList.remove('special-sizing');
    }
    
    certificateModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  // Function to close modal
  function closeCertificateModal() {
    certificateModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Event listeners for modal
  modalClose.addEventListener('click', closeCertificateModal);
  certificateModal.addEventListener('click', (e) => {
    if (e.target === certificateModal) {
      closeCertificateModal();
    }
  });

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certificateModal.classList.contains('active')) {
      closeCertificateModal();
    }
  });

  // Update certificate links to use modal
  document.querySelectorAll('.certification-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const imageSrc = link.getAttribute('href');
      
      // Check if this is one of the problematic certificates
      const isSpecialCertificate = imageSrc.includes('nss_recruitmentletter') || 
                                  imageSrc.includes('gfg_loa') || 
                                  imageSrc.includes('ic_offerletter');
      
      openCertificateModal(imageSrc, isSpecialCertificate);
    });
  });

  // Upcoming Projects Card Functionality - Modal Approach
  function initializeUpcomingProjectsCard() {
    const upcomingCard = document.getElementById('upcoming-projects-card');
    const upcomingModal = document.getElementById('upcoming-projects-modal');
    const modalClose = document.getElementById('modal-upcoming-close');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const projectCards = document.querySelectorAll('.upcoming-project-modal');
    
    let currentProject = 0;

    // Open modal when card is clicked
    upcomingCard.addEventListener('click', function() {
      upcomingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      showProject(currentProject);
    });

    // Close modal when close button is clicked
    modalClose.addEventListener('click', function() {
      upcomingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    upcomingModal.addEventListener('click', function(e) {
      if (e.target === upcomingModal) {
        upcomingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && upcomingModal.classList.contains('active')) {
        upcomingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // Carousel navigation
    carouselDots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        currentProject = index;
        showProject(currentProject);
        updateCarouselDots();
      });
    });

    // Function to show specific project
    function showProject(index) {
      projectCards.forEach((card, i) => {
        if (i === index) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateX(20px)';
          
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Function to show all projects (for initial view)
    function showAllProjects() {
      projectCards.forEach((card, i) => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
        card.style.transition = 'all 0.4s ease';
      });
    }

    // Initialize: Show all projects by default
    showAllProjects();
    updateCarouselDots();

    // Function to update carousel dots
    function updateCarouselDots() {
      carouselDots.forEach((dot, index) => {
        if (index === currentProject) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Add hover effects
    upcomingCard.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 15px 30px rgba(255, 235, 59, 0.2)';
    });

    upcomingCard.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 10px 20px rgba(255, 235, 59, 0.1)';
    });

    // Add keyboard support
    upcomingCard.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        upcomingCard.click();
      }
    });

    // Make the card focusable
    upcomingCard.setAttribute('tabindex', '0');

    // Initialize first project
    showProject(0);
    updateCarouselDots();
  }

  // Initialize the upcoming projects card
  initializeUpcomingProjectsCard();

  // Handle browser back/forward navigation
  window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page === 'portfolio') {
      // User navigated back to portfolio page
      showPortfolioPage();
    } else {
      // User navigated back to start page
      showStartPage();
    }
  });

  // Check initial page state (if user refreshes on portfolio page)
  if (window.location.hash === '#portfolio') {
    showPortfolioPage();
  }

  // Function to show portfolio page
  function showPortfolioPage() {
    introSection.style.display = 'none';
    document.body.classList.add('portfolio-active');
    neuralNetwork.classList.add('fade');
    portfolioSection.style.display = 'block';
    portfolioSection.classList.add('visible');
  }

  // Function to show start page
  function showStartPage() {
    introSection.style.display = 'block';
    introSection.style.opacity = '1';
    document.body.classList.remove('portfolio-active');
    neuralNetwork.classList.remove('fade');
    portfolioSection.style.display = 'none';
    portfolioSection.classList.remove('visible');
  }
}); // Closing the DOMContentLoaded listener