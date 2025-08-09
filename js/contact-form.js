document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }

            const formData = {
                name: name,
                email: email,
                company: document.getElementById('company').value.trim(),
                message: message
            };

            console.log('Form data submitted:');
            console.log(formData);

            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});
