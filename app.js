/**
 * CG Chronicle News Portal JavaScript
 * Interactive components: Navigation, Ticker, Social Shares, and Comments Section
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDateDisplay();
  initShareButtons();
  initCommentsSection();
});

/**
 * 1. Mobile Menu Toggle
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      toggleBtn.innerHTML = isExpanded ? '&#10005;' : '&#9776;'; // X or hamburger
    });
  }
}

/**
 * 2. Current Date Display
 */
function initDateDisplay() {
  const dateElement = document.querySelector('.header-date');
  if (dateElement) {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('hi-IN', options) + ' | ' + today.toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}

/**
 * 3. Mock Share Buttons and Toast Feedback
 */
function initShareButtons() {
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let platform = 'Social';
      if (btn.classList.contains('fb')) platform = 'Facebook';
      else if (btn.classList.contains('tw')) platform = 'Twitter';
      else if (btn.classList.contains('wa')) platform = 'WhatsApp';
      else if (btn.classList.contains('copy')) {
        // Copy current page URL
        navigator.clipboard.writeText(window.location.href)
          .then(() => showToast('लेख की लिंक कॉपी कर ली गई है! (Link copied!)'))
          .catch(() => showToast('लिंक कॉपी करने में त्रुटि हुई!'));
        return;
      }
      
      showToast(`${platform} पर शेयर करने का नाटक सफल रहा! (Mock shared to ${platform})`);
    });
  });
}

/**
 * Toast notification helper
 */
function showToast(message) {
  // Remove existing toast if any
  const existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();

  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<span>📢</span> <span>${message}</span>`;
  document.body.appendChild(toast);

  // Trigger reflow for transition
  setTimeout(() => toast.classList.add('show'), 10);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * 4. Interactive Comments Section
 */
function initCommentsSection() {
  const commentForm = document.getElementById('commentForm');
  const commentsList = document.getElementById('commentsList');
  const commentCount = document.getElementById('commentCount');
  
  if (!commentForm || !commentsList) return;

  // Mock initial comments if none exist in localStorage
  const storageKey = 'cg_chronicle_comments';
  let comments = JSON.parse(localStorage.getItem(storageKey));

  if (!comments) {
    comments = [
      {
        id: 1,
        author: 'रामेश यादव',
        time: '2 घंटे पहले',
        text: 'क्या कमाल की लीपापोती है! NGT कागजों पर नदी बचा रहा है और यहाँ सीधे राख से ही पाट रहे हैं। प्रशासन सो रहा है।'
      },
      {
        id: 2,
        author: 'अंजली गुप्ता',
        time: '5 घंटे पहले',
        text: 'सतर्क पत्रकारिता! यह फ्लाई ऐश केलो नदी के पानी को पूरी तरह दूषित कर रहा है, सरकार को तत्काल ठोस कदम उठाने चाहिए।'
      }
    ];
    localStorage.setItem(storageKey, JSON.stringify(comments));
  }

  // Render comments
  renderComments();

  // Handle form submission
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const authorInput = document.getElementById('commentAuthor');
    const textInput = document.getElementById('commentText');

    if (!authorInput.value.trim() || !textInput.value.trim()) {
      showToast('कृपया सभी फ़ील्ड भरें! (Please fill all fields)');
      return;
    }

    const newComment = {
      id: Date.now(),
      author: authorInput.value.trim(),
      time: 'अभी-अभी (Just now)',
      text: textInput.value.trim()
    };

    comments.unshift(newComment);
    localStorage.setItem(storageKey, JSON.stringify(comments));
    
    // Animate comments render
    renderComments();
    
    // Clear fields
    authorInput.value = '';
    textInput.value = '';

    showToast('टिप्पणी सफलतापूर्वक जोड़ी गई! (Comment added!)');
  });

  function renderComments() {
    commentsList.innerHTML = '';
    comments.forEach(comment => {
      const li = document.createElement('li');
      li.className = 'comment-item';
      li.innerHTML = `
        <div class="comment-avatar">${comment.author.charAt(0)}</div>
        <div class="comment-content">
          <div class="comment-meta">
            <span class="comment-author-name">${comment.author}</span>
            <span class="comment-time">${comment.time}</span>
          </div>
          <p class="comment-text">${comment.text}</p>
        </div>
      `;
      commentsList.appendChild(li);
    });

    if (commentCount) {
      commentCount.textContent = `टिप्पणियाँ (${comments.length})`;
    }
  }
}
