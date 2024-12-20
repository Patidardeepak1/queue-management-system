// src/pages/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-black text-white min-h-screen flex justify-center items-center">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>

        <section className="mb-8">
          <p className="text-lg text-center mb-6">
            At Queue Management System, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-lg">
            We collect personal information such as your name, email address, phone number, and any other details you provide while using our services. Additionally, we may collect non-personal data such as IP addresses, browser information, and usage data for the purpose of improving our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-lg">
            We use the information we collect to provide and improve our services, communicate with you, and ensure the security of our platform. We may use your personal data for the following purposes:
          </p>
          <ul className="list-disc pl-6 mt-4">
            <li>To create and manage your account</li>
            <li>To provide customer support and resolve issues</li>
            <li>To personalize your experience on our platform</li>
            <li>To send you promotional offers, newsletters, and other communications with your consent</li>
            <li>To comply with legal requirements and protect our rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Sharing Your Information</h2>
          <p className="text-lg">
            We do not sell or rent your personal data to third parties. However, we may share your information with trusted service providers, business partners, or affiliates who help us operate our services or perform business-related functions. These partners are obligated to protect your information in accordance with this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="text-lg">
            We take the security of your personal information seriously and implement various technical and organizational measures to protect your data from unauthorized access, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee the absolute security of your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="text-lg">
            You have the right to access, update, or delete your personal information at any time. You can also withdraw your consent for us to use your information, and request that we stop sending you promotional emails. To exercise your rights, please contact us at [contact email].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
          <p className="text-lg">
            We use cookies and similar technologies to collect information about your usage of our website and services. This helps us improve user experience, analyze trends, and provide personalized content. You can control cookie settings through your browser.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
          <p className="text-lg">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page, and the effective date will be revised accordingly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p className="text-lg">
            If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
            <a href="mailto:support@queuemanagmentsystem.com" className="text-blue-500 hover:underline">
              support@queuemanagmentsystem.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
