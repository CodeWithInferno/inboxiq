import Navbar from "../app/components/header";

export default function Home() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-700 text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Your Startup Deserves a Great Experience
          </h1>
          <p className="text-lg mb-8">
            Enhance your productivity with our cutting-edge email management
            solutions. Transform the way you handle emails with smart features
            and tools.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Transform Your Workflow with MailMinds
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {["Smart Automation", "Secure & Private", "Insightful Analytics"].map(
              (feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={`/icons/feature-${index + 1}.svg`}
                    alt={feature}
                    className="w-16 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Discover the power of {feature} and optimize your email management.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose MailMinds?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <img src="/images/showcase-1.jpg" alt="Showcase 1" className="rounded-lg mb-6" />
              <h3 className="text-xl font-bold mb-2">Automate Your Workflow</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use our AI-powered tools to automate repetitive tasks and focus
                on what matters most.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <img src="/images/showcase-2.jpg" alt="Showcase 2" className="rounded-lg mb-6" />
              <h3 className="text-xl font-bold mb-2">Gain Insights with Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced analytics provide you with actionable insights to
                make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "MailMinds has completely changed how I manage my inbox!",
              "Incredible tool! I've saved so much time every week.",
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md"
              >
                <p className="italic mb-4">{`"${testimonial}"`}</p>
                <p className="font-semibold">- User {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8">Sign up today and experience the power of MailMinds.</p>
          <a
            href="#"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
          >
            Start Free Trial
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2023 MailMinds. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-500">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-500">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-500">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
