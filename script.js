document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeModal = document.querySelector(".close-modal");
    const prevBtn = document.querySelector(".prev-modal");
    const nextBtn = document.querySelector(".next-modal");
    const carouselTrack = document.querySelector(".carousel-track");
    const allImages = Array.from(document.querySelectorAll(".slide img"));
    const form = document.getElementById("contact-form");
    const inputName = document.getElementById("name");
    const inputEmail = document.getElementById("email");
    const inputMessage = document.getElementById("message");
    const messageError = document.getElementById("error");
    const regexEmail = /^[a-zA-Z0-9._+%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const btnSubmit = form.querySelector('button[type="submit"]');

    let currentIndex = 0; //guarda qué imagen estamos viendo
    let isModalOpen = false;

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    //cerrar menu hamburguesa
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    //animaciones de ka clase 'hidden'
    const hiddenElements = document.querySelectorAll('.hidden');

    const observerOptions = {
        root: null, //usa el viewport
        threshold: 0.15, //se dispara cuando el 15% del elemento es visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    hiddenElements.forEach(el => observer.observe(el));

    const updateModalImage = () => {
        // Lógica de bucle infinito en el modal
        if (currentIndex < 0) {
            currentIndex = allImages.length - 1; // Si retrocede en la primera, va a la última
        } else if (currentIndex >= allImages.length) {
            currentIndex = 0; // Si avanza en la última, vuelve a la primera
        }
        modalImg.src = allImages[currentIndex].src;
    };

    allImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            currentIndex = index; // Guardamos el índice de la foto clickeada
            updateModalImage();
            modal.classList.add("show-modal");
            isModalOpen = true;
            carouselTrack.style.animationPlayState = 'paused';
        });
    });

    //cerrar modal
    const closeImageModal = () => {
        modal.classList.remove("show-modal");
        isModalOpen = false;
        setTimeout(() => {
            carouselTrack.style.animationPlayState = '';
        }, 300);
    };

    closeModal.addEventListener("click", closeImageModal);

    modal.addEventListener("click", (e) => {
        //cierra solo si el clic fue en el fondo
        if (e.target === modal) {
            closeImageModal();
        }
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex--;
        updateModalImage();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex++;
        updateModalImage();
    });

    //navegacion teclado
    document.addEventListener('keydown', (e) => {
        if (!isModalOpen) return;

        if (e.key === 'Escape') closeImageModal();
        if (e.key === 'ArrowLeft') {
            currentIndex--;
            updateModalImage();
        }
        if (e.key === 'ArrowRight') {
            currentIndex++;
            updateModalImage();
        }
    });

    //navegacion gestos celulares
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            currentIndex++;
            updateModalImage();
        } 
        
        if (touchEndX - touchStartX > swipeThreshold) {
            currentIndex--;
            updateModalImage();
        }
    };

    //FORMULARIO

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        //validar inputs
        if(inputName.value.trim() === "" || inputEmail.value.trim() === "" || inputMessage.value.trim() === ""){
            showModernMessage("Complete todos los campos necesarios", "error");
            return;
        }
        if(!emailVAlidator(inputEmail.value)){
            showModernMessage("¡Por favor, ingrese un email válido!", "error");
            return;
        }

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Enviando...';
        showModernMessage("Enviando mensaje...", "info");

        emailjs.sendForm('service_sbajn43', 'template_rg62sri', form)
            .then(() => {
                showModernMessage("¡Mensaje enviado con éxito! Te contactaré pronto.", "success");
                form.reset();
            })
            .catch((err) => {
                showModernMessage("Error al enviar el mensaje. Intenta de nuevo más tarde.", "error");
                console.error('EmailJS Error:', err);
            })
            .finally(() => {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Enviar';
                setTimeout(() => {
                    messageError.style.opacity = "0";
                }, 5000);
            });
    });

    function showModernMessage(text, type) {
        messageError.textContent = text;
        messageError.style.opacity = "1";
        messageError.style.transition = "all 0.3s ease";
        messageError.style.padding = "10px";
        messageError.style.borderRadius = "5px";
        messageError.style.marginTop = "10px";
        messageError.style.textAlign = "center";
        messageError.style.fontWeight = "bold";

        if (type === "error") {
            messageError.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
            messageError.style.color = "#f87171"; // Rojo
        } else if (type === "success") {
            messageError.style.backgroundColor = "rgba(34, 197, 94, 0.2)";
            messageError.style.color = "#4ade80"; // Verde
        } else {
            messageError.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
            messageError.style.color = "#60a5fa"; // Azul (Info)
        }
    }

    function emailVAlidator(email){
        return regexEmail.test(email);
    }

    // --- LÓGICA DE TECNOLOGÍAS ---
    const skillDropdowns = document.querySelectorAll('.skill-dropdown');

    skillDropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.skill-dropbtn');
        
        btn.addEventListener('click', (e) => {
            // Evita que el clic se propague al documento y cierre el menú inmediatamente
            e.stopPropagation(); 
            const isAlreadyActive = dropdown.classList.contains('active');
            skillDropdowns.forEach(d => d.classList.remove('active'));
            if (!isAlreadyActive) {
                dropdown.classList.add('active');
            }
        });
    });

    // Cerrar el menú desplegable si el usuario hace clic en cualquier otra parte de la página
    document.addEventListener('click', () => {
        skillDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    });
    const skillContents = document.querySelectorAll('.skill-dropdown-content');
    skillContents.forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

});