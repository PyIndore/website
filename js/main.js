// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
  navMenu.classList.toggle('active');

  // Animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (navMenu.classList.contains('active')) {
    spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // Height of fixed navbar
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      navMenu?.classList.remove('active');
    }
  });
});

// Animated number counter
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
};

const animateNumbers = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number[data-target]');

      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
      });

      observer.unobserve(entry.target);
    }
  });
};

const numberObserver = new IntersectionObserver(animateNumbers, observerOptions);
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  numberObserver.observe(heroStats);
}

// Removed email subscription form functions as we're using Google Groups now

// Partner form modal
function showPartnerForm(type) {
  const modal = document.getElementById('partner-modal');
  const partnershipType = document.getElementById('partnership-type');

  if (modal && partnershipType) {
    modal.classList.remove('hidden');
    partnershipType.value = type;
  }
}

function hidePartnerForm() {
  const modal = document.getElementById('partner-modal');
  modal?.classList.add('hidden');
}

// Handle partner form submission
const partnerForm = document.getElementById('partner-form');
partnerForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    companyName: document.getElementById('company-name').value,
    contactName: document.getElementById('contact-name').value,
    contactEmail: document.getElementById('contact-email').value,
    contactPhone: document.getElementById('contact-phone').value,
    partnershipType: document.getElementById('partnership-type').value,
    message: document.getElementById('message').value
  };

  // In production, this would send to a backend API
  console.log('Partnership request:', formData);

  // Show success message
  alert('Thank you for your interest in partnering with PyIndore! We\'ll get back to you soon.');

  // Reset form and hide modal
  partnerForm.reset();
  hidePartnerForm();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const partnerModal = document.getElementById('partner-modal');
  if (e.target === partnerModal) {
    hidePartnerForm();
  }
});

// Active navigation highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNav = () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', highlightNav);

// Fade in animation on scroll
const fadeInElements = document.querySelectorAll('.feature, .join-card, .benefit, .tier, .resource-card, .upcoming');

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s forwards';
      fadeInObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

fadeInElements.forEach(element => {
  element.style.opacity = '0';
  fadeInObserver.observe(element);
});

// Add active class to navigation
const style = document.createElement('style');
style.textContent = `
  .nav-link.active {
    color: var(--primary-color);
    position: relative;
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--primary-color);
  }
`;
document.head.appendChild(style);

// Initialize tooltips for social links
const socialLinks = document.querySelectorAll('.social-links a');
socialLinks.forEach(link => {
  link.addEventListener('mouseenter', (e) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('aria-label');
    tooltip.style.cssText = `
      position: absolute;
      background: var(--text-dark);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 0.8rem;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      pointer-events: none;
      margin-bottom: 5px;
    `;
    e.target.style.position = 'relative';
    e.target.appendChild(tooltip);
  });

  link.addEventListener('mouseleave', (e) => {
    const tooltip = e.target.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  });
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// Job Board Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const jobCards = document.querySelectorAll('.job-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Filter jobs
    const filter = button.getAttribute('data-filter');
    jobCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-type') === filter) {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.5s';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Apply for Job
function applyForJob(jobId) {
  // In production, this would integrate with a job application service
  alert(`Application for ${jobId} submitted! We'll review your application and get back to you soon.`);

  // Example of sending to a backend service like Formspree or Netlify Forms
  // fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ jobId, timestamp: new Date().toISOString() })
  // });
}

// Show Job Post Form
function showJobPostForm() {
  alert('Job posting form coming soon! Contact hello@pyindore.org to post a job.');
}

// Load More Jobs
function loadMoreJobs() {
  // In production, this would fetch more jobs from a backend
  const jobListings = document.getElementById('job-listings');
  const newJob = document.createElement('div');
  newJob.className = 'job-card';
  newJob.setAttribute('data-type', 'fulltime');
  newJob.innerHTML = `
    <div class="job-header">
      <h3>Python Data Scientist</h3>
      <span class="job-type fulltime">Full Time</span>
    </div>
    <div class="job-company">
      <span class="company-name">DataTech Indore</span>
      <span class="job-location">📍 Indore, MP</span>
    </div>
    <div class="job-details">
      <p>Work with big data and machine learning models...</p>
      <div class="job-tags">
        <span class="tag">Python</span>
        <span class="tag">ML</span>
        <span class="tag">TensorFlow</span>
      </div>
    </div>
    <div class="job-footer">
      <span class="job-date">Posted just now</span>
      <button class="btn btn-small" onclick="applyForJob('data-scientist')">Apply Now</button>
    </div>
  `;
  jobListings.appendChild(newJob);
  newJob.style.animation = 'fadeInUp 0.5s';
}

// Resume Upload Functionality
const fileUploadArea = document.getElementById('file-upload-area');
const resumeFileInput = document.getElementById('resume-file');
const filePreview = document.getElementById('file-preview');

if (fileUploadArea) {
  fileUploadArea.addEventListener('click', () => {
    resumeFileInput.click();
  });

  // Drag and drop
  fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = 'var(--primary-color)';
    fileUploadArea.style.background = 'var(--bg-light)';
  });

  fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.style.borderColor = 'var(--border-color)';
    fileUploadArea.style.background = 'transparent';
  });

  fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = 'var(--border-color)';
    fileUploadArea.style.background = 'transparent';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  });

  resumeFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });
}

