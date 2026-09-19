/* ============================================
   Terminal Dev Portfolio — main.js
   Adapted from: VARA4u-tech/Vara-s--Portfolio
   Monochrome neo-brutalist aesthetic.
   All content loaded from data/*.json.
   ============================================ */

(function () {
  'use strict';

  // ─── SVG Icons ──────────────────────────────────
  const ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    fork: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>',
    mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  };

  function icon(name) { return ICONS[name] || ''; }

  // ─── Utility ────────────────────────────────────
  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function $(id) { return document.getElementById(id); }
  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // ─── Sound Engine (Web Audio API) ───────────────
  var audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { /* Audio not supported */ }
    }
    return audioCtx;
  }

  function playSound(type) {
    var ctx = getAudioCtx();
    if (!ctx) return;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'click':
        osc.type = 'square';
        osc.frequency.value = 600;
        gain.gain.value = 0.05;
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
        break;
      case 'hover':
        osc.type = 'sine';
        osc.frequency.value = 1200;
        gain.gain.value = 0.02;
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
        break;
    }
  }

  // Add sound to interactive elements after render
  function attachSounds() {
    document.querySelectorAll('.social-link, .project-link, .footer-link, .btn-primary, .btn-submit, .nav-toggle, .footer-scroll-top').forEach(function (el) {
      el.addEventListener('click', function () { playSound('click'); });
    });
    document.querySelectorAll('.project-card, .tech-tag, .skill-tag, .skill-category-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { playSound('hover'); });
    });
  }

  // ─── Data Loader ────────────────────────────────
  async function loadJSON(file) {
    try {
      var resp = await fetch('data/' + file);
      if (!resp.ok) throw new Error(resp.statusText);
      return await resp.json();
    } catch (e) {
      console.error('[data] Failed to load ' + file, e);
      return null;
    }
  }

  // ─── Matrix Rain (INVERTED: black on white) ─────
  function initMatrixRain() {
    var canvas = $('matrix-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var chars = '01{}[]<>/*#=+-;:.abcdefghijklmnopqrstuvwxyz$@!%^&()_';
    var fontSize = 14;
    var columns = Math.floor(canvas.width / fontSize);
    var drops = new Array(columns).fill(1);

    window.addEventListener('resize', function () {
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(1);
    });

    function draw() {
      // White wash (instead of dark wash) — creates fading trail on white
      ctx.fillStyle = 'rgba(245, 245, 245, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px monospace';

      for (var i = 0; i < drops.length; i++) {
        var c = chars[Math.floor(Math.random() * chars.length)];
        // Lead character in black
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillText(c, i * fontSize, drops[i] * fontSize);

        // Trail character in lighter black
        if (drops[i] > 1) {
          var tc = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
          ctx.fillText(tc, i * fontSize, (drops[i] - 1) * fontSize);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    setInterval(draw, 60);
  }

  // ─── Boot Sequence (disabled — skip straight to content) ─
  async function playBootSequence(lines) {
    var overlay = $('boot-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // ─── Navigation ─────────────────────────────────
  function renderNavbar(navData) {
    if (!navData) return;

    var logo = $('nav-logo');
    var links = $('nav-links');
    var mobile = $('nav-mobile');
    var toggle = $('nav-toggle');

    if (logo) {
      logo.textContent = navData.logo || '~/portfolio';
    }

    if (links) {
      var html = '';
      navData.items.forEach(function (item, i) {
        html += '<li><a href="' + esc(item.href) + '">' + esc(item.label) + '</a></li>';
        if (i < navData.items.length - 1) {
          html += '<li><span class="nav-separator">|</span></li>';
        }
      });
      links.innerHTML = html;
    }

    if (mobile) {
      var mhtml = '';
      navData.items.forEach(function (item) {
        mhtml += '<a href="' + esc(item.href) + '">' + esc(item.label) + '</a>';
      });
      mobile.innerHTML = mhtml;
    }

    if (toggle && mobile) {
      toggle.addEventListener('click', function () {
        mobile.classList.toggle('open');
        toggle.textContent = mobile.classList.contains('open') ? 'Close' : 'Menu';
        playSound('click');
      });
      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobile.classList.remove('open');
          toggle.textContent = 'Menu';
        });
      });
    }
  }

  // ─── Hero Section ───────────────────────────────
  function renderHero(heroData, siteConfig) {
    if (!heroData) return;

    var dateEl = $('hero-date');
    if (dateEl) dateEl.textContent = new Date().toISOString().split('T')[0];

    var lnEl = $('hero-line-numbers');
    if (lnEl) {
      var lns = '';
      for (var i = 1; i <= 6; i++) lns += String(i).padStart(3, '0') + '<br>';
      lnEl.innerHTML = lns;
    }

    var tagEl = $('hero-tagline');
    if (tagEl) tagEl.textContent = heroData.tagline || 'AVAILABLE FOR WORK';

    // Always use large text name (brutalist style), never ASCII art
    var asciiEl = $('ascii-name');
    var nameEl = $('hero-name');
    if (asciiEl) asciiEl.style.display = 'none';

    if (nameEl) {
      var fullName = heroData.name || 'Developer';
      var parts = fullName.split(' ');
      if (parts.length > 1) {
        // First name bold, last name dimmed
        nameEl.innerHTML = esc(parts[0]) + '<br><span class="dim">' + esc(parts.slice(1).join(' ')) + '</span>';
      } else {
        nameEl.textContent = fullName;
      }
      nameEl.setAttribute('data-text', fullName);
      nameEl.style.display = 'block';
    }

    // Tech tags
    var tagsEl = $('tech-tags');
    if (tagsEl && heroData.techTags) {
      tagsEl.innerHTML = heroData.techTags.map(function (tag) {
        return '<span class="tech-tag">' + esc(tag) + '</span>';
      }).join('');
    }

    // Social links
    var socialEl = $('social-links');
    if (socialEl && heroData.socialLinks) {
      socialEl.innerHTML = heroData.socialLinks.map(function (link) {
        return '<a href="' + esc(link.url) + '" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="' + esc(link.label) + '">' +
          icon(link.icon) + '</a>';
      }).join('');
    }

    // Resume CTA
    var ctaWrap = $('hero-cta-wrap');
    if (ctaWrap && heroData.resumeUrl) {
      ctaWrap.innerHTML = '<a href="' + esc(heroData.resumeUrl) + '" class="btn-primary" download>Download Resume <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></a>';
    }

    // Bottom-left
    var blEl = $('hero-bottom-left');
    if (blEl && siteConfig) {
      blEl.textContent = siteConfig.siteTitle || '';
    }

    // Bottom-right stats
    var brEl = $('hero-bottom-right');
    if (brEl && heroData.stats) {
      brEl.innerHTML =
        '<p>const experience = "' + esc(heroData.stats.experience || '0') + '";</p>' +
        '<p>const projects = ' + (heroData.stats.projects || 0) + ';</p>' +
        '<p>const commits = "' + esc(heroData.stats.commits || '0') + '";</p>';
    }

    // Typewriter
    if (heroData.roles && heroData.roles.length > 0) {
      startTypewriter(heroData.roles);
    }
  }

  // ─── Typewriter ─────────────────────────────────
  function startTypewriter(roles) {
    var el = $('typewriter-text');
    if (!el) return;
    var roleIndex = 0, charIndex = 0, isDeleting = false;

    function tick() {
      var currentRole = roles[roleIndex];
      if (!isDeleting) {
        charIndex++;
        el.textContent = currentRole.slice(0, charIndex);
        if (charIndex === currentRole.length) {
          setTimeout(function () { isDeleting = true; tick(); }, 2000);
          return;
        }
        setTimeout(tick, 80);
      } else {
        charIndex--;
        el.textContent = currentRole.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 40);
      }
    }
    tick();
  }

  // ─── About Section ──────────────────────────────
  function renderAbout(aboutData, heroData) {
    if (!aboutData) return;

    var heading = $('about-heading');
    if (heading) heading.textContent = 'About me.';

    // Avatar
    var avatarWrap = $('about-avatar-wrap');
    if (avatarWrap) {
      var name = (heroData && heroData.name) || 'JD';
      var initials = name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
      var avatarImg = aboutData.avatarUrl
        ? '<img src="' + esc(aboutData.avatarUrl) + '" alt="Photo" class="about-avatar-img">'
        : '<span class="about-avatar-initials">' + esc(initials) + '</span>';

      avatarWrap.innerHTML =
        '<div class="about-avatar">' +
          '<div class="about-avatar-shadow"></div>' +
          '<div class="about-avatar-inner">' + avatarImg + '</div>' +
          '<div class="about-available-badge"><span class="status-dot"></span> Available</div>' +
        '</div>';
    }

    var bio = $('about-bio');
    if (bio && aboutData.bio) {
      bio.innerHTML = aboutData.bio.map(function (p) {
        return '<p>' + esc(p) + '</p>';
      }).join('');
    }

    var highlights = $('about-highlights');
    if (highlights && aboutData.highlights) {
      highlights.innerHTML = aboutData.highlights.map(function (h) {
        return '<div class="highlight-item">' +
          '<div class="highlight-value">' + esc(h.value) + '</div>' +
          '<div class="highlight-label">' + esc(h.label) + '</div>' +
          '</div>';
      }).join('');
    }
  }

  // ─── Experience Section ─────────────────────────
  function renderExperience(expData) {
    if (!expData) return;

    var heading = $('experience-heading');
    if (heading) heading.textContent = 'Experience.';

    var list = $('experience-list');
    if (!list) return;

    list.innerHTML = (expData.positions || []).map(function (pos) {
      var statusLabel = pos.endDate === 'Present' || !pos.endDate ? 'Current' : '';

      var achieveHTML = '';
      if (pos.achievements && pos.achievements.length) {
        achieveHTML = '<ul class="exp-achievements">' +
          pos.achievements.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') +
          '</ul>';
      }

      var techHTML = '<div class="exp-technologies">' +
        (pos.technologies || []).map(function (t) {
          return '<span class="exp-tech-badge">' + esc(t) + '</span>';
        }).join('') +
        '</div>';

      return '<div class="experience-card">' +
        '<div class="exp-header">' +
          '<div class="exp-header-left">' +
            '<span class="exp-company">' + esc(pos.company) + '</span>' +
            (statusLabel ? '<span class="exp-status running">' + statusLabel + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="exp-body">' +
          '<div class="exp-title">' + esc(pos.title) + '</div>' +
          '<div class="exp-meta">' +
            '<span>' + esc(pos.startDate) + ' - ' + esc(pos.endDate || 'Present') + '</span>' +
            (pos.location ? '<span>' + esc(pos.location) + '</span>' : '') +
          '</div>' +
          '<div class="exp-description">' + esc(pos.description) + '</div>' +
          achieveHTML +
          techHTML +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ─── Skills Section (Card Grid) ─────────────────
  function renderSkills(skillsData) {
    if (!skillsData) return;

    var heading = $('skills-heading');
    if (heading) heading.textContent = 'Technical Skills.';

    // Render card grid
    var cardGrid = $('skills-card-grid');
    if (cardGrid) {
      cardGrid.innerHTML = (skillsData.categories || []).map(function (cat) {
        return '<div class="skill-category-card">' +
          '<div class="skill-category-name">' + esc(cat.name) + '</div>' +
          '<div class="skill-tags">' +
            (cat.items || []).map(function (s) {
              return '<span class="skill-tag">' + esc(s) + '</span>';
            }).join('') +
          '</div>' +
        '</div>';
      }).join('');
    }

    // GitHub contribution graph (monochrome)
    var contribGrid = $('contribution-grid');
    if (contribGrid) {
      var weeks = 52;
      var html = '';
      for (var w = 0; w < weeks; w++) {
        html += '<div class="contribution-week">';
        for (var d = 0; d < 7; d++) {
          var level = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 5);
          html += '<div class="contribution-cell level-' + level + '"></div>';
        }
        html += '</div>';
      }
      contribGrid.innerHTML = html;
    }
  }

  // ─── Projects Section ───────────────────────────
  function renderProjects(projData) {
    if (!projData) return;

    var heading = $('projects-heading');
    if (heading) heading.textContent = 'Projects.';

    var grid = $('projects-grid');
    if (!grid) return;

    grid.innerHTML = (projData.projects || []).map(function (proj) {
      var langClass = 'lang-dot-' + (proj.language || 'default').toLowerCase().replace(/[^a-z]/g, '');
      var newBadge = proj.isNew ? '<span class="new-badge">Latest Work</span>' : '';

      var techHTML = '<div class="project-technologies">' +
        (proj.technologies || []).map(function (t) {
          return '<span class="project-tech-badge">' + esc(t) + '</span>';
        }).join('') +
        '</div>';

      var metaHTML = '<div class="project-meta">';
      if (proj.stars != null) metaHTML += '<span class="stars">' + icon('star') + ' ' + proj.stars + '</span>';
      if (proj.forks != null) metaHTML += '<span class="forks">' + icon('fork') + ' ' + proj.forks + '</span>';
      if (proj.language) metaHTML += '<span>' + esc(proj.language) + '</span>';
      metaHTML += '</div>';

      var linksHTML = '<div class="project-links">';
      if (proj.githubUrl) linksHTML += '<a href="' + esc(proj.githubUrl) + '" target="_blank" rel="noopener noreferrer" class="project-link">' + icon('github') + ' Source</a>';
      if (proj.liveUrl) linksHTML += '<a href="' + esc(proj.liveUrl) + '" target="_blank" rel="noopener noreferrer" class="project-link">' + icon('external') + ' Live Demo</a>';
      linksHTML += '</div>';

      return '<div class="project-card">' +
        newBadge +
        '<div class="project-name"><span class="lang-dot ' + langClass + '"></span>' + esc(proj.name) + '</div>' +
        '<div class="project-description">' + esc(proj.description) + '</div>' +
        metaHTML + techHTML + linksHTML +
      '</div>';
    }).join('');
  }

  // ─── Education Section ──────────────────────────
  function renderEducation(eduData) {
    if (!eduData) return;

    var heading = $('education-heading');
    if (heading) heading.textContent = 'Education.';

    var list = $('education-list');
    if (!list) return;

    var html = (eduData.entries || []).map(function (entry) {
      var honorsHTML = '';
      if (entry.honors && entry.honors.length) {
        honorsHTML = '<div class="edu-honors">' +
          entry.honors.map(function (h) { return '<span class="edu-honor">' + esc(h) + '</span>'; }).join('') +
          '</div>';
      }

      return '<div class="education-card">' +
        '<div class="edu-degree">' + esc(entry.degree) + '</div>' +
        (entry.field ? '<div class="edu-field">' + esc(entry.field) + '</div>' : '') +
        '<div class="edu-meta">' +
          '<span class="edu-institution">' + esc(entry.institution) + '</span>' +
          '<span class="edu-date">' + esc(entry.startDate || '') + (entry.endDate ? ' - ' + esc(entry.endDate) : '') + '</span>' +
          (entry.gpa ? '<span class="edu-gpa">GPA: ' + esc(entry.gpa) + '</span>' : '') +
        '</div>' +
        honorsHTML +
      '</div>';
    }).join('');

    if (eduData.certifications && eduData.certifications.length) {
      html += '<div class="certifications-section">' +
        '<div class="cert-heading">// certifications</div>' +
        '<ul class="cert-list">' +
        eduData.certifications.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') +
        '</ul></div>';
    }

    list.innerHTML = html;
  }

  // ─── Contact Section ────────────────────────────
  function renderContact(contactData) {
    if (!contactData) return;

    var heading = $('contact-heading');
    if (heading) heading.textContent = 'Get in Touch.';

    var info = $('contact-info');
    if (!info) return;

    var html = '<p class="contact-intro">' + esc(contactData.subheading || '') + '</p>';
    html += '<div class="contact-details">';

    if (contactData.email) {
      html += '<div class="contact-detail-item"><div class="contact-icon">' + icon('email') + '</div>' +
        '<div><div class="contact-detail-label">Email</div>' +
        '<div class="contact-detail-value"><a href="mailto:' + esc(contactData.email) + '">' + esc(contactData.email) + '</a></div></div></div>';
    }
    if (contactData.phone) {
      html += '<div class="contact-detail-item"><div class="contact-icon">' + icon('phone') + '</div>' +
        '<div><div class="contact-detail-label">Phone</div>' +
        '<div class="contact-detail-value">' + esc(contactData.phone) + '</div></div></div>';
    }
    if (contactData.location) {
      html += '<div class="contact-detail-item"><div class="contact-icon">' + icon('mapPin') + '</div>' +
        '<div><div class="contact-detail-label">Location</div>' +
        '<div class="contact-detail-value">' + esc(contactData.location) + '</div></div></div>';
    }

    html += '</div>';

    if (contactData.availability) {
      html += '<div class="contact-availability"><span class="status-dot"></span> ' + esc(contactData.availability) + '</div>';
    }

    if (contactData.socialLinks) {
      html += '<div class="social-links" style="justify-content:flex-start">';
      Object.keys(contactData.socialLinks).forEach(function (key) {
        var url = contactData.socialLinks[key];
        if (url) html += '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="' + esc(key) + '">' + icon(key) + '</a>';
      });
      html += '</div>';
    }

    info.innerHTML = html;

    // Form handler
    var form = $('contact-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        playSound('click');
        var name = $('form-name').value;
        var email = $('form-email').value;
        var message = $('form-message').value;

        if (contactData.formAction) {
          fetch(contactData.formAction, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, message: message }),
          }).then(function () { alert('Message sent!'); form.reset(); })
            .catch(function () { alert('Failed to send. Please email directly.'); });
        } else if (contactData.email) {
          var subject = 'Portfolio Contact from ' + name;
          var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
          window.location.href = 'mailto:' + contactData.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        } else {
          alert('Message sent!');
          form.reset();
        }
      });
    }
  }

  // ─── Footer (with Marquee) ──────────────────────
  function renderFooter(footerData, heroData) {
    if (!footerData) return;

    var brand = $('footer-brand');
    if (brand) brand.textContent = footerData.copyright || '';

    var tagline = $('footer-tagline');
    if (tagline) tagline.textContent = footerData.tagline || 'Built with vanilla HTML/CSS/JS. No frameworks harmed.';

    var links = $('footer-links');
    if (links) {
      links.innerHTML = (footerData.links || []).map(function (link) {
        return '<a href="' + esc(link.url) + '" target="_blank" rel="noopener noreferrer" class="footer-link" aria-label="' + esc(link.label) + '">' +
          icon(link.icon) + '</a>';
      }).join('');
    }

    var copyright = $('footer-copyright');
    if (copyright) {
      var year = footerData.year || new Date().getFullYear().toString();
      var name = footerData.copyright || '';
      copyright.innerHTML = '&copy; ' + esc(year) + ' ' + esc(name) +
        ' &nbsp;&middot;&nbsp; Designed & Engineered with <span class="footer-heart">&#9829;</span> by ' + esc(name.split(' ')[0] || 'Developer');
    }

    // Marquee
    var marquee = $('footer-marquee-text');
    if (marquee) {
      var heroName = (heroData && heroData.name) || 'Developer';
      var roles = (heroData && heroData.roles) ? heroData.roles.join(' | ') : 'Software Engineer';
      var text = heroName + ' &nbsp;&bull;&nbsp; ' + roles + ' &nbsp;&bull;&nbsp; Designing clean UI/UX &nbsp;&bull;&nbsp; Open to opportunities &nbsp;&bull;&nbsp; ';
      marquee.innerHTML = text + text; // Duplicate for seamless scroll
    }

    var scrollTop = $('scroll-top-btn');
    if (scrollTop) {
      scrollTop.addEventListener('click', function () {
        playSound('click');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ─── Terminal Modal ─────────────────────────────
  function initTerminal(siteConfig, aboutData, skillsData, projData, contactData) {
    var overlay = $('terminal-overlay');
    var fab = $('terminal-fab');
    var termBody = $('terminal-body');
    var termForm = $('terminal-form');
    var termInput = $('terminal-input');
    var closeDot = $('terminal-close-dot');
    var closeBtn = $('terminal-close-btn');
    var termHost = $('terminal-host');
    var termPrompt = $('terminal-prompt');

    if (!overlay || !fab || !termBody || !termInput) return;

    var prompt = (siteConfig && siteConfig.prompt) || 'visitor@portfolio:~$';
    if (termPrompt) termPrompt.textContent = prompt;
    if (termHost) termHost.textContent = prompt.replace('$', '').trim();

    var commands = {
      help: function () {
        return '<div style="display:grid;grid-template-columns:100px 1fr;gap:0.3rem">' +
          '<span style="color:#28c840">about</span><span>Learn about me</span>' +
          '<span style="color:#28c840">skills</span><span>View technical skills</span>' +
          '<span style="color:#28c840">projects</span><span>List projects</span>' +
          '<span style="color:#28c840">contact</span><span>How to reach me</span>' +
          '<span style="color:#28c840">clear</span><span>Clear the terminal</span>' +
          '<span style="color:#28c840">exit</span><span>Close terminal</span></div>';
      },
      about: function () { return aboutData && aboutData.bio ? aboutData.bio.map(esc).join('<br><br>') : 'No about data.'; },
      skills: function () {
        if (!skillsData || !skillsData.categories) return 'No skills data.';
        return skillsData.categories.map(function (cat) {
          return '<span style="color:#58a6ff">' + esc(cat.name) + '</span>  ' + cat.items.map(esc).join(', ');
        }).join('<br>');
      },
      projects: function () {
        if (!projData || !projData.projects) return 'No projects data.';
        return projData.projects.map(function (p, i) {
          var url = p.githubUrl || '#projects';
          return '<a href="' + esc(url) + '" target="_blank" class="cmd-link">' + (i + 1) + '. ' + esc(p.name) + '</a>';
        }).join('<br>');
      },
      contact: function () {
        if (!contactData) return 'No contact data.';
        var lines = '';
        if (contactData.email) lines += 'Email: <a href="mailto:' + esc(contactData.email) + '" class="cmd-link">' + esc(contactData.email) + '</a><br>';
        if (contactData.socialLinks) {
          if (contactData.socialLinks.github) lines += 'GitHub: <a href="' + esc(contactData.socialLinks.github) + '" target="_blank" class="cmd-link">' + esc(contactData.socialLinks.github) + '</a><br>';
          if (contactData.socialLinks.linkedin) lines += 'LinkedIn: <a href="' + esc(contactData.socialLinks.linkedin) + '" target="_blank" class="cmd-link">' + esc(contactData.socialLinks.linkedin) + '</a>';
        }
        return lines || 'No contact info.';
      },
    };

    function processCommand(cmd) {
      var trimmed = cmd.trim().toLowerCase();
      if (commands[trimmed]) return { type: 'response', html: commands[trimmed]() };
      if (trimmed.match(/^(hi|hello|hey)/)) return { type: 'response', html: 'Hello! Type <span style="color:#28c840">help</span> for commands.' };
      if (trimmed.match(/(who|about|author)/)) return { type: 'response', html: commands.about() };
      if (trimmed.match(/(skill|stack|tech)/)) return { type: 'response', html: commands.skills() };
      if (trimmed.match(/(project|work|app)/)) return { type: 'response', html: commands.projects() };
      if (trimmed.match(/(contact|email|reach|hire)/)) return { type: 'response', html: commands.contact() };
      return { type: 'error', html: 'Command not found. Type <span style="color:#28c840">help</span> for commands.' };
    }

    function appendToTerminal(type, html) {
      var div = document.createElement('div');
      div.className = type === 'command' ? 'cmd-line' : (type === 'error' ? 'cmd-error' : 'cmd-response');
      div.innerHTML = html;
      termBody.appendChild(div);
      termBody.scrollTop = termBody.scrollHeight;
    }

    function openTerminal() {
      overlay.classList.add('open');
      termInput.focus();
      playSound('click');
    }

    function closeTerminal() {
      overlay.classList.remove('open');
      playSound('click');
    }

    if (termForm) {
      termForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = termInput.value.trim();
        if (!val) return;
        termInput.value = '';
        if (val.toLowerCase() === 'clear') { termBody.innerHTML = '<div class="cmd-response"><p>Terminal cleared.</p></div>'; return; }
        if (val.toLowerCase() === 'exit') { closeTerminal(); return; }
        appendToTerminal('command', '<span class="cmd-prompt">' + esc(prompt) + '</span> ' + esc(val));
        var result = processCommand(val);
        appendToTerminal(result.type, result.html);
      });
    }

    fab.addEventListener('click', openTerminal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeTerminal(); });
    if (closeDot) closeDot.addEventListener('click', closeTerminal);
    if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
    termBody.addEventListener('click', function () { termInput.focus(); });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); overlay.classList.contains('open') ? closeTerminal() : openTerminal(); }
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeTerminal();
    });
  }

  // ─── Scroll Reveal ──────────────────────────────
  function initScrollReveal() {
    var sections = document.querySelectorAll('.section');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // ─── Active Nav ─────────────────────────────────
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    function update() {
      var scrollY = window.scrollY + 200;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) link.classList.add('active');
          });
        }
      });
    }

    window.addEventListener('scroll', update);
    update();
  }

  // ─── Main Init ──────────────────────────────────
  async function init() {
    var [siteConfig, navData, heroData, aboutData, expData, skillsData, projData, eduData, contactData, footerData] =
      await Promise.all([
        loadJSON('site-config.json'),
        loadJSON('navigation.json'),
        loadJSON('hero.json'),
        loadJSON('about.json'),
        loadJSON('experience.json'),
        loadJSON('skills.json'),
        loadJSON('projects.json'),
        loadJSON('education.json'),
        loadJSON('contact.json'),
        loadJSON('footer.json'),
      ]);

    if (siteConfig && siteConfig.siteName) document.title = siteConfig.siteName;

    // Matrix rain (inverted)
    if (!siteConfig || siteConfig.matrixRain !== false) initMatrixRain();

    // Boot sequence — disabled
    var bootEl = $('boot-overlay');
    if (bootEl) bootEl.style.display = 'none';

    // Render
    renderNavbar(navData);
    renderHero(heroData, siteConfig);
    renderAbout(aboutData, heroData);
    renderExperience(expData);
    renderSkills(skillsData);
    renderProjects(projData);
    renderEducation(eduData);
    renderContact(contactData);
    renderFooter(footerData, heroData);

    // Terminal
    initTerminal(siteConfig, aboutData, skillsData, projData, contactData);

    // Scroll reveal + active nav
    initScrollReveal();
    setTimeout(initActiveNav, 100);

    // Sound effects
    setTimeout(attachSounds, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
