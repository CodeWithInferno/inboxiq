import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> 04.01.2025</p>
      <p>
        [Your Application Name] (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to
        protecting the personal information that you share with us. This Privacy Policy explains how
        we collect, use, and safeguard your information when you use our application, [Your
        Application Name], accessible at [Your Application URL].
      </p>

      <h2>1. Information We Collect</h2>
      <h3>1.1 Information You Provide</h3>
      <ul>
        <li>
          <strong>Account Information:</strong> When you sign up, we may collect your name, email
          address, and other information necessary to create and maintain your account.
        </li>
        <li>
          <strong>OAuth Permissions:</strong> We request access to your Gmail account, Google
          Calendar, and profile data to provide specific features. Permissions include:
          <ul>
            <li>View and manage emails (read-only or modify).</li>
            <li>Manage drafts and send emails.</li>
            <li>Access Google Calendar events (read-only or edit).</li>
          </ul>
        </li>
      </ul>

      <h3>1.2 Information Collected Automatically</h3>
      <ul>
        <li>
          <strong>Usage Data:</strong> Information such as your device’s IP address, browser type,
          and usage statistics to help us improve our services.
        </li>
        <li>
          <strong>Cookies:</strong> We use cookies to manage sessions and improve user experience.
          You can control cookie usage through your browser settings.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use the information collected for the following purposes:
      </p>
      <ul>
        <li>To provide core functionality, such as reading, composing, and managing emails and calendar events.</li>
        <li>To improve user experience and offer personalized features.</li>
        <li>To comply with legal obligations and protect against unauthorized use.</li>
      </ul>

      <h2>3. How We Share Your Information</h2>
      <p>
        We do not sell or share your information with third parties for marketing purposes. We may
        share your information in the following cases:
      </p>
      <ul>
        <li>
          <strong>Service Providers:</strong> Trusted third-party services (e.g., database hosting)
          that help us operate our application.
        </li>
        <li>
          <strong>Legal Requirements:</strong> To comply with applicable laws, regulations, or legal
          requests.
        </li>
      </ul>

      <h2>4. Your Data Choices and Rights</h2>
      <ul>
        <li>
          <strong>Access and Export:</strong> You can request access to the data we have about you.
        </li>
        <li>
          <strong>Modify or Delete:</strong> You can modify or delete your data by contacting us at
          iqinbox9@gmail.com.
        </li>
        <li>
          <strong>Revoke Permissions:</strong> You can revoke Google API access at any time through
          your Google Account settings.
        </li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>
        We retain your data only as long as necessary to provide our services or comply with legal
        obligations. You may request deletion of your data by contacting us.
      </p>

      <h2>6. Security</h2>
      <p>
        We implement industry-standard security measures to protect your data. However, no method of
        transmission over the internet or electronic storage is completely secure.
      </p>

      <h2>7. Third-Party Services</h2>
      <p>
        Our application may include links to third-party services. We are not responsible for the
        privacy practices of these external services.
      </p>

      <h2>8. Children’s Privacy</h2>
      <p>
        Our services are not intended for children under the age of 13. We do not knowingly collect
        personal information from children.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be effective upon posting.
        We encourage you to review this page periodically.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us:
      </p>
      <ul>
        <li>Email: iqinbox9@Gmail.com</li>
        <li>Website: http://inboxiq-seven.vercel.app/</li>
      </ul>

      <p><strong>Last Updated:</strong> 04.01.2025</p>

      <a
        href="/privacy.docx"
        download
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
        }}
      >
        Download Privacy Policy 
      </a>
    </div>
  );
};

export default PrivacyPolicy;
