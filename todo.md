# Studio Backend Connection TODO

## Checklist

- [x] Scheduling: Implement backend endpoint and frontend logic for scheduled publishing
- [ ] Change Log / History: Add backend endpoint to store change log entries and wire up frontend
- [ ] Featured Image Upload: Ensure backend endpoint exists and frontend uses it for image upload and linking
- [ ] Version History: Implement backend versioning and wire up frontend to fetch/select versions
- [ ] Permissions / Auth: Replace role stub with real user/role fetching and ensure requests send session/cookie/token
- [ ] Error/Loading States: Add error/loading states for all major actions in frontend
- [ ] Test all API endpoints from frontend container
- [ ] Validate all major workflows (save, publish, preview, schedule, image upload)

---

## Notes
- All work should be done in Docker Compose for consistency
- Reference `notes.txt` for canonical dev process and troubleshooting
- Check backend models and serializers for required fields and endpoints
- Sync frontend/backend models and API contracts

---

## Progress Log
- [x] Added scheduled_publish_time field to Article model for scheduling support
- [x] Added scheduled_publish_time to Article serializers for API support
- [x] Migrated database for scheduled_publish_time field
[x] Fixed code corruption issue where JSX was misplaced causing scheduledPublishTime undefined error
- [x] Removed unused Tiptap components (TiptapToolbar, ContentEditor, SubstackEditor) after switch to Quill
- [x] Fixed Studio page runtime errors and ensured Quill editor toolbar functionality works
