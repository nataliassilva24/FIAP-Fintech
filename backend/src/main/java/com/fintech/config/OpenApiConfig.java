package com.fintech.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuração do OpenAPI/Swagger para documentação da API
 * Implementa boas práticas de documentação de APIs REST
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FIAP Fintech API")
                        .version("1.0.0")
                        .description("API REST para sistema de controle financeiro pessoal - Projeto FIAP")
                        .contact(new Contact()
                                .name("Equipe FIAP Fintech")
                                .email("rm557347@fiap.com.br")
                                .url("https://github.com/fiap-fintech"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080/api")
                                .description("Servidor de Desenvolvimento"),
                        new Server()
                                .url("https://fiap-fintech.herokuapp.com/api")
                                .description("Servidor de Produção (FIAP)")
                ));
    }
}
