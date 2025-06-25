// Simple in-memory cache for compiled Handlebars templates
const templateCache = {};

/**
 * Loads and compiles a Handlebars template asynchronously.
 * Caches the compiled template for future use.
 * @param {string} templateName - The name of the template file (without extension)
 * @returns {Promise<Function|null>} - The compiled template function or null if loading fails
 */
export async function loadTemplate(templateName) {
    if (templateCache[templateName]) {
        // Return cached template if available
        return templateCache[templateName];
    }

    try {
        // Fetch the template file from the templates directory
        const response = await fetch(`templates/${templateName}.hbs`);
        if (!response.ok) throw new Error('Template not found');

        // Read the template text and compile it with Handlebars
        const templateText = await response.text();
        const template = Handlebars.compile(templateText);

        // Cache the compiled template for future use
        templateCache[templateName] = template;
        return template;
    } catch (error) {
        // Log error and return null if loading fails
        console.error(`Error loading template: ${templateName}`, error);
        return null;
    }
}

// Initialize Handlebars helpers when the module loads
(function initHandlebars() {
    /**
     * Handlebars helper: ifEquals
     * Usage: {{#ifEquals arg1 arg2}} ... {{/ifEquals}}
     * Renders the block if arg1 == arg2, otherwise renders the inverse block.
     */
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    /**
     * Handlebars helper: escape
     * Escapes HTML special characters in the given context string.
     * Usage: {{escape someVar}}
     */
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
