                      }}
                      placeholder="Add tag and press Enter"
                      className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none py-1"
                    />
                  </div>
                </div>
                
                <FeaturedImagePicker
                  featuredImageAssetId={featuredImageAssetId}
                  setFeaturedImageAssetId={setFeaturedImageAssetId}
                  featuredImageFile={featuredImageFile}
                  setFeaturedImageFile={setFeaturedImageFile}
                  previewUrl={featuredPreviewUrl}
                  setPreviewUrl={setFeaturedPreviewUrl}
                />
              </div>
            </div>
            
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