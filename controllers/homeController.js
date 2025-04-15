const courses = [
    {
      title: "Introduction à l'IA",
      description: "Découvrez les fondamentaux de l'intelligence artificielle.",
      price: 199,
      level: "Débutant"
    },
    {
      title: "Machine Learning Fondamental",
      description: "Apprenez les principes du machine learning et les algorithmes de base.",
      price: 299,
      level: "Intermédiaire"
    },
    {
      title: "Deep Learning Avancé",
      description: "Maîtrisez les réseaux de neurones profonds et leurs applications.",
      price: 399,
      level: "Avancé"
    }
  ];
  
  exports.index = (req, res) => {
    res.render("index", { pageTitle: "Accueil" });
  };
  
  exports.about = (req, res) => {
    res.render("about", { pageTitle: "À propos" });
  };
  
  exports.courses = (req, res) => {
    res.render("courses", {
      pageTitle: "Nos Cours",
      courses: courses
    });
  };
  
  exports.contact = (req, res) => {
    res.render("contact", { pageTitle: "Contact" });
  };
  
  exports.processContact = (req, res) => {
    console.log("Données du formulaire reçues:");
    console.log(req.body);
    res.render("thanks", {
      pageTitle: "Merci",
      formData: req.body
    });
  };
  
  exports.faq = (req, res) => {
    const faqs = [
        {
            question: "Qui peut suivre les cours ?",
            answer: "Nos cours sont ouverts à tous, quel que soit votre niveau."
        },
        {
            question: "Les cours sont-ils gratuits ?",
            answer: "Nous proposons des cours payants avec une qualité garantie."
        },
        {
            question: "Comment s'inscrire ?",
            answer: "Remplissez le formulaire de contact et nous vous recontacterons."
        },
        {
            question: "Y a-t-il des prérequis ?",
            answer: "Seulement pour les cours avancés (mentionnés dans les descriptions)."
        },
        {
            question: "Obtenez-vous un certificat ?",
            answer: "Oui, un certificat est délivré après réussite à l'examen final."
        }
    ];
    
    res.render("faq", {
        pageTitle: "FAQ",
        faqs: faqs
    });
};
exports.processContact = (req, res) => {
    const { name, email, message } = req.body;
    const errors = [];

   
    if (!name || name.trim().length < 2) errors.push('Nom trop court (2 caractères min)');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Email invalide');
    if (typeof message !== 'undefined' && message.length > 500) {
        errors.push('Le message ne doit pas dépasser 500 caractères');
        console.log(`Message trop long (${message.length} caractères)`); // Debug
    }

   
    if (errors.length > 0) {
        return res.render('contact', {
            pageTitle: 'Contact',
            errors, 
            formData: req.body, 
            notification: {
                type: "error",
                message: "Formulaire invalide"
            }
        });
    }

    // 3. Traitement réussi (existant adapté)
    res.render("thanks", {
        pageTitle: "Merci",
        formData: req.body,
        notification: { // Ton système original
            type: "success",
            message: "Message envoyé avec succès !"
        }
    });
};
exports.courses = (req, res) => {
    let filteredCourses = [...courses];
    
    // Filtres
    const filters = {
        level: req.query.level || '',
        price: req.query.price || ''
    };

    if (filters.level) {
        filteredCourses = filteredCourses.filter(
            course => course.level === filters.level
        );
    }

    if (filters.price) {
        const [min, max] = filters.price.split('-');
        filteredCourses = filteredCourses.filter(course => {
            if (min && max) return course.price >= min && course.price <= max;
            if (min) return course.price >= min;
            if (max) return course.price <= max;
            return true;
        });
    }

    res.render("courses", {
        pageTitle: "Nos Cours",
        courses: filteredCourses,
        filters: filters 
    });
};