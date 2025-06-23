const templateCache = {};

export async function loadTemplate(templateName) {
    if (templateCache[templateName]) {
        return templateCache[templateName];
    }

    try {
        const response = await fetch(`templates/${templateName}.hbs`);
        if (!response.ok) throw new Error('Template not found');

        const templateText = await response.text();
        const template = Handlebars.compile(templateText);

        templateCache[templateName] = template;
        return template;
    } catch (error) {
        console.error(`Error loading template: ${templateName}`, error);
        return null;
    }
}

// Initialize Handlebars helpers when the module loads
(function initHandlebars() {
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('escape', function(context) {
        return new Handlebars.SafeString(
            context.replace(/[&<>"'`]/g, function(m) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '`': '&#x60;'
                }[m];
            })
        );
    });
})();
