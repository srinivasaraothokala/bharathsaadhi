document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     1. MODAL OPEN / CLOSE
  ========================================= */
  const modal = document.getElementById('matchModal');
  const openBtns = [
    document.getElementById('openFind'),
    document.getElementById('heroFind')
  ];
  const closeBtn = document.getElementById('modalClose');
  const backdrop = document.getElementById('modalBackdrop');

  function openModal() {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    resetWizard();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);


  /* =========================================
     2. FAQ ACCORDION
  ========================================= */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });


  /* =========================================
     3. AUTO YEAR
  ========================================= */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();


  /* =========================================
     4. MATCH FORM WIZARD
  ========================================= */
  const matchForm = document.getElementById('matchForm');
  const steps = Array.from(document.querySelectorAll('.step-panel'));
  const progressBar = document.getElementById('progressFill');
  let currentStep = 0;

  function showStep(i) {
    currentStep = Math.max(0, Math.min(i, steps.length - 1));
    steps.forEach((s, idx) => s.classList.toggle('hidden', idx !== currentStep));
    if (progressBar) {
      progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    }
  }

  function resetWizard() {
    currentStep = 0;
    showStep(0);

    ['casteInput', 'specializationWrapper', 'salaryWrapper'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    if (matchForm) matchForm.reset();
  }

  function validateStep(stepIndex) {
    const panel = steps[stepIndex];
    if (!panel) return true;

    let valid = true;
    panel.querySelectorAll('.error-msg').forEach(e => e.remove());

    panel.querySelectorAll('input[required], select[required]').forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#d93025';

        const msg = document.createElement('span');
        msg.className = 'error-msg';
        msg.textContent = 'Required';
        input.after(msg);

        input.addEventListener('input', () => {
          input.style.borderColor = '';
          msg.remove();
        }, { once: true });
      }
    });

    return valid;
  }

  if (matchForm) {
    matchForm.addEventListener('click', e => {
      const action = e.target.dataset.action;
      if (!action) return;

      if (action === 'next' && validateStep(currentStep)) showStep(currentStep + 1);
      if (action === 'prev') showStep(currentStep - 1);
    });

    /* =========================================
       5. SUBMIT MATCH FORM (EMAIL ONLY)
    ========================================= */
    matchForm.addEventListener('submit', async e => {
      e.preventDefault();

      const btn = matchForm.querySelector('.btn-submit');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const payload = Object.fromEntries(new FormData(matchForm));

      try {
        const res = await fetch('/api/send-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.success) {
          alert('✅ Profile submitted successfully');
          closeModal();
          resetWizard();
        } else {
          alert(data.error || 'Submission failed');
        }
      } catch (err) {
        console.error(err);
        alert('❌ Server connection failed');
      } finally {
        btn.textContent = original;
        btn.disabled = false;
      }
    });
  }


  /* =========================================
     6. DYNAMIC FIELDS
  ========================================= */
  const casteSelect = document.getElementById('casteSelect');
  const casteInput = document.getElementById('casteInput');

  if (casteSelect && casteInput) {
    casteSelect.addEventListener('change', () => {
      casteInput.style.display = casteSelect.value === 'Other' ? 'block' : 'none';
      if (casteSelect.value !== 'Other') casteInput.value = '';
    });
  }

  const eduSelect = document.getElementById('educationSelect');
  const specWrapper = document.getElementById('specializationWrapper');

  if (eduSelect && specWrapper) {
    eduSelect.addEventListener('change', () => {
      const list = ['B.Tech / B.E', 'M.Tech / M.E', 'MBA / PGDM', 'MBBS / MD', 'B.Com / M.Com', 'BCA / MCA'];
      specWrapper.style.display = list.includes(eduSelect.value) ? 'block' : 'none';
    });
  }

  const occSelect = document.getElementById('occupationSelect');
  const salaryWrapper = document.getElementById('salaryWrapper');

  if (occSelect && salaryWrapper) {
    occSelect.addEventListener('change', () => {
      salaryWrapper.style.display =
        occSelect.value && occSelect.value !== 'Not Working' ? 'block' : 'none';
    });
  }


  /* =========================================
     7. CONTACT FORM (EMAIL ONLY)
  ========================================= */
  const contactForm = document.getElementById('generalContactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      const btn = contactForm.querySelector('.btn-submit');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const payload = Object.fromEntries(new FormData(contactForm));

      try {
        const res = await fetch('/api/send-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.success) {
          alert('✅ Message sent successfully');
          contactForm.reset();
        } else {
          alert(data.error || 'Failed to send');
        }
      } catch (err) {
        console.error(err);
        alert('❌ Server connection failed');
      } finally {
        btn.textContent = original;
        btn.disabled = false;
      }
    });
  }

});
