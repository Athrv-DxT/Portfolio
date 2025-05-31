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

  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 2;
      this.speed = Math.random() * 0.5 + 0.2;
      this.velocity = {
        x: (Math.random() - 0.5) * this.speed,
        y: (Math.random() - 0.5) * this.speed
      };
      this.directionChangeTime = 0;
      this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.originalSize = this.size;
      this.pulseAmount = Math.random() * 1 + 0.5;
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
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 235, 59, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 235, 59, 0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  function getNodeCount() {
    const width = window.innerWidth;
    if (width < 480) return Math.min(Math.floor(window.innerWidth * window.innerHeight / 25000), 50);
    else if (width < 768) return Math.min(Math.floor(window.innerWidth * window.innerHeight / 20000), 75);
    else return Math.min(Math.floor(window.innerWidth * window.innerHeight / 15000), 100);
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
        const connectionDistance = window.innerWidth < 768 ? 100 : 150;

        if (distance < connectionDistance) {
          const opacity = 1 - distance / connectionDistance;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(186, 104, 200, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          if (Math.random() < 0.002) {
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
      this.speed = Math.random() * 0.01 + 0.01;
      this.size = Math.random() * 3 + 2;
    }

    update() {
      this.progress += this.speed;
      return this.progress >= 1;
    }

    draw() {
      const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
      const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.size);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(111, 134, 214, 0.5)');
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
        setTimeout(typeChar, 100);
      } else {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1200);
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
        setTimeout(deleteChar, 70);
      } else {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 400);
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
  
  // Testaments section functionality
  function initTestamentsSection() {
    const books = document.querySelectorAll('.book');
    const bookPreview = document.getElementById('book-preview');
    const previewContent = document.querySelector('.preview-content');
    const previewClose = document.querySelector('.preview-close');
    const previewImage = document.getElementById('preview-image');
    const previewTitle = document.getElementById('preview-title');
    const previewDescription = document.getElementById('preview-description');
    
    const certificateData = {
      certificate1: {
        title: "Python Basics",
        issuer: "HackerRank",
        description: "Completed the Python Basics certification, demonstrating proficiency in Python programming fundamentals.",
        image: "testaments/pythonbasic_certficate.png" 
      },
      certificate2: {
        title: "Programming, Data Structures And Algorithms Using Python",
        issuer: "NPTEL - IIT Madras",
        description: "Completed the NPTEL course on Programming, Data Structures, and Algorithms using Python, covering advanced programming concepts.",
        image: "testaments/python_dsacertf.png" 
      },
      certificate3: {
        title: "Hack4Health Hackathon",
        issuer: "Health-O-Tech Club",
        description: "Participated in the Hack4Health Hackathon, making a medical report simplifier.",
        image: "testaments/Hack4Health_certificate.jpg" 
      },
      certificate4: {
        title: "BCGX GenAI Job Simulation",
        issuer: "BCGx - Forage",
        description: "Completed the BCGX GenAI Job Simulation, gaining insights data analysis and AI.",
        image: "testaments/BCGX_certficate.jpg" 
      },
      certificate5: {
        title: "Matlab Onramp",
        issuer: "MathWorks",
        description: "Completed the Matlab Onramp course, learning the basics of MATLAB programming and data analysis.",
        image: "testaments/matlab_certificate.png" 
      },
      certificate6: {
        title: "Android Club - Winter of Code",
        issuer: "Android Club",
        description: "Participated in the Android Club's Winter of Code program, contributing to open-source projects.",
        image: "testaments/acwoc_certificate.png" 
      },
      letter1: {
        title: "Letter of Appointment - GFG Student Chapter",
        issuer: "GeeksforGeeks",
        description: "OFficial appointment as the Tech team member for the GFG Student Chapter, responsible for contributing to technical aspects and events for the club",
        image: "testaments/gfg_loa.jpg" 
      },
      letter2: {
        title: "Letter of Appointment - iCreate Club",
        issuer: "iCreate",
        description: "Official Appointment as the Web Development team member for the iCreate Club, responsible for creating and maintaining the club's website.",
        image: "testaments/ic_offerletter.jpg" 
      }
    };
    
    books.forEach(book => {
      book.addEventListener('click', function() {
        const certificateId = this.getAttribute('data-certificate');
        const data = certificateData[certificateId];
        
        previewTitle.textContent = data.title;
        previewDescription.textContent = data.description;
        
        previewImage.src = data.image;
        
        bookPreview.classList.add('active');
        setTimeout(() => {
          previewContent.classList.add('active');
        }, 100);
      });
    });
    
    previewClose.addEventListener('click', function() {
      previewContent.classList.remove('active');
      setTimeout(() => {
        bookPreview.classList.remove('active');
      }, 500);
    });
    
    bookPreview.addEventListener('click', function(e) {
      if (e.target === bookPreview) {
        previewContent.classList.remove('active');
        setTimeout(() => {
          bookPreview.classList.remove('active');
        }, 500);
      }
    });
    
    books.forEach(book => {
      book.addEventListener('mousemove', function(e) {
        const bookRect = this.getBoundingClientRect();
        const bookCenterX = bookRect.left + bookRect.width / 2;
        const bookCenterY = bookRect.top + bookRect.height / 2;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const angleY = (mouseX - bookCenterX) / 25;
        const angleX = (bookCenterY - mouseY) / 25;
        
        this.style.transform = `translateZ(20px) translateY(-20px) rotateY(${angleY}deg) rotateX(${angleX}deg)`;
      });
      
      book.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }
  
  initPortfolioSection();
  initializeSkillCards();
  initProjectsSection();
  initTestamentsSection(); 
});