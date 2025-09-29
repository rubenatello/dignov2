# Studio Backend Connection TODO & UI/UX Improvement Plan


## UI/UX Improvement Plan (Studio Writer)

- [ ] **Modern Card Layout:** Use a true card layout for the editor panel with more shadow, more padding, and a slightly raised effect. Consider a subtle gradient or soft background blur for the card.
- [ ] **Section Dividers:** Add soft section dividers (e.g., `border-b border-gray-100/80` or subtle background color blocks) between major form sections for clarity.
- [ ] **Sidebar Design Finalization:** Design and finalize the sidebar component for the article editor, ensuring a robust, modern, and visually sleek navigation with accent highlights and microinteractions.
- [ ] **StudioHeader Polish:** Make the header sticky, add a soft drop shadow, and use a more visually distinct avatar (e.g., colored circle with initials, or user photo if available).
- [ ] **Typography:** Use larger, bolder section headings, and lighter, more readable body text. Add more vertical spacing between fields and sections.
- [ ] **Button Design:** Use more visually distinct buttons (filled, outlined, ghost) with clear hover/focus states. Consider a floating save bar for actions.
- [ ] **Form Field Polish:** Add subtle focus rings, lighter backgrounds, and more padding. Use floating labels or animated placeholders for a modern feel.
- [ ] **Image Picker:** Show a thumbnail preview of the selected image, and use a grid for image selection.
- [ ] **Responsive Design:** Ensure the layout adapts beautifully to tablet and mobile, with collapsible sidebar and sticky save actions.
- [ ] **Microinteractions:** Add subtle animations for tab transitions, button presses, and form validation feedback.
- [ ] **Accessibility:** Ensure all controls are keyboard accessible, have proper aria-labels, and color contrast is sufficient.
- [ ] **Dark Mode:** Add a dark mode toggle and ensure all components look great in both themes.
- [ ] **Error/Success Feedback:** Use toasts or inline alerts for save, error, and validation feedback.
- [ ] **Loading States:** Add skeleton loaders or spinners for async actions (save, image load, etc).
- [ ] **New Article Page Styling:** Finish styling the new article page to achieve a robust and sleek UI with fewer boxes, more whitespace, and a modern card layout.

---

- [x] Scheduling: Implement backend endpoint and frontend logic for scheduled publishing
- [ ] Change Log / History: Add backend endpoint to store change log entries and wire up frontend
- [ ] Featured Image Upload: Ensure backend endpoint exists and frontend uses it for image upload and linking
- [ ] Version History: Implement backend versioning and wire up frontend to fetch/select versions
- [ ] Permissions / Auth: Replace role stub with real user/role fetching and ensure requests send session/cookie/token
- [ ] Error/Loading States: Add error/loading states for all major actions in frontend
- [ ] Word Count & Read Time: Add frontend word count and estimated read time (200-250 wpm) to article writer
- [ ] StudioHeader Back Button: Add a back button to StudioHeader that prompts 'Are you sure?' with options to save or discard draft before leaving
- [ ] Finish linking frontend to backend and tie all editor actions to APIs for full test coverage. Test writing, saving, publishing, scheduling, and image upload workflows end-to-end.

---

## Notes
- All work should be done in Docker Compose for consistency
- Reference `notes.txt` for canonical dev process and troubleshooting
- Check backend models and serializers for required fields and endpoints
- Sync frontend/backend models and API contracts

---

## Progress Log

### UI/UX Improvements
<!-- Track progress here as you implement each improvement above -->
- [x] Added scheduled_publish_time field to Article model for scheduling support
- [x] Added scheduled_publish_time to Article serializers for API support
- [x] Migrated database for scheduled_publish_time field
[x] Fixed code corruption issue where JSX was misplaced causing scheduledPublishTime undefined error
- [x] Removed unused Tiptap components (TiptapToolbar, ContentEditor, SubstackEditor) after switch to Quill
- [x] Fixed Studio page runtime errors and ensured Quill editor toolbar functionality works
