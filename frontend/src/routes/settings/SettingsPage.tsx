import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Tag, Bell, Shield, Palette, HelpCircle, Plus, Edit3, Trash2, Check, Sun, Moon, Monitor } from 'lucide-react';
import { Button, IconButton, Input, Badge, Modal } from '@/components/common';
import { useTheme } from '@/contexts';
import { useTagsStore } from '@/stores';
import { classNames } from '@/utils/classNames';
import type { Tag as TagType } from '@/types/domain';

type SettingsTab = 'profile' | 'tags' | 'notifications' | 'security' | 'appearance' | 'help';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'tags', label: 'Tags', icon: Tag },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

// Predefined colors for tags
const tagColors = [
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#14B8A6', // teal
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6B7280', // gray
];

export const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as SettingsTab | null;
  const [activeTab, setActiveTab] = useState<SettingsTab>(tabParam && tabs.some(t => t.id === tabParam) ? tabParam : 'profile');

  // Update URL when tab changes
  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-muted mt-1">Manage your account and application preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <nav className="md:w-56 flex-shrink-0">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => handleTabChange(tab.id)}
                    className={classNames(
                      'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-muted hover:bg-gray-100 hover:text-text'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-surface rounded-xl border border-border p-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'tags' && <TagsSettings />}
          {activeTab === 'notifications' && <NotificationsSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'help' && <HelpSettings />}
        </div>
      </div>
    </div>
  );
};

// Profile Settings
const ProfileSettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-text mb-4">Profile Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Full Name</label>
          <Input defaultValue="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Email</label>
          <Input type="email" defaultValue="john@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Bio</label>
          <Input placeholder="Tell us about yourself..." />
        </div>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

// Tags Settings
const TagsSettings: React.FC = () => {
  const { tags, loadTags, addTag, updateTag, deleteTag } = useTagsStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(tagColors[0]);

  // Load tags on mount
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    await addTag(newTagName.trim(), newTagColor);
    setNewTagName('');
    setNewTagColor(tagColors[0]);
    setIsAddModalOpen(false);
  };

  const handleEditTag = async () => {
    if (!editingTag || !newTagName.trim()) return;
    
    await updateTag(editingTag.id, { 
      name: newTagName.trim(), 
      color: newTagColor 
    });
    setEditingTag(null);
    setNewTagName('');
    setNewTagColor(tagColors[0]);
  };

  const handleDeleteTag = async (tagId: string) => {
    if (confirm('Bạn có chắc muốn xóa tag này?')) {
      await deleteTag(tagId);
    }
  };

  const openEditModal = (tag: TagType) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color || tagColors[0]);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingTag(null);
    setNewTagName('');
    setNewTagColor(tagColors[0]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text">Manage Tags</h2>
          <p className="text-sm text-muted">Create and organize tags for your items</p>
        </div>
        <Button 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Tag
        </Button>
      </div>

      {/* Tags List */}
      <div className="space-y-2">
        {tags.length === 0 ? (
          <div className="text-center py-8 text-muted">
            No tags yet. Create your first tag to organize your items.
          </div>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="font-medium text-text">{tag.name}</span>
                <Badge variant="default" size="sm">
                  {Math.floor(Math.random() * 20)} items
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <IconButton
                  aria-label="Edit tag"
                  icon={<Edit3 className="w-full h-full" />}
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditModal(tag)}
                />
                <IconButton
                  aria-label="Delete tag"
                  icon={<Trash2 className="w-full h-full" />}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleDeleteTag(tag.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Tag Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingTag}
        onClose={closeModal}
        title={editingTag ? 'Edit Tag' : 'Add New Tag'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Tag Name</label>
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name..."
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {tagColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={classNames(
                    'w-8 h-8 rounded-full transition-transform hover:scale-110',
                    newTagColor === color && 'ring-2 ring-offset-2 ring-primary'
                  )}
                  style={{ backgroundColor: color }}
                >
                  {newTagColor === color && (
                    <Check className="w-4 h-4 text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Preview</label>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${newTagColor}20`,
                color: newTagColor,
              }}
            >
              {newTagName || 'Tag name'}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={editingTag ? handleEditTag : handleAddTag}
            disabled={!newTagName.trim()}
          >
            {editingTag ? 'Save Changes' : 'Add Tag'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// Placeholder Settings Components
const NotificationsSettings: React.FC = () => (
  <div>
    <h2 className="text-lg font-semibold text-text mb-4">Notification Settings</h2>
    <p className="text-muted">Configure how you receive notifications.</p>
    <div className="mt-4 space-y-3">
      {['Email notifications', 'Push notifications', 'Weekly digest'].map((item) => (
        <label key={item} className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary" />
          <span className="text-text">{item}</span>
        </label>
      ))}
    </div>
  </div>
);

const SecuritySettings: React.FC = () => (
  <div>
    <h2 className="text-lg font-semibold text-text mb-4">Security Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1">Current Password</label>
        <Input type="password" placeholder="Enter current password" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">New Password</label>
        <Input type="password" placeholder="Enter new password" />
      </div>
      <Button>Update Password</Button>
    </div>
  </div>
);

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();

  const themeOptions = [
    { id: 'light' as const, label: 'Light', icon: Sun, description: 'Light theme' },
    { id: 'dark' as const, label: 'Dark', icon: Moon, description: 'Dark theme' },
    { id: 'system' as const, label: 'System', icon: Monitor, description: 'Follow system preference' },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-text mb-4">Appearance</h2>
      <p className="text-muted mb-6">Customize the look and feel of your application.</p>
      
      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-text mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={classNames(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-gray-300 bg-surface'
                  )}
                >
                  <div className={classNames(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isActive ? 'bg-primary text-white' : 'bg-gray-100 text-muted'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={classNames(
                    'text-sm font-medium',
                    isActive ? 'text-primary' : 'text-text'
                  )}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-muted">
            Currently using <span className="font-medium text-text">{isDark ? 'dark' : 'light'}</span> mode
            {theme === 'system' && ' (based on system preference)'}
          </p>
        </div>
      </div>
    </div>
  );
};

const HelpSettings: React.FC = () => (
  <div>
    <h2 className="text-lg font-semibold text-text mb-4">Help & Support</h2>
    <div className="space-y-4">
      <a href="#" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <h3 className="font-medium text-text">Documentation</h3>
        <p className="text-sm text-muted">Learn how to use CloudHan effectively</p>
      </a>
      <a href="#" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <h3 className="font-medium text-text">Contact Support</h3>
        <p className="text-sm text-muted">Get help from our support team</p>
      </a>
      <a href="#" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <h3 className="font-medium text-text">Report a Bug</h3>
        <p className="text-sm text-muted">Help us improve by reporting issues</p>
      </a>
    </div>
  </div>
);
