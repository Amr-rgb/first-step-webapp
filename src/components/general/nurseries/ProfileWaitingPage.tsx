"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Construction, Heart, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ProfileWaitingPageProps {
  nurseryName: string;
  locale?: string;
  userRole?: 'admin' | 'parent' | 'center';
}

const ProfileWaitingPage = ({ nurseryName, locale = "en", userRole = 'parent' }: ProfileWaitingPageProps) => {
  const t = useTranslations("nursery.waitingPage");
  
  // Role-specific configuration
  const getRoleConfig = () => {
    switch(userRole) {
      case 'admin':
        return {
          title: "Admin Dashboard",
          emoji: "👨‍💼",
          color: "from-indigo-100 to-blue-200",
          bgGradient: "from-indigo-50 via-white to-blue-50",
          primaryColor: "indigo",
          message: "Managing nursery profiles and approving registrations...",
          features: [
            { icon: "📊", title: "Profile Management", desc: "Monitor and approve nursery profiles" },
            { icon: "✅", title: "Quality Control", desc: "Ensure all profiles meet our standards" },
            { icon: "🛡️", title: "Safety Review", desc: "Verify safety and licensing information" }
          ],
          actions: [
            { text: "Admin Dashboard", href: `/${locale}/dashboard/admin`, variant: "default" },
            { text: "View All Nurseries", href: `/${locale}/nurseries`, variant: "outline" }
          ]
        };
      case 'center':
        return {
          title: "Center Dashboard",
          emoji: "🏫", 
          color: "from-green-100 to-emerald-200",
          bgGradient: "from-green-50 via-white to-emerald-50",
          primaryColor: "emerald", 
          message: "Building your nursery profile to attract families...",
          features: [
            { icon: "✨", title: "Profile Builder", desc: "Create your stunning nursery profile" },
            { icon: "👶", title: "Showcase Programs", desc: "Highlight your educational programs" },
            { icon: "📸", title: "Gallery Setup", desc: "Upload photos of your facilities" }
          ],
          actions: [
            { text: "Complete Profile", href: `/${locale}/dashboard/center/profile-editor`, variant: "default" },
            { text: "Center Dashboard", href: `/${locale}/dashboard/center`, variant: "outline" }
          ]
        };
      default: // parent
        return {
          title: "Finding Perfect Care",
          emoji: "👨‍👩‍👧‍👦",
          color: "from-pink-100 to-rose-200", 
          bgGradient: "from-pink-50 via-white to-rose-50",
          primaryColor: "rose",
          message: "This nursery is preparing something special for your little one...",
          features: [
            { icon: "🎨", title: "Creative Programs", desc: "Engaging activities for your child's development" },
            { icon: "👩‍🏫", title: "Expert Teachers", desc: "Qualified professionals who care about your child" },
            { icon: "🏡", title: "Safe Environment", desc: "A secure and nurturing space for learning" }
          ],
          actions: [
            { text: "Explore Other Nurseries", href: `/${locale}/nurseries`, variant: "default" },
            { text: "Parent Dashboard", href: `/${locale}/dashboard/parent`, variant: "outline" }
          ]
        };
    }
  };
  
  const config = getRoleConfig();
  
  return (
    <div className={`min-h-screen bg-gradient-to-b ${config.bgGradient} relative overflow-hidden`}>
      {/* Cute floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{animationDelay: '0s'}}>🎈</div>
        <div className="absolute top-32 right-20 text-3xl animate-bounce" style={{animationDelay: '1s'}}>⭐</div>
        <div className="absolute top-64 left-1/4 text-2xl animate-bounce" style={{animationDelay: '2s'}}>🌈</div>
        <div className="absolute bottom-32 right-10 text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>🧸</div>
        <div className="absolute bottom-20 left-16 text-2xl animate-bounce" style={{animationDelay: '1.5s'}}>🚀</div>
        <div className="absolute top-1/2 right-1/3 text-2xl animate-bounce" style={{animationDelay: '2.5s'}}>🎪</div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content Card */}
          <Card className="p-12 shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl">
            {/* Cute Animation */}
            <div className="relative mb-8">
              <div className={`w-48 h-48 mx-auto mb-6 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center shadow-2xl relative`}>
                <div className="text-6xl animate-pulse">{config.emoji}</div>
                
                {/* Cute orbiting elements */}
                <div className="absolute inset-0 animate-spin" style={{animationDuration: '10s'}}>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-2xl">✨</div>
                </div>
                <div className="absolute inset-0 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl">💫</div>
                </div>
              </div>
              
              {/* Animated dots */}
              <div className="flex justify-center space-x-3">
                <div className={`w-4 h-4 bg-${config.primaryColor}-400 rounded-full animate-bounce shadow-lg`} style={{ animationDelay: '0ms' }}></div>
                <div className={`w-4 h-4 bg-${config.primaryColor}-500 rounded-full animate-bounce shadow-lg`} style={{ animationDelay: '150ms' }}></div>
                <div className={`w-4 h-4 bg-${config.primaryColor}-400 rounded-full animate-bounce shadow-lg`} style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {nurseryName}
            </h1>
            
            <div className="text-7xl mb-6">🏗️</div>
            
            <h2 className={`text-2xl md:text-3xl font-semibold text-${config.primaryColor}-600 mb-6`}>
              {config.title}
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {config.message}
            </p>
            
            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {config.features.map((feature, index) => (
                <div key={index} className="text-center p-6 bg-white/50 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300">
                  <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: `${index * 0.2}s`}}>{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <Clock className={`w-5 h-5 text-${config.primaryColor}-500 mr-2 animate-spin`} />
                <span className={`text-${config.primaryColor}-600 font-medium`}>Profile Setup in Progress</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mx-auto max-w-md overflow-hidden">
                <div className={`bg-gradient-to-r from-${config.primaryColor}-400 to-${config.primaryColor}-600 h-4 rounded-full animate-pulse transition-all duration-1000`} style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">75% Complete</p>
            </div>
            
            {/* Call to Action */}
            <div className="space-y-4">
              <p className={`text-${config.primaryColor}-700 font-medium`}>
                {userRole === 'center' ? 'Complete your profile setup to start attracting families!' :
                 userRole === 'admin' ? 'Monitor and assist nurseries with their profile setup.' :
                 'In the meantime, feel free to explore other nurseries or check back soon!'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {config.actions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button 
                      size="lg" 
                      variant={action.variant as any}
                      className={action.variant === 'default' ? 
                        `bg-${config.primaryColor}-500 hover:bg-${config.primaryColor}-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold` :
                        `border-2 border-${config.primaryColor}-300 hover:border-${config.primaryColor}-500 hover:text-${config.primaryColor}-700 px-8 py-3 rounded-full transition-all duration-300 font-semibold`
                      }
                    >
                      {action.text}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Cute encouragement message */}
            <div className={`mt-12 p-6 bg-gradient-to-r from-${config.primaryColor}-50 to-${config.primaryColor}-100 rounded-2xl border border-${config.primaryColor}-200`}>
              <div className="text-4xl mb-3">🌟</div>
              <h3 className={`text-lg font-semibold text-${config.primaryColor}-800 mb-2`}>
                {userRole === 'center' ? "Your nursery profile will be amazing!" :
                 userRole === 'admin' ? "Thank you for maintaining quality standards!" :
                 "Something wonderful is being prepared!"}
              </h3>
              <p className={`text-${config.primaryColor}-700 text-sm`}>
                {userRole === 'center' ? "Every detail you add helps parents make the best choice for their children." :
                 userRole === 'admin' ? "Your oversight ensures families find the best care for their little ones." :
                 "Great nurseries take time to prepare their profiles with love and care."}
              </p>
            </div>
          </Card>
          
          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
              Made with love for children and families
              <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWaitingPage;
