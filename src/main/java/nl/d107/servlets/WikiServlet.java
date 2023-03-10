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
import java.util.ArrayList;

@WebServlet(name = "WikiServlet", urlPatterns = "/wiki/", loadOnStartup = 1)
public class WikiServlet extends HttpServlet {
    // Stores an instance of the TemplateEngine
    private TemplateEngine templateEngine;

    /**
     * Initialises the class: gets the TemplateEngine
     * @throws ServletException if the servlet cannot be created
     */
    @Override
    public void init() throws ServletException {
        System.out.println("[Servlet] Initialising IndexServlet");
        // Gets the template engine
        this.templateEngine = WebConfig.getTemplateEngine();
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Configure the response
        WebConfig.configureResponse(response);

        // Create WebContext object
        WebContext ctx = new WebContext(
                request,
                response,
                request.getServletContext(),
                request.getLocale());

        // Process the template and data into a page
        ArrayList<WikiEntry> entries = EntryController.readCsv(getServletContext().getRealPath("entries.csv"));
        ctx.setVariable("entries", entries);
        templateEngine.process("wiki", ctx, response.getWriter());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    }
}