function handleFileSelect(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (!allowedTypes.includes(file.type)) {
    alert('Please upload a PDF or Word document.');
    return;
  }

  if (file.size > maxSize) {
    alert('File size must be less than 5MB.');
    return;
  }

  // Show file preview
  const uploadPrompt = fileUploadArea.querySelector('.upload-prompt');
  const filePreview = document.getElementById('file-preview');
  const fileName = filePreview.querySelector('.file-name');

  uploadPrompt.classList.add('hidden');
  filePreview.classList.remove('hidden');
  fileName.textContent = file.name;
}

function removeFile() {
  const uploadPrompt = fileUploadArea.querySelector('.upload-prompt');
  const filePreview = document.getElementById('file-preview');
  const resumeFileInput = document.getElementById('resume-file');

  uploadPrompt.classList.remove('hidden');
  filePreview.classList.add('hidden');
  resumeFileInput.value = '';
}

// Handle Resume Form Submission
const resumeForm = document.getElementById('resume-form');
if (resumeForm) {
  resumeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('candidate-name').value);
    formData.append('email', document.getElementById('candidate-email').value);
    formData.append('phone', document.getElementById('candidate-phone').value);
    formData.append('experience', document.getElementById('experience-level').value);
    formData.append('skills', document.getElementById('skills').value);
    formData.append('linkedin', document.getElementById('linkedin').value);
    formData.append('github', document.getElementById('github').value);
    formData.append('resume', resumeFileInput.files[0]);

    // Example integration with backend services:

    // Option 1: Formspree (form backend service)
    // fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   body: formData,
    //   headers: { 'Accept': 'application/json' }
    // });

    // Option 2: Netlify Forms (if hosted on Netlify)
    // Add data-netlify="true" to form tag

    // Option 3: Google Forms integration
    // Convert to Google Forms submission format

    // Option 4: Supabase/Firebase Storage
    // Upload file to cloud storage and save metadata

    // For demo purposes
    alert('Resume uploaded successfully! You will receive a confirmation email shortly.');
    resumeForm.reset();
    removeFile();
  });
}

// Add responsive classes for mobile
if (window.innerWidth <= 768) {
  const resumeContent = document.querySelector('.resume-content');
  if (resumeContent) {
    resumeContent.style.gridTemplateColumns = '1fr';
  }

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    statsGrid.style.gridTemplateColumns = '1fr';
  }
}

// Console easter egg
console.log('%c🐍 Welcome to PyIndore! 🐍', 'font-size: 20px; color: #3776AB; font-weight: bold;');
console.log('%cInterested in contributing? Check out https://github.com/pyindore', 'color: #4B8BBE;');
console.log('%c📢 We are hiring! Check out our job board.', 'color: #28A745; font-weight: bold;');