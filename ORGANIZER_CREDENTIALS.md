# Organizer Credentials (Admin Only)

These organizer accounts are hardcoded in the application and cannot be created through the UI registration.

## Available Organizer Accounts

### 1. Admin Organizer
- **Email:** admin@inazuma.com
- **Password:** Admin@2024
- **Username:** AdminOrganizer

### 2. Demo Organizer
- **Email:** organizer@demo.com
- **Password:** Organizer@123
- **Username:** DemoOrganizer

## Notes
- Organizer registration is NOT available through the signup UI
- Only player accounts can be created through the registration page
- These credentials are hardcoded in `src/context/AuthContext.tsx`
- To add more organizers, edit the `ORGANIZER_CREDENTIALS` Map in the AuthContext file
