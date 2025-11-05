package com.fintech.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Validador robusto de senhas
 * Implementa regras de segurança para senhas fortes
 * 
 * Requisitos obrigatórios:
 * - Mínimo 6 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 caractere especial
 * 
 * Requisitos recomendados:
 * - Pelo menos 1 número
 * - Mínimo 8 caracteres para senha forte
 */
public class PasswordValidator {

    // Padrões regex para validação
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]");
    private static final Pattern NUMBER_PATTERN = Pattern.compile("[0-9]");

    // Constantes de validação
    private static final int MIN_LENGTH_REQUIRED = 6;
    private static final int MIN_LENGTH_STRONG = 8;

    /**
     * Resultado da validação de senha
     */
    public static class ValidationResult {
        private final boolean isValid;
        private final List<String> errors;
        private final PasswordStrength strength;

        public ValidationResult(boolean isValid, List<String> errors, PasswordStrength strength) {
            this.isValid = isValid;
            this.errors = errors;
            this.strength = strength;
        }

        public boolean isValid() {
            return isValid;
        }

        public List<String> getErrors() {
            return errors;
        }

        public PasswordStrength getStrength() {
            return strength;
        }

        public String getErrorMessage() {
            if (errors.isEmpty()) {
                return null;
            }
            return "Senha não atende aos requisitos de segurança: " + String.join(", ", errors);
        }
    }

    /**
     * Força da senha
     */
    public enum PasswordStrength {
        WEAK("Fraca"),
        MEDIUM("Média"),
        STRONG("Forte");

        private final String description;

        PasswordStrength(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Valida uma senha com base nos critérios de segurança
     * 
     * @param password Senha a ser validada
     * @return Resultado da validação
     */
    public static ValidationResult validate(String password) {
        if (password == null) {
            return new ValidationResult(false, List.of("Senha não pode ser nula"), PasswordStrength.WEAK);
        }

        List<String> errors = new ArrayList<>();

        // Validação 1: Comprimento mínimo
        if (password.length() < MIN_LENGTH_REQUIRED) {
            errors.add("Deve ter no mínimo " + MIN_LENGTH_REQUIRED + " caracteres");
        }

        // Validação 2: Pelo menos 1 letra maiúscula
        if (!UPPERCASE_PATTERN.matcher(password).find()) {
            errors.add("Deve conter pelo menos 1 letra maiúscula (A-Z)");
        }

        // Validação 3: Pelo menos 1 caractere especial
        if (!SPECIAL_CHAR_PATTERN.matcher(password).find()) {
            errors.add("Deve conter pelo menos 1 caractere especial (!@#$%^&*...)");
        }

        // Validação recomendada: Pelo menos 1 número
        boolean hasNumber = NUMBER_PATTERN.matcher(password).find();
        if (!hasNumber) {
            errors.add("Recomendado: incluir pelo menos 1 número");
        }

        // Determinar força da senha
        PasswordStrength strength = calculateStrength(password, errors, hasNumber);

        // Filtrar apenas erros obrigatórios para determinar se é válida
        List<String> requiredErrors = errors.stream()
                .filter(error -> !error.startsWith("Recomendado:"))
                .toList();

        boolean isValid = requiredErrors.isEmpty();

        return new ValidationResult(isValid, errors, strength);
    }

    /**
     * Calcula a força da senha
     */
    private static PasswordStrength calculateStrength(String password, List<String> errors, boolean hasNumber) {
        // Se há erros obrigatórios, é fraca
        boolean hasRequiredErrors = errors.stream()
                .anyMatch(error -> !error.startsWith("Recomendado:"));
        
        if (hasRequiredErrors) {
            return PasswordStrength.WEAK;
        }

        // Se atende todos os requisitos e tem 8+ caracteres e número, é forte
        if (password.length() >= MIN_LENGTH_STRONG && hasNumber) {
            return PasswordStrength.STRONG;
        }

        // Caso contrário, é média
        return PasswordStrength.MEDIUM;
    }

    /**
     * Valida se a senha é válida (atende requisitos obrigatórios)
     * 
     * @param password Senha a ser validada
     * @return true se válida, false caso contrário
     */
    public static boolean isValid(String password) {
        return validate(password).isValid();
    }

    /**
     * Obtém a força da senha
     * 
     * @param password Senha a ser avaliada
     * @return Força da senha
     */
    public static PasswordStrength getStrength(String password) {
        return validate(password).getStrength();
    }

    /**
     * Obtém mensagem de erro para senha inválida
     * 
     * @param password Senha a ser validada
     * @return Mensagem de erro ou null se válida
     */
    public static String getErrorMessage(String password) {
        return validate(password).getErrorMessage();
    }
}
