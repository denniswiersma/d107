package nl.d107.servlets;

import nl.d107.config.WebConfig;
import nl.d107.models.EntryController;
import nl.d107.models.WikiEntry;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "WikiServlet", urlPatterns = "/wiki/", loadOnStartup = 1)
public class WikiServlet extends HttpServlet {
    private TemplateEngine templateEngine;

    /**
     * Initialization method. Creates the class instances.
     *
     * @throws ServletException when the initialization fails
     */
    @Override
    public void init() throws ServletException {
        System.out.println("[Servlet] Initialising WikiServlet");
        this.templateEngine = WebConfig.getTemplateEngine();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Configure the response and create WebContext object
        WebConfig.configureResponse(response);
        WebContext ctx = new WebContext(request, response, request.getServletContext(), request.getLocale());

        // Collect entries and set to context variable
        String wikiEntriesFile = getServletContext().getInitParameter("wiki-entries-file");
        List<WikiEntry> entries = EntryController.readCsv(getServletContext().getRealPath(wikiEntriesFile));
        ctx.setVariable("entries", entries);

        // Process the template and data into a page
        templateEngine.process("wiki", ctx, response.getWriter());
    }
}
