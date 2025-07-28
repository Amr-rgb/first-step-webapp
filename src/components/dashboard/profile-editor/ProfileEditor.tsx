"use client";

import { ProfileSection } from "@/app/[locale]/dashboard/center/profile-editor/page";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash, CheckSquare, Square, Upload, X, Image } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface ProfileEditorProps {
  sections: ProfileSection[];
  onSectionUpdate: (sectionId: string, data: any) => void;
  onSectionToggle: (sectionId: string, enabled: boolean) => void;
  onSectionDelete: (sectionId: string) => void;
}

const ProfileEditor = ({ sections, onSectionUpdate, onSectionToggle, onSectionDelete }: ProfileEditorProps) => {
  const t = useTranslations("dashboard.profileEditor");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const addListItem = (sectionId: string, listKey: string, defaultItem: any) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const currentList = section.data[listKey] || [];
      onSectionUpdate(sectionId, {
        [listKey]: [...currentList, defaultItem]
      });
    }
  };

  const updateListItem = (sectionId: string, listKey: string, index: number, updatedItem: any) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const currentList = [...(section.data[listKey] || [])];
      currentList[index] = { ...currentList[index], ...updatedItem };
      onSectionUpdate(sectionId, {
        [listKey]: currentList
      });
    }
  };

  const removeListItem = (sectionId: string, listKey: string, index: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const currentList = [...(section.data[listKey] || [])];
      currentList.splice(index, 1);
      onSectionUpdate(sectionId, {
        [listKey]: currentList
      });
    }
  };

  const renderSectionFields = (section: ProfileSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Enter hero title"
                value={section.data.title || ''}
                onChange={e => onSectionUpdate(section.id, { title: e.target.value })}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                placeholder="Enter hero subtitle"
                value={section.data.subtitle || ''}
                onChange={e => onSectionUpdate(section.id, { subtitle: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Enter hero description"
                value={section.data.description || ''}
                onChange={e => onSectionUpdate(section.id, { description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Background Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={section.data.image || ''}
                onChange={e => onSectionUpdate(section.id, { image: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Call-to-Action Text</Label>
                <Input
                  placeholder="Get Started"
                  value={section.data.ctaText || ''}
                  onChange={e => onSectionUpdate(section.id, { ctaText: e.target.value })}
                />
              </div>
              <div>
                <Label>Call-to-Action Link</Label>
                <Input
                  placeholder="/contact"
                  value={section.data.ctaLink || ''}
                  onChange={e => onSectionUpdate(section.id, { ctaLink: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="About Our Nursery"
                value={section.data.title || ''}
                onChange={e => onSectionUpdate(section.id, { title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Tell your story..."
                value={section.data.description || ''}
                onChange={e => onSectionUpdate(section.id, { description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mission</Label>
                <Textarea
                  placeholder="Our mission..."
                  value={section.data.mission || ''}
                  onChange={e => onSectionUpdate(section.id, { mission: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Vision</Label>
                <Textarea
                  placeholder="Our vision..."
                  value={section.data.vision || ''}
                  onChange={e => onSectionUpdate(section.id, { vision: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Gallery Images</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addListItem(section.id, 'images', { url: '', caption: '' })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
              </div>
              {(section.data.images || []).map((image: any, index: number) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Image URL"
                      value={image.url || ''}
                      onChange={e => updateListItem(section.id, 'images', index, { url: e.target.value })}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Caption (optional)"
                      value={image.caption || ''}
                      onChange={e => updateListItem(section.id, 'images', index, { caption: e.target.value })}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeListItem(section.id, 'images', index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'services':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Our Services"
                value={section.data.title || ''}
                onChange={e => onSectionUpdate(section.id, { title: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Services</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addListItem(section.id, 'services', { title: '', description: '', image: '' })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Service
                </Button>
              </div>
              {(section.data.services || []).map((service: any, index: number) => (
                <Card key={index} className="p-4 border-2 border-dashed border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Service {index + 1}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeListItem(section.id, 'services', index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Service title"
                      value={service.title || ''}
                      onChange={e => updateListItem(section.id, 'services', index, { title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Service description"
                      value={service.description || ''}
                      onChange={e => updateListItem(section.id, 'services', index, { description: e.target.value })}
                      rows={2}
                    />
                    <Input
                      placeholder="Service image URL"
                      value={service.image || ''}
                      onChange={e => updateListItem(section.id, 'services', index, { image: e.target.value })}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 'programs':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Our Programs"
                value={section.data.title || ''}
                onChange={e => onSectionUpdate(section.id, { title: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Programs</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addListItem(section.id, 'programs', { title: '', description: '', price: '', features: [], image: '' })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Program
                </Button>
              </div>
              {(section.data.programs || []).map((program: any, index: number) => (
                <Card key={index} className="p-4 border-2 border-dashed border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Program {index + 1}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeListItem(section.id, 'programs', index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Program title"
                        value={program.title || ''}
                        onChange={e => updateListItem(section.id, 'programs', index, { title: e.target.value })}
                      />
                      <Input
                        placeholder="Price (e.g., $50/month)"
                        value={program.price || ''}
                        onChange={e => updateListItem(section.id, 'programs', index, { price: e.target.value })}
                      />
                    </div>
                    <Textarea
                      placeholder="Program description"
                      value={program.description || ''}
                      onChange={e => updateListItem(section.id, 'programs', index, { description: e.target.value })}
                      rows={2}
                    />
                    <Input
                      placeholder="Program image URL"
                      value={program.image || ''}
                      onChange={e => updateListItem(section.id, 'programs', index, { image: e.target.value })}
                    />
                    <div>
                      <Label className="text-sm">Features (comma-separated)</Label>
                      <Input
                        placeholder="Feature 1, Feature 2, Feature 3"
                        value={(program.features || []).join(', ')}
                        onChange={e => updateListItem(section.id, 'programs', index, { features: e.target.value.split(',').map(f => f.trim()).filter(f => f) })}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 'team':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Meet Our Team"
                value={section.data.title || ''}
                onChange={e => onSectionUpdate(section.id, { title: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Team Members</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addListItem(section.id, 'members', { name: '', role: '', image: '', bio: '' })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Member
                </Button>
              </div>
              {(section.data.members || []).map((member: any, index: number) => (
                <Card key={index} className="p-4 border-2 border-dashed border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Team Member {index + 1}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeListItem(section.id, 'members', index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Full name"
                        value={member.name || ''}
                        onChange={e => updateListItem(section.id, 'members', index, { name: e.target.value })}
                      />
                      <Input
                        placeholder="Role/Position"
                        value={member.role || ''}
                        onChange={e => updateListItem(section.id, 'members', index, { role: e.target.value })}
                      />
                    </div>
                    <Input
                      placeholder="Profile image URL"
                      value={member.image || ''}
                      onChange={e => updateListItem(section.id, 'members', index, { image: e.target.value })}
                    />
                    <Textarea
                      placeholder="Bio (optional)"
                      value={member.bio || ''}
                      onChange={e => updateListItem(section.id, 'members', index, { bio: e.target.value })}
                      rows={2}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 'activities':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Our Activities"
                value={section.data.title || ''}
                onChange={e => onSectionUpdate(section.id, { title: e.target.value })}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                placeholder="Discover what we do"
                value={section.data.subtitle || ''}
                onChange={e => onSectionUpdate(section.id, { subtitle: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Activity Images</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addListItem(section.id, 'images', { url: '', caption: '' })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
              </div>
              {(section.data.images || []).map((image: any, index: number) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Activity image URL"
                      value={image.url || ''}
                      onChange={e => updateListItem(section.id, 'images', index, { url: e.target.value })}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Caption (optional)"
                      value={image.caption || ''}
                      onChange={e => updateListItem(section.id, 'images', index, { caption: e.target.value })}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeListItem(section.id, 'images', index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Address</Label>
                <Textarea
                  placeholder="Full address"
                  value={section.data.address || ''}
                  onChange={e => onSectionUpdate(section.id, { address: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Working Hours</Label>
                <Textarea
                  placeholder="Mon-Fri: 8AM-6PM"
                  value={section.data.workingHours || ''}
                  onChange={e => onSectionUpdate(section.id, { workingHours: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={section.data.phone || ''}
                  onChange={e => onSectionUpdate(section.id, { phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input
                  placeholder="info@nursery.com"
                  value={section.data.email || ''}
                  onChange={e => onSectionUpdate(section.id, { email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Social Media Links</Label>
              <div className="space-y-2">
                {['facebook', 'instagram', 'twitter', 'whatsapp'].map(platform => (
                  <div key={platform} className="flex items-center gap-2">
                    <Label className="w-20 text-sm capitalize">{platform}</Label>
                    <Input
                      placeholder={`${platform} URL`}
                      value={section.data.socialMedia?.[platform] || ''}
                      onChange={e => onSectionUpdate(section.id, {
                        socialMedia: {
                          ...section.data.socialMedia,
                          [platform]: e.target.value
                        }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Section type not implemented yet</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Available Sections
        </h2>
        <p className="text-gray-600">
          Toggle sections on/off and customize their content. Changes will be reflected in the preview instantly.
        </p>
      </div>
      
      {sections.map((section) => (
        <Card key={section.id} className={`border-2 transition-all duration-200 ${
          section.enabled 
            ? 'border-primary/20 bg-primary/5 shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  section.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <h3 className={`text-lg font-semibold ${
                  section.enabled ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {section.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {section.enabled && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSectionDelete(section.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  size="sm"
                  variant={section.enabled ? "default" : "outline"}
                  onClick={() => onSectionToggle(section.id, !section.enabled)}
                  className={section.enabled ? 'bg-primary hover:bg-primary/90' : ''}
                >
                  {section.enabled ? (
                    <>
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Enable
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {section.enabled && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                {renderSectionFields(section)}
              </div>
            )}
          </div>
        </Card>
      ))}
      
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            More sections coming soon!
          </h3>
          <p className="text-gray-500">
            We're working on adding more customizable sections to help you create the perfect nursery profile.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProfileEditor;
