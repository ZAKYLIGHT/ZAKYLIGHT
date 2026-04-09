/* ============================================================
   monoffices.com — front-end interactions
   - mobile nav
   - modals (quote / contact / service / privacy / terms)
   - basic form validation + toast feedback
   - sticky-header shadow
   - scroll-to-top button
   - smooth anchor scroll with offset
   ============================================================ */

(function () {
	'use strict';

	const $  = (sel, ctx) => (ctx || document).querySelector(sel);
	const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

	/* -------- year in footer -------- */
	const yearEl = $('#year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	/* -------- mobile nav -------- */
	const nav = $('#siteNav');
	const openNavBtn = $('[data-nav-open]');
	const closeNavBtn = $('[data-nav-close]');

	function openNav() { nav.classList.add('is-open'); }
	function closeNav() { nav.classList.remove('is-open'); }

	if (openNavBtn) openNavBtn.addEventListener('click', openNav);
	if (closeNavBtn) closeNavBtn.addEventListener('click', closeNav);
	$$('#siteNav a').forEach(link => link.addEventListener('click', closeNav));

	/* -------- sticky header shadow -------- */
	const header = $('#siteHeader');
	const onScroll = () => {
		if (window.scrollY > 8) header.classList.add('is-scrolled');
		else header.classList.remove('is-scrolled');

		const scrollTop = $('#scrollTop');
		if (window.scrollY > 480) scrollTop.hidden = false;
		else scrollTop.hidden = true;
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	/* -------- scroll to top -------- */
	const scrollTopBtn = $('#scrollTop');
	scrollTopBtn.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	/* -------- modal system -------- */
	let lastFocus = null;

	function openModal(name, trigger) {
		const modal = $('#modal-' + name);
		if (!modal) return;

		// service modal: hydrate title/body from the trigger button
		if (name === 'service' && trigger) {
			const title = trigger.getAttribute('data-service-title');
			const body  = trigger.getAttribute('data-service-body');
			if (title) $('#modal-service-title').textContent = title;
			if (body)  $('#modal-service-body').textContent = body;
		}

		lastFocus = document.activeElement;
		modal.hidden = false;
		document.body.classList.add('modal-open');

		// focus first focusable element inside the dialog
		const focusable = modal.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		if (focusable.length) focusable[0].focus();
	}

	function closeModal(modal) {
		modal.hidden = true;
		document.body.classList.remove('modal-open');
		if (lastFocus) lastFocus.focus();
	}

	function closeAllModals() {
		$$('.modal').forEach(m => { if (!m.hidden) closeModal(m); });
	}

	// open triggers
	$$('[data-open-modal]').forEach(btn => {
		btn.addEventListener('click', e => {
			e.preventDefault();
			// if a modal is already open (e.g. service → quote), close it first
			closeAllModals();
			openModal(btn.getAttribute('data-open-modal'), btn);
		});
	});

	// close triggers (overlay + close buttons)
	$$('[data-modal-close]').forEach(el => {
		el.addEventListener('click', () => {
			const modal = el.closest('.modal');
			if (modal) closeModal(modal);
		});
	});

	// ESC to close
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') closeAllModals();
	});

	/* -------- forms (validation + toast) -------- */
	const toast = $('#toast');
	const toastMessage = $('#toast-message');
	let toastTimer;
	function showToast(msg) {
		toastMessage.textContent = msg;
		toast.hidden = false;
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
	}

	function validateForm(form) {
		let valid = true;
		$$('[required]', form).forEach(field => {
			const value = (field.value || '').trim();
			let ok = !!value;
			if (ok && field.type === 'email') {
				ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
			}
			field.classList.toggle('is-invalid', !ok);
			if (!ok) valid = false;
		});
		return valid;
	}

	function handleFormSubmit(form, successMsg) {
		form.addEventListener('submit', e => {
			e.preventDefault();
			if (!validateForm(form)) {
				showToast('Veuillez remplir les champs obligatoires.');
				return;
			}
			// In a real build, POST the FormData to your endpoint here.
			// const data = new FormData(form);
			// fetch('/api/lead', { method: 'POST', body: data });
			form.reset();
			showToast(successMsg);

			// if the form lives inside a modal, close it
			const modal = form.closest('.modal');
			if (modal) closeModal(modal);
		});
	}

	const contactForm = $('#contactForm');
	if (contactForm) handleFormSubmit(contactForm, 'Message envoyé. Merci !');

	$$('[data-modal-form]').forEach(form => {
		handleFormSubmit(form, 'Demande envoyée. Nous revenons vers vous rapidement.');
	});

	/* -------- smooth anchor scroll with header offset -------- */
	const headerHeight = () => header.offsetHeight || 80;
	$$('a[href^="#"]').forEach(link => {
		const targetId = link.getAttribute('href');
		if (targetId.length < 2) return;
		link.addEventListener('click', e => {
			const target = document.querySelector(targetId);
			if (!target) return;
			e.preventDefault();
			const top = target.getBoundingClientRect().top + window.scrollY - headerHeight() - 12;
			window.scrollTo({ top, behavior: 'smooth' });
		});
	});

})();
