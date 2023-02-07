FROM amd64/tomcat:9.0.69

COPY build/libs/d107-0.0.1.war /usr/local/tomcat/webapps

RUN mv /usr/local/tomcat/webapps/d107-0.0.1.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8081

CMD ["catalina.sh", "run"]