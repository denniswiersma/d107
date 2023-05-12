package nl.d107.servlets;

import nl.d107.config.WebConfig;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "SecretBioinfClickerServlet", urlPatterns = "/secret-bioinf-clicker/", loadOnStartup = 1)
public class SecretBioinfClickerServlet extends HttpServlet {
    private TemplateEngine templateEngine;

    /**
     * Initialization method. Creates the class instances.
     *
     * @throws ServletException when the initialization fails
     */
    @Override
    public void init() throws ServletException {
        System.out.println("[Servlet] Initialising secretBioinfClickerServlet");
        this.templateEngine = WebConfig.getTemplateEngine();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Configure the response and create WebContext object
        WebConfig.configureResponse(response);
        WebContext ctx = new WebContext(request, response, request.getServletContext(), request.getLocale());

        // Process the template and data into a page
        templateEngine.process("secret-bioinf-clicker", ctx, response.getWriter());
    }
}
