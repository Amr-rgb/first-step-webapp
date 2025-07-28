"use client";

import { ProfileSection } from "@/app/[locale]/dashboard/center/profile-editor/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, Mail, Phone, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";
import Image from "next/image";

interface ProfilePreviewProps {
  sections: ProfileSection[];
  isEmpty: boolean;
}

const ProfilePreview = ({ sections, isEmpty }: ProfilePreviewProps) => {
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Empty State */}
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-16 h-16 text-blue-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 8h10M7 12h4m1 8l-1-8 1 8z" 
                  />
                </svg>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Nursery Profile
              </h1>
              
              <div className="text-6xl mb-6">🏗️</div>
              
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Coming Soon!
              </h2>
              
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Your nursery profile is still under construction. Start by adding sections from the editor to showcase your nursery's story, services, team, and more to create an amazing first impression for parents.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Add Sections</h3>
                  <p className="text-sm text-gray-600">Enable sections to tell your story</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Customize Content</h3>
                  <p className="text-sm text-gray-600">Add your unique information</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Preview & Publish</h3>
                  <p className="text-sm text-gray-600">See how it looks to parents</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>💡 Switch to <strong>Edit Mode</strong> to start building your profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = (section: ProfileSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <section 
            key={section.id}
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: section.data.image ? `url(${section.data.image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {section.data.title || 'Welcome to Our Nursery'}
              </h1>
              {section.data.subtitle && (
                <h2 className="text-2xl md:text-3xl font-light mb-6">
                  {section.data.subtitle}
                </h2>
              )}
              {section.data.description && (
                <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
                  {section.data.description}
                </p>
              )}
              {section.data.ctaText && (
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {section.data.ctaText}
                </Button>
              )}
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={section.id} className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    {section.data.title || 'About Our Nursery'}
                  </h2>
                  {section.data.description && (
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      {section.data.description}
                    </p>
                  )}
                </div>
                
                {(section.data.mission || section.data.vision) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {section.data.mission && (
                      <Card className="p-8 border-2 border-blue-100 bg-blue-50/50">
                        <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h3>
                        <p className="text-gray-700 leading-relaxed">{section.data.mission}</p>
                      </Card>
                    )}
                    {section.data.vision && (
                      <Card className="p-8 border-2 border-purple-100 bg-purple-50/50">
                        <h3 className="text-2xl font-bold text-purple-900 mb-4">Our Vision</h3>
                        <p className="text-gray-700 leading-relaxed">{section.data.vision}</p>
                      </Card>
                    )}
                  </div>
                )}
                
                {section.data.images && section.data.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {section.data.images.map((image: any, index: number) => (
                      <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <img
                          src={image.url || 'https://via.placeholder.com/400x300?text=Gallery+Image'}
                          alt={image.caption || `Gallery image ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <p className="text-white text-sm">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section key={section.id} className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {section.data.title || 'Our Services'}
                </h2>
                
                {section.data.services && section.data.services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {section.data.services.map((service: any, index: number) => (
                      <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                        <div className="mb-4">
                          <img
                            src={service.image || 'https://via.placeholder.com/300x200?text=Service'}
                            alt={service.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {service.title || 'Service Title'}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {service.description || 'Service description goes here.'}
                        </p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-8">
                    <p>No services added yet. Add services in the editor to showcase what you offer.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'programs':
        return (
          <section key={section.id} className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {section.data.title || 'Our Programs'}
                </h2>
                
                {section.data.programs && section.data.programs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {section.data.programs.map((program: any, index: number) => (
                      <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 bg-white border-2 border-primary/10 hover:border-primary/20">
                        <div className="mb-4">
                          <img
                            src={program.image || 'https://via.placeholder.com/300x200?text=Program'}
                            alt={program.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {program.title || 'Program Title'}
                        </h3>
                        {program.price && (
                          <div className="text-2xl font-bold text-primary mb-3">
                            {program.price}
                          </div>
                        )}
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {program.description || 'Program description goes here.'}
                        </p>
                        {program.features && program.features.length > 0 && (
                          <ul className="text-left text-sm text-gray-600 space-y-1 mb-4">
                            {program.features.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Learn More
                        </Button>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-8">
                    <p>No programs added yet. Add programs in the editor to showcase your offerings.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'team':
        return (
          <section key={section.id} className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {section.data.title || 'Meet Our Team'}
                </h2>
                
                {section.data.members && section.data.members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {section.data.members.map((member: any, index: number) => (
                      <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                        <div className="mb-4">
                          <img
                            src={member.image || 'https://via.placeholder.com/150x150?text=Team'}
                            alt={member.name}
                            className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {member.name || 'Team Member'}
                        </h3>
                        <p className="text-primary font-medium mb-3">
                          {member.role || 'Position'}
                        </p>
                        {member.bio && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {member.bio}
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-8">
                    <p>No team members added yet. Add team members in the editor to introduce your staff.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'activities':
        return (
          <section key={section.id} className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {section.data.title || 'Our Activities'}
                </h2>
                {section.data.subtitle && (
                  <p className="text-lg text-gray-600 mb-12">
                    {section.data.subtitle}
                  </p>
                )}
                
                {section.data.images && section.data.images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.data.images.map((image: any, index: number) => (
                      <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <img
                          src={image.url || 'https://via.placeholder.com/400x300?text=Activity'}
                          alt={image.caption || `Activity ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <p className="text-white font-medium">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-8">
                    <p>No activities added yet. Add activity images in the editor to showcase what children do.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={section.id} className="py-20 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
                  <p className="text-lg text-gray-300">We'd love to hear from you and answer any questions you may have.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {section.data.address && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Address</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{section.data.address}</p>
                    </div>
                  )}
                  
                  {section.data.phone && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Phone</h3>
                      <p className="text-gray-300">{section.data.phone}</p>
                    </div>
                  )}
                  
                  {section.data.email && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Email</h3>
                      <p className="text-gray-300">{section.data.email}</p>
                    </div>
                  )}
                  
                  {section.data.workingHours && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{section.data.workingHours}</p>
                    </div>
                  )}
                </div>
                
                {section.data.socialMedia && Object.values(section.data.socialMedia).some(url => url) && (
                  <div className="text-center mt-12">
                    <h3 className="text-lg font-semibold mb-6">Follow Us</h3>
                    <div className="flex justify-center space-x-4">
                      {section.data.socialMedia.facebook && (
                        <a href={section.data.socialMedia.facebook} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {section.data.socialMedia.instagram && (
                        <a href={section.data.socialMedia.instagram} className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {section.data.socialMedia.twitter && (
                        <a href={section.data.socialMedia.twitter} className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {section.data.socialMedia.whatsapp && (
                        <a href={section.data.socialMedia.whatsapp} className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-50 border-b border-gray-200 px-6 py-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            ✨ Live Preview - This is how your nursery profile will appear to visitors
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Changes made in edit mode will be reflected here instantly
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative">
        {sections.map(renderSection)}
        
        {/* Footer */}
        <footer className="bg-gray-50 py-8 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">
              Powered by First Step - Nursery Management Platform
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This is a preview of your nursery profile
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProfilePreview;
