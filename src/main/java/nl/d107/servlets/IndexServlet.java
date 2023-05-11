package nl.d107.servlets;

import nl.d107.config.WebConfig;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "IndexServlet", urlPatterns = "/", loadOnStartup = 1)
public class IndexServlet extends HttpServlet {
    private TemplateEngine templateEngine;

    /**
     * Initialization method. Creates the class instances.
     *
     * @throws ServletException when the initialization fails
     */
    @Override
    public void init() throws ServletException {
        System.out.println("[Servlet] Initialising IndexServlet");
        this.templateEngine = WebConfig.getTemplateEngine();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Configure the response and create WebContext object
        WebConfig.configureResponse(response);
        WebContext ctx = new WebContext(request, response, request.getServletContext(), request.getLocale());

        // Process the template and data into a page
        templateEngine.process("index", ctx, response.getWriter());
    }
}
