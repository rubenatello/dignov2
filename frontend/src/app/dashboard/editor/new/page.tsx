"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useInterval } from "react-use";
import StudioHeader from "../StudioHeader";
import RichTextEditor from "../RichTextEditor";
import ImagePicker from "../ImagePicker";
import SaveActions from "../SaveActions";

const CATEGORY_CHOICES = [
	{ value: "BREAKING_NEWS", label: "Breaking News" },
	{ value: "ECONOMY", label: "Economy" },
	{ value: "POLITICS", label: "Politics" },
	{ value: "FOREIGN_AFFAIRS", label: "Foreign Affairs" },
	{ value: "IMMIGRATION", label: "Immigration" },
	{ value: "HUMAN_RIGHTS", label: "Human Rights" },
	{ value: "LEGISLATION", label: "Legislation" },
	{ value: "OPINION", label: "Opinion" },
];

export default function ArticleWriter() {
	const [formData, setFormData] = useState({
		id: "",
		title: "",
		slug: "",
		summary: "",
		content: "",
		featured_image: null,
		featured_image_asset: "",
		category: "POLITICS",
		is_breaking_news: false,
		author: "1",
		co_author: "",
		is_published: false,
		published_date: "",
		scheduled_publish_time: "",
		tags: "",
		meta_description: "",
		view_count: 0,
		created_date: "",
		updated_date: "",
	});
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("content");
	const router = useRouter();

	const authorOptions = [
		{ value: "1", label: "Admin" },
		// ...
	];
	const coAuthorOptions = [
		{ value: "", label: "None" },
		// ...
	];
	const imageAssetOptions = [
		{ value: "", label: "None" },
		// ...
	];

	const tabs = [
		{ id: "content", label: "Content" },
		{ id: "featured_image", label: "Featured Image" },
		{ id: "classification", label: "Classification" },
		{ id: "authors", label: "Authors" },
		{ id: "publishing", label: "Publishing" },
		{ id: "seo", label: "SEO & Categorization" },
		{ id: "statistics", label: "Statistics" },
	];

	useEffect(() => {
		if (!router) {
			console.error("NextRouter is not mounted.");
		}
	}, [router]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type, checked, files } = e.target as HTMLInputElement;
		setFormData({
			...formData,
			[name]: type === "checkbox"
				? checked
				: type === "file"
				? (files && files.length > 0 ? files[0] : null)
				: value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post("/api/articles/", formData);
			const articleId = response.data.id;
			router.push(`/dashboard/editor/${articleId}`);
		} catch (error) {
			console.error("Error creating article:", error);
		} finally {
			setLoading(false);
		}
	};

	const autosave = useCallback(async () => {
		try {
			await axios.put(`/api/articles/${formData.id}/`, formData);
			console.log("Autosaved successfully");
		} catch (error) {
			console.error("Autosave failed:", error);
		}
	}, [formData]);

	useInterval(() => {
		if (formData.id) {
			autosave();
		}
	}, 300000); // Autosave every 5 minutes

	// Save handlers
	const handleSave = async () => {
		setLoading(true);
		try {
			const response = await axios.post("/api/articles/", formData);
			const articleId = response.data.id;
			router.push(`/dashboard/editor/${articleId}`);
		} catch (error) {
			console.error("Error creating article:", error);
		} finally {
			setLoading(false);
		}
	};
	const handleSaveAndAddAnother = async () => {
		setLoading(true);
		try {
			await axios.post("/api/articles/", formData);
			setFormData({
				id: "",
				title: "",
				slug: "",
				summary: "",
				content: "",
				featured_image: null,
				featured_image_asset: "",
				category: "POLITICS",
				is_breaking_news: false,
				author: "1",
				co_author: "",
				is_published: false,
				published_date: "",
				scheduled_publish_time: "",
				tags: "",
				meta_description: "",
				view_count: 0,
				created_date: "",
				updated_date: "",
			});
			setActiveTab("content");
		} catch (error) {
			console.error("Error creating article:", error);
		} finally {
			setLoading(false);
		}
	};
	const handleSaveAndContinue = async () => {
		setLoading(true);
		try {
			let response;
			if (formData.id) {
				response = await axios.put(`/api/articles/${formData.id}/`, formData);
			} else {
				response = await axios.post("/api/articles/", formData);
				setFormData({ ...formData, id: response.data.id });
			}
			// Stay on page, maybe show a toast/notification
		} catch (error) {
			console.error("Error saving article:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8 flex flex-row gap-8">
			<div className="flex-1">
				<StudioHeader user={{ name: "Admin" }} />
				<h1 className="text-2xl font-bold mb-4">Write a New Article</h1>
				<div className="flex gap-4 mb-6">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							className={`px-4 py-2 rounded-md ${
								activeTab === tab.id ? "bg-primary text-white" : "bg-gray-200"
							}`}
							onClick={() => setActiveTab(tab.id)}
						>
							{tab.label}
						</button>
					))}
				</div>
				<div className="border rounded-md p-4 bg-white">
					{activeTab === "content" && (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">Title *</label>
								<input
									type="text"
									name="title"
									value={formData.title}
									onChange={handleChange}
									className="w-full border px-3 py-2 rounded-md"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Slug</label>
								<input
									type="text"
									name="slug"
									value={formData.slug}
									onChange={handleChange}
									className="w-full border px-3 py-2 rounded-md"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Summary *</label>
								<textarea
									name="summary"
									value={formData.summary}
									onChange={handleChange}
									className="w-full border px-3 py-2 rounded-md"
									rows={3}
									required
								></textarea>
								<span className="text-xs text-gray-400">Brief summary of the article</span>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Content *</label>
								<RichTextEditor
									value={formData.content}
									onChange={val => setFormData({ ...formData, content: val })}
								/>
							</div>
						</div>
					)}
					{activeTab === "featured_image" && (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">Featured Image (from library)</label>
								<ImagePicker
									value={formData.featured_image_asset ? Number(formData.featured_image_asset) : null}
									onChange={(id, img) => setFormData({ ...formData, featured_image_asset: id ? String(id) : "" })}
									showUpload={true}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Featured Image (upload)</label>
								<input type="file" name="featured_image" onChange={handleChange} className="w-full" />
							</div>
						</div>
					)}
					{activeTab === "classification" && (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">Category</label>
								<select name="category" value={formData.category} onChange={handleChange} className="w-full border px-3 py-2 rounded-md">
									{CATEGORY_CHOICES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
								</select>
							</div>
							<div>
								<label className="flex items-center gap-2">
									<input type="checkbox" name="is_breaking_news" checked={formData.is_breaking_news} onChange={handleChange} />
									Breaking News
								</label>
							</div>
						</div>
					)}
					{activeTab === "authors" && (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">Author</label>
								<select name="author" value={formData.author} onChange={handleChange} className="w-full border px-3 py-2 rounded-md">
									{authorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Co-Author</label>
								<select name="co_author" value={formData.co_author} onChange={handleChange} className="w-full border px-3 py-2 rounded-md">
									{coAuthorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
								</select>
							</div>
						</div>
					)}
					{activeTab === "publishing" && (
						<div className="space-y-4">
							<div>
								<label className="flex items-center gap-2">
									<input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} />
									Published
								</label>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Published Date</label>
								<input
									type="datetime-local"
									name="published_date"
									value={formData.published_date}
									onChange={handleChange}
									className="w-full border px-3 py-2 rounded-md"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Scheduled Publish Time</label>
								<input
									type="datetime-local"
									name="scheduled_publish_time"
									value={formData.scheduled_publish_time}
									onChange={handleChange}
									className="w-full border px-3 py-2 rounded-md"
								/>
							</div>
						</div>
					)}
					{activeTab === "seo" && (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">Tags</label>
								<input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" />
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Meta Description</label>
								<input type="text" name="meta_description" value={formData.meta_description} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" />
							</div>
						</div>
					)}
					{activeTab === "statistics" && (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">View Count</label>
								<input type="number" value={formData.view_count} readOnly className="w-full border px-3 py-2 rounded-md bg-gray-100" />
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Created Date</label>
								<input type="text" value={formData.created_date} readOnly className="w-full border px-3 py-2 rounded-md bg-gray-100" />
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Updated Date</label>
								<input type="text" value={formData.updated_date} readOnly className="w-full border px-3 py-2 rounded-md bg-gray-100" />
							</div>
						</div>
					)}
				</div>
			</div>
			<SaveActions
				loading={loading}
				onSave={handleSave}
				onSaveAndAddAnother={handleSaveAndAddAnother}
				onSaveAndContinue={handleSaveAndContinue}
			/>
		</div>
	);
}