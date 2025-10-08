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
     * Target audience for the email greeting (e.g., "Dear Close Ones", "Dear Family and Friends", "Dear Valued Guests")
     */
    audience?: string;
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
     * Location address to display on Google Maps. If provided, a "View On Map" button will be included in the email.
     */
    mapLocation?: string;
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

