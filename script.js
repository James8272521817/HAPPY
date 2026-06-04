document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    slides.forEach(slide => {
        observer.observe(slide);
    });
});
