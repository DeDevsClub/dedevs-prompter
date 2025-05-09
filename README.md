# prompt-enhancer
Prompt enhancer application that assists in creating prompts that result in optimal responses, which saves time and tokens.

## Project Structure

The project is a Next.js application with the following key directories:

*   `/app`: Contains the core application pages and API routes.
    *   `/app/api`: Houses backend API endpoints.
        *   `/app/api/enhance/route.ts`: API endpoint to programmatically enhance text using OpenAI.
        *   `/app/api/test-openai-key/route.ts`: API endpoint to validate an OpenAI API key.
    *   `/app/enhance/page.tsx`: The main page for the prompt enhancement functionality.
    *   `/app/page.tsx`: The landing page of the application.
    *   `layout.tsx`: The main layout component for the application.
    *   `globals.css`: Global stylesheets.
*   `/components`: Contains reusable UI components.
    *   `/components/ui`: Likely contains UI primitives, possibly from a library like Shadcn UI.
    *   `api-key-manager.tsx`: Component for managing API keys.
    *   `interactive-principles-guide.tsx`: Component for guiding users on prompt principles.
    *   `enhancement-settings.tsx`: Component for managing enhancement settings.
    *   `diff-view.tsx`: Component for showing differences in text.
    *   `prompt-history.tsx`: Component for displaying prompt history.
*   `/hooks`: Custom React hooks.
*   `/lib`: Utility functions and libraries.
*   `/public`: Static assets (images, fonts, etc.).
*   `next.config.mjs`: Next.js configuration file.
*   `package.json`: Project dependencies and scripts.
*   `tsconfig.json`: TypeScript configuration.

## Project Components

### Core Functionality
*   **Prompt Enhancement Page (`/app/enhance/page.tsx`)**: The primary user interface where users can input text and have it enhanced.
*   **Interactive Principles Guide (`/components/interactive-principles-guide.tsx`)**: Provides guidance to users on effective prompt engineering.
*   **Enhancement Settings (`/components/enhancement-settings.tsx`)**: Allows users to configure settings related to the text enhancement process.
*   **Diff View (`/components/diff-view.tsx`)**: Displays the original and enhanced text side-by-side or with differences highlighted.
*   **Prompt History (`/components/prompt-history.tsx` and `prompt-history-item.tsx`)**: Allows users to view and reuse previously used prompts.

### API Endpoints
*   **`/api/enhance` (`/app/api/enhance/route.ts`)**:
    *   Enables programmatic text enhancement.
    *   Accepts a `POST` request with `text` and `apiKey` in the JSON body.
    *   Uses the provided OpenAI API key to interact with the OpenAI API.
    *   Returns the enhanced text.
*   **`/api/test-openai-key` (`/app/api/test-openai-key/route.ts`)**:
    *   Validates an OpenAI API key.
    *   Accepts a `POST` request with `apiKey` in the JSON body.

### UI & Supporting Components
*   **API Key Manager (`/components/api-key-manager.tsx`)**: Manages the user's OpenAI API key within the frontend.
*   **Site Header & Footer (`/components/site-header.tsx`, `/components/site-footer.tsx`)**: Common layout elements.
*   **Theme Provider & Toggle (`/components/theme-provider.tsx`, `/components/theme-toggle.tsx`)**: Manages application theming (e.g., light/dark mode).
*   **Shadcn UI Components (`/components/ui`)**: A collection of reusable UI components.

## Security Considerations

### API Key Handling

The application includes API endpoints (`/api/enhance` and `/api/test-openai-key`) that accept an OpenAI API key directly in the request body from the client. This model is intended for scenarios where a user wishes to programmatically use *their own* API key via this application's backend acting as a proxy.

*   **Client Responsibility:** The client (e.g., a script, `cURL` command, or the user directly) is responsible for securely managing their OpenAI API key *before* sending it to these endpoints.
*   **Transmission Security:** API keys sent to these endpoints should **always** be transmitted over HTTPS in a production environment to protect them from interception during transit. The backend server processes these keys in memory for the duration of the request and does not store them persistently.
*   **Backend Trust:** The client must trust this backend application to handle the provided API key responsibly (i.e., use it only for the intended OpenAI API calls and not log or misuse it).
*   **Never Commit API Keys:** **API keys or any other sensitive credentials should NEVER be committed to version control (e.g., in `README.md` files, source code, or configuration files directly).** If an API key is accidentally exposed, it should be revoked immediately from the OpenAI dashboard and replaced.
*   **Alternative for General Use (Application-Owned Key):** If the application were intended for general public use where users do *not* provide their own keys, a more secure model would involve the application owner securely storing a single OpenAI API key on the server (e.g., as an environment variable). In this model, the backend API routes would use this server-configured key, and clients would not send any API key.

### General Security
*   **Input Validation:** Ensure all user inputs, both on the frontend and backend API routes, are properly validated to prevent common web vulnerabilities (e.g., XSS, injection attacks). The current API routes include basic checks for the presence and type of expected inputs.
*   **Dependency Management:** Keep project dependencies up-to-date and regularly audit them for known vulnerabilities using tools like `pnpm audit`.
*   **Error Handling:** Implement robust error handling to avoid leaking sensitive information in error messages. The current API routes provide generic error messages for server-side issues.

---
**Note:** The cURL command previously present in this README (which may have included an exposed API key) has been removed from this updated version. Please ensure any actual API keys are never hardcoded or committed here or in any other part of the repository.
