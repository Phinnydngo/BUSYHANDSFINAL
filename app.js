// Centralized function to initialize components on every page load/transition
function initPage() {
  // 1. Initialize AOS Animations
  AOS.init({ duration: 800, once: true, offset: 50 });

  // 2. Sticky Header Logic
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    });
  }

  // 3. Mobile Menu Toggle Logic (Handles both index.html and other pages)
  const menuToggle = document.getElementById('menu-toggle') || document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle && mobileMenu) {
    // Clone and replace to prevent duplicate event listeners during Barba transitions
    const newToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newToggle, menuToggle);
    
    newToggle.addEventListener('click', () => {
      // Logic for about, projects, contact pages
      if (mobileMenu.classList.contains('mobile-menu')) {
        mobileMenu.classList.toggle('open');
      } 
      // Logic for index.html
      else {
        if (mobileMenu.classList.contains('scale-y-0')) {
          mobileMenu.classList.remove('scale-y-0');
        } else {
          mobileMenu.classList.add('scale-y-0');
        }
      }
    });

    // Close menu when clicking a link (specifically for index.html)
    const navLinks = mobileMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('mobile-menu')) {
          mobileMenu.classList.add('scale-y-0');
        } else {
          mobileMenu.classList.remove('open');
        }
      });
    });
  }
}

// Run once on initial site load
document.addEventListener("DOMContentLoaded", () => {
  initPage();
});

// Barba.js Initialization for Seamless Transitions
barba.init({
  transitions: [{
    name: 'wipe-transition',
    
    // 1. The Leave Animation (Triggered when you click a link)
    leave(data) {
      const done = this.async();
      // Slide the wipe up from the bottom to cover the screen
      gsap.to('.transition-wipe', {
        top: '0%',
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: done
      });
    },
    
    // 2. The Enter Animation (Triggered when the new page is ready)
    enter(data) {
      // Scroll to top instantly before revealing new content
      window.scrollTo(0, 0); 
      
      // Re-initialize AOS, menus, and header for the new page
      initPage();

      // Fade in the new content slightly
      gsap.from(data.next.container, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.2
      });

      // Slide the wipe up and away to reveal the new page
      gsap.to('.transition-wipe', {
        top: '-100%',
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: () => {
          // Reset the wipe back to the bottom for the next click
          gsap.set('.transition-wipe', { top: '100%' });
        }
      });
    }
  }]
});
