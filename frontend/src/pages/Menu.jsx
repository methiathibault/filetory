import React from 'react';
import { Star, Building2, Shield, Users } from 'lucide-react';

export default function Menu() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            Welcome to FILETORY
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto px-4">
            Use Filetory to securely store what matters to you. Perfect for individuals and professionals alike - purchase once, keep forever.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
          {/* Testimonial 1 */}
          <div className="bg-blue-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-3">
              <Star className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-700 text-lg mb-3">
                  "Thanks to Filetory, I was able to store my vital card safely. Filetory saved my life!"
                </p>
                <p className="text-blue-600 font-medium">- Toinette, 75 years old, unemployed</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-blue-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-3">
              <Star className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-700 text-lg mb-3">
                  "With Filetory, I could store a copy of my NFTs. Love the concept!"
                </p>
                <p className="text-blue-600 font-medium">- Antoine, 27 years old</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-blue-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-3">
              <Star className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-700 text-lg mb-3">
                  "Filetory allowed me to show my Pokemon cards to my friends safely! (They stole my phone instead)"
                </p>
                <p className="text-blue-600 font-medium">- Anonymous user</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16 bg-blue-50 rounded-lg p-12 mx-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What are you waiting for?
          </h2>
          <p className="text-xl text-gray-600">
            Join the Filetory family today and secure your digital memories.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="border-t pt-12">
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-8">Trusted by industry leaders</p>
            <div className="flex justify-center items-center space-x-16">
              <div className="flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300">
                <Building2 className="w-8 h-8 mr-3" />
                <span className="text-xl font-medium">Google</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300">
                <Shield className="w-8 h-8 mr-3" />
                <span className="text-xl font-medium">Microsoft</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300">
                <Users className="w-8 h-8 mr-3" />
                <span className="text-xl font-medium">Amazon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}