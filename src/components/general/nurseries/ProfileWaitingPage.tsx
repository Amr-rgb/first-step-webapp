"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Construction, Heart, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ProfileWaitingPageProps {
  nurseryName: string;
  locale?: string;
}

const ProfileWaitingPage = ({ nurseryName, locale = "en" }: ProfileWaitingPageProps) => {
  const t = useTranslations("nursery.waitingPage");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content Card */}
          <Card className="p-12 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            {/* Construction Animation */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center animate-pulse">
                <Construction className="w-16 h-16 text-orange-600 animate-bounce" />
              </div>
              
              {/* Animated dots */}
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {nurseryName}
            </h1>
            
            <div className="text-6xl mb-6">🏗️</div>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-orange-600 mb-6">
              Profile Coming Soon!
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're working hard to create an amazing profile page for <strong>{nurseryName}</strong>. 
              Our team is busy adding all the details about their services, programs, and facilities to give you the best information possible.
            </p>
            
            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Detailed Information</h3>
                <p className="text-sm text-gray-600">Complete details about programs, services, and facilities</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Meet the Team</h3>
                <p className="text-sm text-gray-600">Get to know the caring professionals who will look after your child</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-sm text-gray-600">Stay informed with the latest news and updates from the nursery</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-orange-600 font-medium">Profile Setup in Progress</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mx-auto max-w-md">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">75% Complete</p>
            </div>
            
            {/* Call to Action */}
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">
                In the meantime, feel free to explore other nurseries or check back soon!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/${locale}/nurseries`}>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Browse Other Nurseries
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-gray-300 hover:border-primary hover:text-primary px-8 py-3 rounded-full transition-all duration-300"
                  onClick={() => window.location.reload()}
                >
                  Check Again
                </Button>
              </div>
            </div>
            
            {/* Notification Signup */}
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Notified When Ready!
              </h3>
              <p className="text-gray-600 mb-4">
                Want to know as soon as {nurseryName}'s profile is ready? We'll send you a notification.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full">
                  Notify Me
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              This page will automatically redirect once the nursery profile is complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWaitingPage;
