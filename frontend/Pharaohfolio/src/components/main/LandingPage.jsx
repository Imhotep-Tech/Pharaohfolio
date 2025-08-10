import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';
import ImhotepChefLogo from '../../assets/ImhotepChef.png';

function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Recipe Generation",
      description: "Get personalized recipes based on your available ingredients and dietary preferences"
    },
    {
      icon: "📚",
      title: "Recipe History & Management",
      description: "Save, organize, and revisit all your favorite AI-generated recipes"
    },
    {
      icon: "🎯",
      title: "Dietary Customization",
      description: "Customize recipes for vegetarian, vegan, keto, gluten-free, and more dietary needs"
    },
    {
      icon: "⚡",
      title: "Quick & Easy Cooking",
      description: "Get step-by-step instructions and cooking tips for perfect results every time"
    },
  ];

  // Auto-rotate features every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <>
      {/* SEO Meta tags equivalent (these would typically go in the document head) */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 -right-20 w-60 h-60 bg-gradient-to-r from-red-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed"></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-slow"></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-16 pb-20 lg:pt-24 lg:pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Hero Header */}
            <div className="text-center mb-16">
              <div className="inline-block p-4 bg-white rounded-full mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100">
                <img 
                  src={ImhotepChefLogo} 
                  alt="ImhotepChef Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Imhotep Chef
                </span>
              </h1>
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-8 font-medium max-w-4xl mx-auto leading-relaxed">
                Your AI-Powered Culinary Companion - Transform Any Ingredients Into Delicious Recipes
              </h2>
              
              <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover the future of cooking with our intelligent recipe generator. Whether you're a beginner or a master chef, 
                Imhotep Chef helps you create amazing meals from whatever ingredients you have at home.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link
                  to="/register"
                  className="chef-button bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-48"
                >
                  🚀 Start Cooking Now
                </Link>
                
                <Link
                  to="/login"
                  className="chef-button-secondary bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-orange-500 hover:bg-orange-50 transform hover:scale-105 transition-all duration-300 min-w-48"
                >
                  🔓 Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="relative z-10 py-20 bg-white/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Choose <span className="text-orange-600">Imhotep Chef</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the power of AI-driven cooking with features designed to make your culinary journey exciting and effortless.
              </p>
            </div>

            {/* Interactive Feature Display */}
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Feature Description */}
                <div className="order-2 lg:order-1">
                  <div className="chef-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-orange-100">
                    <div className="text-6xl mb-4">{features[currentFeature].icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{features[currentFeature].title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">{features[currentFeature].description}</p>
                    
                    {/* Feature indicators */}
                    <div className="flex space-x-2">
                      {features.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentFeature(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentFeature 
                              ? 'bg-orange-500 w-8' 
                              : 'bg-gray-300 hover:bg-orange-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Feature Grid */}
                <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`cursor-pointer transition-all duration-300 p-4 rounded-xl ${
                        index === currentFeature
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl scale-105'
                          : 'bg-white/80 hover:bg-white text-gray-800 hover:shadow-lg hover:scale-102'
                      }`}
                    >
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h4 className="font-semibold text-sm">{feature.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                How <span className="text-orange-600">Imhotep Chef</span> Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From ingredients to delicious meals in just three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  icon: "📝",
                  title: "List Your Ingredients",
                  description: "Simply tell us what ingredients you have available in your kitchen"
                },
                {
                  step: "2",
                  icon: "🤖",
                  title: "AI Magic Happens",
                  description: "Our advanced AI analyzes your ingredients and dietary preferences to create perfect recipes"
                },
                {
                  step: "3",
                  icon: "🍽️",
                  title: "Cook & Enjoy",
                  description: "Follow step-by-step instructions and enjoy your personalized, delicious meal"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-4xl shadow-xl">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="relative z-10 py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Transform Your Cooking Experience
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Join thousands of home cooks who have revolutionized their kitchen experience with Imhotep Chef
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "💰", title: "Save Money", description: "Reduce food waste by using ingredients you already have" },
                { icon: "⏰", title: "Save Time", description: "No more wondering what to cook - get instant recipe suggestions" },
                { icon: "🎯", title: "Perfect Results", description: "AI-optimized recipes ensure delicious results every time" },
                { icon: "🌱", title: "Eat Healthier", description: "Get nutritious meal suggestions tailored to your dietary goals" }
              ].map((benefit, index) => (
                <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm opacity-90">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <div className="chef-card bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-orange-100">
              <div className="flex justify-center mb-6">
                <img 
                  src={ImhotepChefLogo} 
                  alt="ImhotepChef Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Ready to Become a Kitchen <span className="text-orange-600">Master</span>?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join Imhotep Chef today and discover how AI can transform your cooking from ordinary to extraordinary.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="chef-button bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-xl font-semibold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🚀 Get Started for Free
                </Link>
                
                <p className="text-sm text-gray-500">
                  No credit card required • Start cooking in minutes
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
export default LandingPage