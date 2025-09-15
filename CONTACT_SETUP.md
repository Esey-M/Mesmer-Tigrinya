# Contact Form Setup Instructions

## Overview
Your Tigrinya learning website now has a contact form that uses Formsubmit to handle form submissions without exposing your email address publicly.

## Files Created
- `contact.html` - Main contact form page
- `contact-thanks.html` - Thank you page after form submission
- `CONTACT_SETUP.md` - This setup guide

## Setup Steps

### 1. Register with Formsubmit
1. Go to [https://formsubmit.co](https://formsubmit.co)
2. Enter your email address where you want to receive contact form submissions
3. Click "Activate" and check your email
4. Click the activation link in your email
5. Copy your unique Formsubmit endpoint URL (it will look like `https://formsubmit.co/your-unique-endpoint`)

### 2. Update the Contact Form
1. Open `contact.html` in your editor
2. Find this line (around line 85):
   ```html
   <form id="contact-form" action="https://formsubmit.co/UNIQUE_ENDPOINT" method="POST" novalidate>
   ```
3. Replace `UNIQUE_ENDPOINT` with your actual Formsubmit endpoint
4. Save the file

### 3. Update the Thank You Page Redirect
1. In `contact.html`, find this line (around line 95):
   ```html
   <input type="hidden" name="_next" value="https://YOUR-GITHUB-PAGES-URL/contact-thanks.html" />
   ```
2. Replace `YOUR-GITHUB-PAGES-URL` with your actual GitHub Pages URL
   - Example: `https://yourusername.github.io/Mesmer-Tigrinya`
3. Save the file

### 4. Test the Form
1. Deploy your changes to GitHub Pages
2. Visit your contact page
3. Fill out and submit the form
4. Check that you receive the email
5. Verify you're redirected to the thank you page

## Features Included

### ✅ Security Features
- **Honeypot field** - Hidden field that bots fill but humans don't (reduces spam)
- **No email exposure** - Your email is never visible on the public site
- **Form validation** - Client-side validation for better user experience

### ✅ User Experience
- **Bilingual interface** - Tigrinya and English text throughout
- **Kid-friendly design** - Colorful, engaging interface matching your site's style
- **Loading states** - Submit button shows "Sending..." while processing
- **Responsive design** - Works on all devices
- **Accessibility** - Proper labels, ARIA attributes, and keyboard navigation

### ✅ Form Fields
- **Name** - Required field for sender identification
- **Email** - Required field for replies
- **Subject** - Optional field for message categorization
- **Message** - Required field for the actual message content

### ✅ Navigation
- **Contact link added** to all pages in the navbar
- **Tigrinya translation** - "ኣብ ርክብ ንኺድ" (Contact Us)
- **Consistent styling** - Matches your existing navbar design

## Customization Options

### Changing Form Fields
To add or modify form fields, edit the form section in `contact.html`:
```html
<div class="mb-3">
  <label for="field-name" class="form-label">Field Label</label>
  <input type="text" class="form-control" id="field-name" name="field-name" placeholder="Placeholder text">
</div>
```

### Styling Changes
The contact form uses your existing CSS variables and Bootstrap classes. Key custom styles are in the `<style>` section of `contact.html`.

### Email Template
Formsubmit will send you emails with the form data. You can customize the email template by adding hidden fields:
```html
<input type="hidden" name="_template" value="table">
<input type="hidden" name="_subject" value="Custom Subject Line">
```

## Troubleshooting

### Form Not Working
1. Check that your Formsubmit endpoint is correct
2. Verify you've activated your Formsubmit account
3. Check browser console for JavaScript errors
4. Ensure your GitHub Pages URL is correct in the `_next` field

### Not Receiving Emails
1. Check your spam folder
2. Verify your email address in Formsubmit
3. Check Formsubmit dashboard for delivery status
4. Try a different email address if needed

### Thank You Page Not Loading
1. Verify the `_next` URL is your correct GitHub Pages URL
2. Check that `contact-thanks.html` is in your repository root
3. Ensure the file is deployed to GitHub Pages

## Support
- Formsubmit documentation: [https://formsubmit.co/documentation](https://formsubmit.co/documentation)
- GitHub Pages documentation: [https://docs.github.com/en/pages](https://docs.github.com/en/pages)

## Security Notes
- The honeypot field helps reduce spam but doesn't eliminate it completely
- Formsubmit handles the email delivery securely
- No sensitive data is stored on your GitHub Pages site
- Consider adding reCAPTCHA if you experience high spam volumes

---

**Remember**: Replace `UNIQUE_ENDPOINT` and `YOUR-GITHUB-PAGES-URL` with your actual values before deploying!
