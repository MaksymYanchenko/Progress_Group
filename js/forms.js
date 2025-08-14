(function () {
	function formToJSON(form) {
		const formData = new FormData(form);
		const data = {};
		for (const [key, value] of formData.entries()) {
			data[key.trim()] = typeof value === 'string' ? value.trim() : value;
		}
		return data;
	}

	async function submitForm(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const action = form.getAttribute('action') || '/';
		const method = (form.getAttribute('method') || 'post').toUpperCase();
		const body = new URLSearchParams();
		const formData = new FormData(form);
		for (const [key, value] of formData.entries()) {
			body.append(key.trim(), typeof value === 'string' ? value.trim() : value);
		}

		try {
			const response = await fetch(action, {
				method,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: body.toString(),
			});
			const result = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(result.message || 'Request failed');
			alert(result.message || 'Sent successfully');
			form.reset();
		} catch (err) {
			alert(err.message || 'Error sending request');
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		const forms = document.querySelectorAll('form[action="/api/quote"], form[action="/api/feedback"]');
		forms.forEach(function (form) {
			form.addEventListener('submit', submitForm);
		});
	});
})();