import React from 'react';
import FadeIn from '../components/ui/FadeIn';

const TermsOfService = () => {
    return (
        <div className="min-h-screen py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Terms of Service
                        </h1>
                        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </FadeIn>

                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
                    <FadeIn delay={0.1}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceptance of Terms</h2>
                            <p className="text-gray-600 leading-relaxed">
                                By accessing and using Young Minds @ Edura's services, you accept and agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use our services.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Eligibility</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Our services are intended for children aged 5-15 years. Parents or legal guardians must provide consent and register on behalf of their children. All enrollment and participation requires explicit parental authorization.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Conduct</h2>
                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p>Users agree to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Submit original work created by the enrolled child</li>
                                    <li>Respect other participants and maintain a positive environment</li>
                                    <li>Not submit content that is harmful, offensive, or inappropriate</li>
                                    <li>Not engage in cheating, plagiarism, or fraudulent activities</li>
                                    <li>Follow all instructions and guidelines provided by instructors</li>
                                </ul>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Ownership</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Children retain ownership of their submitted work. By submitting content to our platform, you grant Young Minds @ Edura a non-exclusive license to display, reproduce, and use the content for educational and promotional purposes on our platform.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.5}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment and Refunds</h2>
                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p><strong>Payment:</strong> Enrollment fees must be paid in full before accessing program content. We accept various payment methods as indicated during enrollment.</p>
                                <p><strong>Refunds:</strong> Full refunds are available if cancelled within 7 days of enrollment and before accessing any program content. After this period, refunds are subject to a case-by-case review.</p>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.6}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Competitions and Awards</h2>
                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p>Competition submissions are evaluated based on:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Creativity and originality</li>
                                    <li>Effort and execution</li>
                                    <li>Theme relevance</li>
                                    <li>Public voting (where applicable)</li>
                                </ul>
                                <p className="mt-3">Judges' decisions are final. Young Minds @ Edura reserves the right to disqualify submissions that violate our guidelines.</p>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.7}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Young Minds @ Edura is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific program in question.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.8}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Intellectual Property</h2>
                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p><strong>Our Content:</strong> All website content, including text, graphics, logos, and software, is owned by Young Minds @ Edura and protected by copyright and trademark laws.</p>
                                <p><strong>User Content:</strong> You retain all rights to content you submit. However, by sharing on our platform, you grant us permission to display and share it within our educational community.</p>
                                <p><strong>Attribution:</strong> When sharing children's work publicly, we always credit the young creator appropriately.</p>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={0.9}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Termination</h2>
                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p>We reserve the right to suspend or terminate access to our services if:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>You violate these Terms of Service</li>
                                    <li>You engage in fraudulent or harmful activities</li>
                                    <li>You submit inappropriate or offensive content</li>
                                    <li>Payment obligations are not met</li>
                                </ul>
                                <p>You may also terminate your account at any time by contacting us.</p>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.0}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Disclaimers</h2>
                            <div className="text-gray-600 leading-relaxed space-y-3">
                                <p>Our services are provided "as is" without warranties of any kind. We do not guarantee:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Uninterrupted or error-free service</li>
                                    <li>Specific educational outcomes or achievements</li>
                                    <li>Compatibility with all devices or browsers</li>
                                    <li>Security of user-submitted content from unauthorized access</li>
                                </ul>
                                <p>While we strive for excellence, we encourage realistic expectations about educational programs.</p>
                            </div>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.1}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indemnification</h2>
                            <p className="text-gray-600 leading-relaxed">
                                You agree to indemnify and hold harmless Young Minds @ Edura, its affiliates, and staff from any claims, damages, or expenses arising from your use of our services, violation of these terms, or infringement of any third-party rights.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.2}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Governing Law</h2>
                            <p className="text-gray-600 leading-relaxed">
                                These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration, except where prohibited by law. For matters involving children, additional consumer protection laws may apply.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.3}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Severability</h2>
                            <p className="text-gray-600 leading-relaxed">
                                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.4}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Young Minds @ Edura is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific program in question.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.5}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to Terms</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of our services constitutes acceptance of the updated terms.
                            </p>
                        </section>
                    </FadeIn>

                    <FadeIn delay={1.6}>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
                            <p className="text-gray-600 leading-relaxed">
                                For questions about these Terms of Service, please contact us at:{' '}
                                <a href="mailto:legal@youngminds.edura" className="text-purple-600 hover:underline">
                                    legal@youngminds.edura
                                </a>
                            </p>
                        </section>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
