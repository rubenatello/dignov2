
"use client";

// Slugify helper for preview/save
function slugify(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TitleSection from '../../components/studio/TitleSection';
import MetaFields from '../../components/studio/MetaFields';
import StudioHeader from '../../components/studio/StudioHeader';
import Sidebar from '../../components/studio/Sidebar';
import ActionBar from '../../components/studio/ActionBar';
import FeaturedImagePicker from '../../components/studio/FeaturedImagePicker';
import QuillEditor from '../../components/studio/QuillEditor';
import { studioAPI, Article } from '../../lib/api';

// Placeholder for role check (replace with real auth logic)
function useUserRole() {
  // TODO: Replace with real user/role fetching logic
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    // Simulate fetching user role
    setTimeout(() => setRole("writer"), 200); // Change to "subscriber" to test access denied
  }, []);
  return role;
}

export default function StudioPage() {
  // Always call hooks in the same order
  const [article, setArticle] = useState<Partial<Article>>({
    title: "",
    summary: "",
    content: "",
    category: "",
    tags: "",
    is_published: false,
    is_breaking_news: false,
    slug: "",
  });
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugInput, setSlugInput] = useState("");
  // Slug edit helpers
  const handleSlugEdit = () => {
    if (!article) return;
    setSlugInput(article.slug || "");
    setEditingSlug(true);
  };
  const handleSlugSave = () => {
    if (!article) return;
    const clean = slugInput.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    setArticle({ ...article, slug: clean });
    setEditingSlug(false);
    scheduleDebouncedAutoSave({ ...article, slug: clean });
  };
  const handleSlugCancel = () => {
    setEditingSlug(false);
    setSlugInput(article?.slug || "");
  };
  const [autosaveTime, setAutosaveTime] = useState<string | null>(null);
  const [versions, setVersions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [coAuthorId, setCoAuthorId] = useState<number | null>(null);
  const [history, setHistory] = useState<{ user: string; message: string; ts: string }[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  // Fetch current user for change log
  useEffect(() => {
    studioAPI.getCurrentUser().then(user => {
      setCurrentUser(user.username || user.email || 'unknown');
    }).catch(() => setCurrentUser('unknown'));
  }, []);
  const [featuredImageAssetId, setFeaturedImageAssetId] = useState<number | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredPreviewUrl, setFeaturedPreviewUrl] = useState<string | null>(null);
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);
  const [metaDescription, setMetaDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();
  const role = useUserRole();

  // Auto-save functionality
  const handleAutoSave = async (currentArticle: Partial<Article>) => {
    if (!currentArticle.title && !currentArticle.content) return;
    setSaveStatus('saving');
    try {
      const payload = assembleArticlePayload();
      const savedArticle = await studioAPI.saveDraft(payload);
      setArticle(savedArticle);
      setSaveStatus('saved');
      setAutosaveTime(new Date().toLocaleTimeString());
      pushHistory('autosaved');
    } catch (error) {
      setSaveStatus('error');
    }
  };

  // Debounced autosave (for rapid changes)
  const scheduleDebouncedAutoSave = (currentArticle: Partial<Article>) => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      handleAutoSave(currentArticle);
    }, 1200); // 1.2s debounce for rapid typing
  };

  // Autosave every 20 seconds
  useEffect(() => {
    if (!role || !["writer", "editor", "admin"].includes(role)) return;
    const interval = setInterval(() => {
      handleAutoSave(article);
    }, 20000);
    return () => clearInterval(interval);
  }, [role, article]);

  // Autosave on blur (when leaving editor)
  useEffect(() => {
    const handleBlur = () => {
      handleAutoSave(article);
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [article]);

  useEffect(() => {
    if (!role) return;
    if (!["writer", "editor", "admin"].includes(role)) {
      router.replace("/unauthorized?from=studio");
    }
  }, [role, router]);

  const assembleArticlePayload = (): Partial<Article> => {
    const payload: Partial<Article> = {
      ...article,
      featured_image_asset: featuredImageAssetId || undefined,
      is_breaking_news: article.is_breaking_news,
      category: article.category,
      co_author: coAuthorId || undefined,
      tags: article.tags,
      meta_description: metaDescription,
    };
    return payload;
  };

  const handleSaveDraft = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const payload = assembleArticlePayload();
      const savedArticle = await studioAPI.saveDraft(payload);
  pushHistory('draft saved');
      setArticle(savedArticle);
      setSaveStatus('saved');
      setAutosaveTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Save draft failed:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (isSaving) return;
    
    if (!article.title || !article.content || !article.category) {
      alert('Please fill in title, content, and category before publishing.');
      return;
    }
    
    setIsSaving(true);
    try {
      const payload = assembleArticlePayload();
      const publishedArticle = await studioAPI.publishArticle(payload);
  pushHistory('article published');
      setArticle(publishedArticle);
      setSaveStatus('saved');
      alert('Article published successfully!');
      // Optionally redirect to the published article
      // router.push(`/articles/${publishedArticle.slug}`);
    } catch (error) {
      console.error('Publish failed:', error);
      setSaveStatus('error');
      alert('Failed to publish article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedule = async () => {
    // TODO: Implement scheduling functionality
    alert('Scheduling feature coming soon!');
  };

  const handlePreview = async () => {
    // Validate required fields before saving draft for preview
    if (!article.title || !article.content) {
      alert('Please enter a title and content before previewing.');
      return;
    }
    const previewSlug = slugify(article.title);
    // Save draft first, wait for completion
    try {
      await handleSaveDraft();
      // Small delay to ensure backend is updated (optional, can be tuned)
      await new Promise((resolve) => setTimeout(resolve, 300));
      window.open(`/articles/preview/${previewSlug}`, '_blank');
      pushHistory('previewed article');
    } catch (err) {
      // Optionally show error to user
      alert('Failed to save draft before preview. Please try again.');
    }
  };

  const pushHistory = (message: string) => {
    setHistory(prev => [...prev.slice(-49), { user: currentUser, message, ts: new Date().toISOString() }]);
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <img src="/digno-logo.svg" alt="Digno Logo" className="w-64 max-w-xs mb-6 drop-shadow-lg" style={{filter:'drop-shadow(0 2px 8px #5B7CFA44)'}} />
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg font-medium tracking-wide">Loading Studio...</p>
        </div>
      </div>
    );
  }

  if (!["writer", "editor", "admin"].includes(role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access the Studio.</p>
        </div>
      </div>
    );
  }

  // Handlers for header and actions
  const handleVersionSelect = (v: string) => {
    // TODO: Implement version selection
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/40 to-slate-50/50">
      <div className="flex">
        <Sidebar 
          category={article.category || ""} 
          setCategory={(category: string) => { setArticle(prev => ({ ...prev, category })); pushHistory('category changed'); }}
          tags={article.tags || ""} 
          setTags={(tags: string) => { setArticle(prev => ({ ...prev, tags })); pushHistory('tags changed'); }}
          authorId={authorId}
          setAuthorId={(id: number | null) => { setAuthorId(id); pushHistory('author changed'); }}
            coAuthorId={coAuthorId}
            setCoAuthorId={(id: number | null) => { setCoAuthorId(id); pushHistory('co-author changed'); }}
          history={history}
        >
          {/* Enhanced sidebar content */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={article.is_breaking_news || false}
                  onChange={(e) => setArticle(prev => ({ ...prev, is_breaking_news: e.target.checked }))}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 transition-all duration-200"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-200">Breaking News</span>
              </label>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Article Stats</div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Word count available in editor</div>
                <div className="text-xs text-gray-500">
                  Character counting moved to editor
                </div>
              </div>
            </div>

            {/* Featured Image Picker in Sidebar */}
            <div className="mt-8">
              <FeaturedImagePicker
                featuredImageAssetId={featuredImageAssetId}
                setFeaturedImageAssetId={setFeaturedImageAssetId}
                featuredImageFile={featuredImageFile}
                setFeaturedImageFile={setFeaturedImageFile}
                previewUrl={featuredPreviewUrl}
                setPreviewUrl={setFeaturedPreviewUrl}
              />
            </div>

            {/* Preview & Save Draft Buttons in Sidebar */}
            <div className="mt-8">
              <ActionBar
                onPreview={handlePreview}
                onPublish={handlePublish}
                onSchedule={handleSchedule}
                onSaveDraft={handleSaveDraft}
                isSaving={isSaving}
                className="mt-6"
              />
            </div>
          </div>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <StudioHeader
            onUndo={() => {/* Undo functionality moved to Quill editor */}}
            onRedo={() => {/* Redo functionality moved to Quill editor */}}
            autosaveTime={autosaveTime}
            versions={versions}
            onVersionSelect={handleVersionSelect}
            saveStatus={saveStatus}
          />
          
          <main className="flex-1 max-w-6xl mx-auto p-8 w-full">
            {/* New Quill Editor */}
            <QuillEditor
              title={article.title || ""}
              summary={article.summary || ""}
              content={article.content || ""}
              onTitleChange={(title: string) => {
                setArticle(prev => ({ ...prev, title }));
                scheduleDebouncedAutoSave({ ...article, title });
              }}
              onSummaryChange={(summary: string) => {
                setArticle(prev => ({ ...prev, summary }));
                scheduleDebouncedAutoSave({ ...article, summary });
              }}
              onContentChange={(content: string) => {
                setArticle(prev => ({ ...prev, content }));
                scheduleDebouncedAutoSave({ ...article, content });
              }}
            />


                {/* Old content editor removed - now integrated into SubstackEditor */}

                <MetaFields
                  metaDescription={metaDescription}
                  tags={article.tags || ''}
                  tagInput={tagInput}
                  onMetaDescriptionChange={(val: string) => {
                    setMetaDescription(val);
                    scheduleDebouncedAutoSave({ ...article });
                  }}
                  onTagInputChange={setTagInput}
                  onRemoveTag={(tag: string) => {
                    const newTags = (article.tags || '').split(',').filter(t => t.trim() && t.trim() !== tag.trim()).join(',');
                    setArticle(prev => ({ ...prev, tags: newTags }));
                    scheduleDebouncedAutoSave({ ...article, tags: newTags });
                  }}
                  onTagKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                      e.preventDefault();
                      const current = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                      if (!current.includes(tagInput.trim())) {
                        const newTagsArr = [...current, tagInput.trim()];
                        const newTags = newTagsArr.join(',');
                        setArticle(prev => ({ ...prev, tags: newTags }));
                        scheduleDebouncedAutoSave({ ...article, tags: newTags });
                      }
                      setTagInput('');
                    }
                    if (e.key === 'Backspace' && !tagInput && article.tags) {
                      const parts = article.tags.split(',').map(t => t.trim()).filter(Boolean);
                      parts.pop();
                      const newTags = parts.join(',');
                      setArticle(prev => ({ ...prev, tags: newTags }));
                      scheduleDebouncedAutoSave({ ...article, tags: newTags });
                    }
                  }}
                />
                


            <ActionBar
              onPreview={handlePreview}
              onPublish={handlePublish}
              onSchedule={handleSchedule}
              onSaveDraft={handleSaveDraft}
              isSaving={isSaving}
              className="mt-6"
            />
          </main>
        </div>
      </div>
    </div>
  );
}
