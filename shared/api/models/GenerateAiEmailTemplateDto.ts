/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GenerateAiEmailTemplateDto = {
    /**
     * The purpose of the email (e.g., "welcome email", "event invitation", "thank you note")
     */
    emailPurpose: string;
    /**
     * Recipient name for personalization
     */
    recipientName?: string;
    /**
     * Main content or message for the email
     */
    mainMessage?: string;
    /**
     * Primary color in hex format (e.g., "#ff5a5f", "#3498db")
     */
    primaryColor?: string;
    /**
     * Secondary color in hex format (e.g., "#45292f", "#2c3e50")
     */
    secondaryColor?: string;
    /**
     * Tone of the email
     */
    tone?: GenerateAiEmailTemplateDto.tone;
    /**
     * Text for the call-to-action button
     */
    buttonText?: string;
    /**
     * URL for the call-to-action button
     */
    buttonUrl?: string;
    /**
     * Brand name to use in the template
     */
    brandName?: string;
    /**
     * Additional context or special requirements for the email
     */
    additionalContext?: string;
};
export namespace GenerateAiEmailTemplateDto {
    /**
     * Tone of the email
     */
    export enum tone {
        FORMAL = 'formal',
        CASUAL = 'casual',
        FRIENDLY = 'friendly',
        PROFESSIONAL = 'professional',
    }
}

