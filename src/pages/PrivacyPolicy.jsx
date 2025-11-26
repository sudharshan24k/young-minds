import React from 'react';
import FadeIn from '../components/ui/FadeIn';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </FadeIn>

                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
                    <FadeIn delay={0.1}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
                            <p className="text-gray-600 leading-relaxed">
                                At Young Minds @ Edura, we are committed to protecting the privacy and safety of children. This Privacy Policy explains how we collect, use, and safeguard information when you use our services.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p><strong>Personal Information:</strong> We collect names, ages, email addresses, and contact information from parents/guardians during enrollment.</p>
                                <p><strong>Submission Content:</strong> Children's creative work, including artwork, writing, videos, and project descriptions submitted to our platform.</p>
                                <p><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited and features used.</p>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
                                <li>To provide and improve our educational programs</li>
                                <li>To communicate with parents about enrollment, activities, and updates</li>
                                <li>To display children's work in our public gallery (with parental consent)</li>
                                <li>To send certificates and awards to participants</li>
                                <li>To ensure the safety and security of our platform</li>
                            </ul>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Children's Privacy</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We comply with the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children without verifiable parental consent. All submissions and participation require explicit parental authorization.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.5}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.6}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
                            <div className="text-gray-600 leading-relaxed space-y-2">
                                <p>Parents/guardians have the right to:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Access their child's information</li>
                                    <li>Request corrections or deletions</li>
                                    <li>Opt-out of communications</li>
                                    <li>Withdraw consent for their child's participation</li>
                                </ul>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.7}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookies and Tracking</h2>
                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p>We use cookies and similar tracking technologies to improve user experience and analyze website usage:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Essential Cookies:</strong> Necessary for the website to function properly</li>
                                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                                </ul>
                                <p>You can control cookies through your browser settings, though this may affect site functionality.</p>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.8}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Services</h2>
                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p>We use third-party services to provide our platform:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Supabase:</strong> Backend database and authentication</li>
                                    <li><strong>Cloud Storage:</strong> Secure file storage for submissions</li>
                                    <li><strong>Payment Processors:</strong> Secure payment processing (when applicable)</li>
                                    <li><strong>Email Services:</strong> Transactional emails and notifications</li>
                                </ul>
                                <p>These services have their own privacy policies and we ensure they meet our standards for data protection.</p>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.9}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Retention</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We retain personal information only as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When you request deletion, we will remove your data within 30 days, except where retention is required by law.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.0}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">International Data Transfers</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.1}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Policy</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.2}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                            <p className="text-gray-600 leading-relaxed">
                                If you have questions about this Privacy Policy, please contact us at:{' '}
                                <a href="mailto:privacy@youngminds.edura" className="text-purple-600 hover:underline">
                                    privacy@youngminds.edura
                                </a>
                            </p>
                        </section>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
