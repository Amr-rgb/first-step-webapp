"use client";

import { ProfileSection } from "@/app/[locale]/dashboard/center/profile-editor/page";
import { Fragment, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash, CheckSquare, Square, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string | File | null;
  onChange: (file: File | null) => void;
  placeholder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  placeholder = "Upload image",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Store the actual file object
      onChange(file);
      setIsUploading(false);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Get display URL for preview
  const getDisplayUrl = () => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return value || undefined;
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (value instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(value));
      }
    };
  }, [value]);

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      <div
        onClick={handleClick}
        className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isUploading ? "bg-gray-50" : "hover:bg-gray-50"
        }`}
        aria-disabled={isUploading}
      >
        {value ? (
          <div className="relative w-full">
            <div className="relative w-full h-32 overflow-hidden rounded-md border border-gray-200 bg-white">
              <img
                src={getDisplayUrl()}
                alt="Preview"
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  console.error("Failed to load image:", value);
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmOWY5ZjkiLz4KICA8dGV4dCB4PSIzNSIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OSI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pgo8L3N2Zz4=";
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            {!isUploading && (
              <div className="absolute inset-0 bg-white/0 hover:bg-white/50 flex items-center justify-center transition-all">
                <span className="text-gray-700 bg-white/90 px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm">
                  Change Image
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              {isUploading ? "Uploading..." : "Click to upload an image"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, JPEG up to 5MB
            </p>
          </>
        )}
      </div>
      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onChange(null)}
          disabled={isUploading}
        >
          Remove Image
        </Button>
      )}
    </div>
  );
};

interface ProfileEditorProps {
  sections: ProfileSection[];
  onSectionUpdate: (sectionId: string, data: any) => void;
  onSectionToggle: (sectionId: string, enabled: boolean) => void;
  onSectionDelete: (sectionId: string) => void;
}

const ProfileEditor = ({
  sections,
  onSectionUpdate,
  onSectionToggle,
  onSectionDelete,
}: ProfileEditorProps) => {
  const t = useTranslations("dashboard.profileEditor");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const addListItem = (
    sectionId: string,
    listKey: string,
    defaultItem: any
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const currentList = section.data[listKey] || [];
      onSectionUpdate(sectionId, {
        [listKey]: [...currentList, defaultItem],
      });
    }
  };

  const updateListItem = (
    sectionId: string,
    listKey: string,
    index: number,
    updatedItem: any
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const currentList = [...(section.data[listKey] || [])];
      currentList[index] = { ...currentList[index], ...updatedItem };
      onSectionUpdate(sectionId, {
        [listKey]: currentList,
      });
    }
  };

  const removeListItem = (
    sectionId: string,
    listKey: string,
    index: number
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const currentList = [...(section.data[listKey] || [])];
      currentList.splice(index, 1);
      onSectionUpdate(sectionId, {
        [listKey]: currentList,
      });
    }
  };

  const renderSectionFields = (section: ProfileSection) => {
    switch (section.type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label>Nursery Name</Label>
              <Input
                placeholder="Enter nursery name"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Slogan</Label>
              <Input
                placeholder="Enter slogan"
                value={section.data.subtitle || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { subtitle: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Enter hero description"
                value={section.data.description || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label>Background Image</Label>
              <ImageUploader
                value={section.data.image || ""}
                onChange={(url) => onSectionUpdate(section.id, { image: url })}
              />
            </div>
            <div>
              <Label>Call-to-Action button</Label>
              <Input
                placeholder="Get Started"
                value={section.data.ctaText || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { ctaText: e.target.value })
                }
              />
            </div>
            <input type="hidden" value="#programs" />
          </div>
        );

      case "about":
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="About Our Nursery"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Tell your story..."
                value={section.data.description || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mission</Label>
                <Textarea
                  placeholder="Our mission..."
                  value={section.data.mission || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { mission: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Vision</Label>
                <Textarea
                  placeholder="Our vision..."
                  value={section.data.vision || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { vision: e.target.value })
                  }
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
                  onClick={() =>
                    addListItem(section.id, "images", { url: "", caption: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
              </div>
              {(section.data.images || []).map((image: any, index: number) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="w-full">
                    <Label>Gallery Image</Label>
                    <ImageUploader
                      value={image.url || ""}
                      onChange={(url) =>
                        updateListItem(section.id, "images", index, { url })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Caption (optional)"
                      value={image.caption || ""}
                      onChange={(e) =>
                        updateListItem(section.id, "images", index, {
                          caption: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeListItem(section.id, "images", index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Our Services"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Services</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "services", {
                      title: "",
                      description: "",
                      image: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Service
                </Button>
              </div>
              {(section.data.services || []).map(
                (service: any, index: number) => (
                  <Card
                    key={index}
                    className="p-4 border-2 border-dashed border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Service {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            removeListItem(section.id, "services", index)
                          }
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Service title"
                        value={service.title || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "services", index, {
                            title: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        placeholder="Service description"
                        value={service.description || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "services", index, {
                            description: e.target.value,
                          })
                        }
                        rows={2}
                      />
                                          <div>
                      <Label>Service Image</Label>
                      <ImageUploader
                        value={service.image_service || service.image || null}
                        onChange={(file) =>
                          updateListItem(section.id, "services", index, {
                            image_service: file,
                          })
                        }
                      />
                    </div>
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>
        );

      case "programs":
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Our Programs"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Programs</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "programs", {
                      title: "",
                      description: "",
                      price: "",
                      features: [],
                      image: "",
                      buttonText: "احجز الآن",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Program
                </Button>
              </div>
              {(section.data.programs || []).map(
                (program: any, index: number) => (
                  <Card
                    key={index}
                    className="p-4 border-2 border-dashed border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Program {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            removeListItem(section.id, "programs", index)
                          }
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Program title"
                          value={program.title || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "programs", index, {
                              title: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Price (e.g., $50/month)"
                          value={program.price || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "programs", index, {
                              price: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Program description"
                        value={program.description || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "programs", index, {
                            description: e.target.value,
                          })
                        }
                        rows={2}
                      />
                      <div>
                        <Label>Program Image</Label>
                        <ImageUploader
                          value={program.image || ""}
                          onChange={(url) =>
                            updateListItem(section.id, "programs", index, {
                              image: url,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">
                          Features (comma-separated)
                        </Label>
                        <Input
                          placeholder="Feature 1, Feature 2, Feature 3"
                          value={(program.features || []).join(", ")}
                          onChange={(e) =>
                            updateListItem(section.id, "programs", index, {
                              features: e.target.value
                                .split(",")
                                .map((f) => f.trim())
                                .filter((f) => f),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Button Text</Label>
                        <Input
                          placeholder="احجز الآن"
                          value={program.buttonText || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "programs", index, {
                              buttonText: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>
        );

      case "philosophy":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Our Philosophy</h4>
                <input
                  type="hidden"
                  value="Our Philosophy"
                  onChange={() => {}}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Our Methodology</h4>
                <input
                  type="hidden"
                  value="Our Methodology"
                  onChange={() => {}}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Our Goal</h4>
                <input type="hidden" value="Our Goal" onChange={() => {}} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Philosophy Content</Label>
                <Textarea
                  placeholder="Our philosophy..."
                  value={section.data.philosophy || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { philosophy: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div>
                <Label>Methodology Content</Label>
                <Textarea
                  placeholder="Our methodology..."
                  value={section.data.methodology || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { methodology: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div>
                <Label>Goal Content</Label>
                <Textarea
                  placeholder="Our goal..."
                  value={section.data.goal || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { goal: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case "branches":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Branches</h3>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Branches</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "branches", { name: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Branch
                </Button>
              </div>
              {(section.data.branches || []).map(
                (branch: any, index: number) => (
                  <div key={index} className="flex gap-2 items-end">
                    <Input
                      placeholder="Branch name"
                      value={branch.name || ""}
                      onChange={(e) =>
                        updateListItem(section.id, "branches", index, {
                          name: e.target.value,
                        })
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        removeListItem(section.id, "branches", index)
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Area (sqm)</Label>
                <Input
                  placeholder="2000"
                  value={section.data.area || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { area: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Classrooms</Label>
                <Input
                  placeholder="10"
                  value={section.data.classrooms || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { classrooms: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Team Members</Label>
                <Input
                  placeholder="25"
                  value={section.data.teamMembers || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { teamMembers: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Meet Our Team"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Team Members</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "members", {
                      name: "",
                      role: "",
                      image: "",
                      bio: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Member
                </Button>
              </div>
              {(section.data.members || []).map(
                (member: any, index: number) => (
                  <Card
                    key={index}
                    className="p-4 border-2 border-dashed border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Team Member {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            removeListItem(section.id, "members", index)
                          }
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Full name"
                          value={member.name || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "members", index, {
                              name: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Role/Position"
                          value={member.role || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "members", index, {
                              role: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Profile Image</Label>
                        <ImageUploader
                          value={member.image || null}
                          onChange={(file) =>
                            updateListItem(section.id, "members", index, {
                              image: file,
                            })
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Bio (optional)"
                        value={member.bio || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "members", index, {
                            bio: e.target.value,
                          })
                        }
                        rows={2}
                      />
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>
        );

      case "activities":
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Our Activities"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                placeholder="Discover what we do"
                value={section.data.subtitle || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { subtitle: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Activity Images</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "images", { url: "", caption: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
              </div>
              {(section.data.images || []).map((image: any, index: number) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="w-full">
                    <Label>Activity Image</Label>
                    <ImageUploader
                      value={image.url || image || null}
                      onChange={(file) =>
                        updateListItem(section.id, "images", index, { url: file })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Caption (optional)"
                      value={image.caption || ""}
                      onChange={(e) =>
                        updateListItem(section.id, "images", index, {
                          caption: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeListItem(section.id, "images", index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Address</Label>
                <Textarea
                  placeholder="Full address"
                  value={section.data.address || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { address: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label>Working Hours</Label>
                <Textarea
                  placeholder="Mon-Fri: 8AM-6PM"
                  value={section.data.workingHours || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, {
                      workingHours: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={section.data.phone || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input
                  placeholder="info@nursery.com"
                  value={section.data.email || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { email: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mt-4">
                Social media links have been removed as per requirements.
              </p>
              <input
                type="hidden"
                value={JSON.stringify({})}
                onChange={() => {}}
              />
            </div>
          </div>
        );

      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label>Hero Title</Label>
              <Input
                placeholder="Welcome to our nursery"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Hero Subtitle</Label>
              <Input
                placeholder="We provide a safe and nurturing environment for your child"
                value={section.data.subtitle || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { subtitle: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Hero Image</Label>
              <ImageUploader
                value={section.data.image || ""}
                onChange={(url) => onSectionUpdate(section.id, { image: url })}
              />
            </div>
          </div>
        );

      case "philosophy":
        return (
          <div className="space-y-4">
            <div>
              <Label>Philosophy Title</Label>
              <Input
                placeholder="Our Philosophy"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Philosophy Text</Label>
              <Textarea
                placeholder="Our philosophy is to provide a safe and nurturing environment for your child"
                value={section.data.text || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { text: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
        );

      case "branches":
        return (
          <div className="space-y-4">
            <div>
              <Label>Branches Title</Label>
              <Input
                placeholder="Our Branches"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Branches</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "branches", {
                      name: "",
                      address: "",
                      phone: "",
                      email: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Branch
                </Button>
              </div>
              {(section.data.branches || []).map(
                (branch: any, index: number) => (
                  <Card
                    key={index}
                    className="p-4 border-2 border-dashed border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Branch {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            removeListItem(section.id, "branches", index)
                          }
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Branch name"
                          value={branch.name || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "branches", index, {
                              name: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Branch address"
                          value={branch.address || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "branches", index, {
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Branch phone"
                          value={branch.phone || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "branches", index, {
                              phone: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Branch email"
                          value={branch.email || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "branches", index, {
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 mx-auto mb-2 opacity-50 flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
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
          Toggle sections on/off and customize their content. Changes will be
          reflected in the preview instantly.
        </p>
      </div>

      {sections.map((section) => (
        <Card
          key={section.id}
          className={`border-2 transition-all duration-200 ${
            section.enabled
              ? "border-primary/20 bg-primary/5 shadow-md"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    section.enabled ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold ${
                    section.enabled ? "text-gray-900" : "text-gray-500"
                  }`}
                >
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
                  className={
                    section.enabled ? "bg-primary hover:bg-primary/90" : ""
                  }
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
            We're working on adding more customizable sections to help you
            create the perfect nursery profile.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProfileEditor;
